import mongoose from 'mongoose'
const ObjectID = mongoose.Types.ObjectId
import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import CustomerModel from '../models/customer.model.js';
import { ICustomer } from '../types/types';
import { customerErrors } from '../errors/customers.errors.js';
import { convertStringToRegexp, isPasswordStrong, isPhoneValid, isValidPostcode, onlyNumbers, sanitize } from '../utils/utils.js';
import { customerRegisterErrors } from '../errors/sign.errors.js';
import { cache } from '../app.js';

/**
 * User register function
 */

export const register = async (req: Request, res: Response) => {
    //Body request destructuration
    const { title, birth, name, lastname, email, password, addresses, phone, cart, orders }: ICustomer = req.body;

    //If the 'adresse' property exists and contains at least one element
    if (addresses && addresses.length > 0) {
        //For each address
        for (let i = 0; i < addresses.length; i++) {
            const { name, lastname, street, city, postcode, phone } = addresses[i];

            //If one of the { name, lastname, street, city, postcode, phone } values is missing
            //we return the appropriate error
            if (name.length === 0) {
                return res.status(400).send({ errors: { [`name-${i}`]: 'Veuillez saisir un prénom valide.' } });
            }
            if (lastname.length === 0) {
                return res.status(400).send({ errors: { [`lastname-${i}`]: 'Veuillez saisir un nom valide.' } });
            }
            if (street.length === 0) {
                return res.status(400).send({ errors: { [`street-${i}`]: 'Veuillez saisir une rue valide.' } });
            }
            if (city.length === 0) {
                return res.status(400).send({ errors: { [`city-${i}`]: 'Veuillez saisir une ville valide.' } });
            }
            if (!isValidPostcode(postcode)) {
                return res.status(400).send({ errors: { [`postcode-${i}`]: 'Veuillez saisir un code postal valide.' } });
            }
            if (phone.length === 0 || !isPhoneValid(phone)) {
                return res.status(400).send({ errors: { [`phone-${i}`]: 'Veuillez saisir un départment valide.' } });
            }
        };
    };

    //Database document creation
    await CustomerModel.create({
        title,
        name,
        lastname,
        email,
        password,
        birth,
        addresses,
        phone,
        cart,
        orders,
        registration_date: new Date()
    })
        .then(docs => {
            //We send the response to client
            return res.send(docs);
        })
        .catch(err => {
            //If theres's errors we convert them to human readable message and send 'em
            console.log(err);
            const errors = customerRegisterErrors(err);
            return res.status(400).send({ errors });
        });
};

/**
 * Get customers
 */

export const getCustomers = async (req: Request, res: Response) => {
    //We assign core values to the option object
    //p = current page
    //limit = number of returned objects
    //select = we remove the password from the reponse so it's not sent to the client
    let options: Record<string, any> = {
        p: 1,
        limit: 24,
        select: '-password'
    };

    //If there's query params
    if (req.query) {
        //If the 'limit' query params exists
        if (req.query.limit) {
            //Convert it to string and sanitize it
            options.limit = sanitize(String(req.query.limit));
            //Convert it to number
            options.limit = Number(options.limit);
        }
        //If the 'sort' query params exists
        if (req.query.sort) {
            //Convert it to string and sanitize it
            options.sort = sanitize(String(req.query.sort));
            //Check if the sort parameter has a value provided as : variants.price.desc
            const isArray: string[] = options.sort.split('.');
            //If the values is splittable
            if (isArray.length > 0) {
                //Get the possible direction
                const direction = isArray[isArray.length - 1];
                //Checki if the last value is a direction : 'asc' or 'desc
                if (direction === 'asc' || direction === 'desc') {
                    //Convert the splitted string back to a string and remove the direction (last element)
                    const query = isArray
                        .slice(0, isArray.length - 1)
                        .map(value => value)
                        .join('.');
                    //Assign the new sort query to the 'options' object
                    options.sort = { [query]: direction };
                }
            }
        }
        //If the 'p' query params exists
        if (req.query.p && onlyNumbers(req.query.p)) {
            //Convert it to number
            options.p = Number(req.query.p);
        }
        //If the 'populate' query params exists
        if (req.query.populate) {
            //Convert it to string and sanitize it
            options.populate = sanitize(String(req.query.populate));
        }
        //If the 'select' query params exists
        if (req.query.select) {
            //Convert it to string and sanitize it
            options.select = sanitize(String(req.query.select));
        }
        //If the 'q' query params exists
        if (req.query.q) {
            //Convert it to string and sanitize it
            const q = sanitize(String(req.query.q));
            //Convert it to MongoDB caseSensitive Regexp
            const regex = convertStringToRegexp(q);
            //Add the query to the options object processing an $or operator
            //to make a search in multiple fields
            options.query = {
                ...options.query,
                "$or": [
                    { "name": { "$regex": regex } },
                    { "lastname": { "$regex": regex } },
                    { "email": { "$regex": regex } },
                ]
            };
        };
    };

    //Count the number of documents matching the query ('q' param)
    const count = await CustomerModel.countDocuments(options.query);

    //Check that the 'p' (page) params is not greater than the maximum value it could take
    //So we prevent 'no document found' error
    //Maximum value = number of documents / number of documents per page
    if (options.p) {
        //If 'p' param if greater than the maximum value it could take
        //We assign to it the maximum value it could take
        if (options.p > Math.ceil(count / options.limit)) {
            options.p = Math.ceil(count / options.limit);
        }
        //If 'p' param is smaller than 1 => p = 1
        if (options.p < 1) {
            options.p = 1;
        }
    };

    //Launch the query search
    try {
        await CustomerModel
            .find(options.query)
            //Limit the number of documents required
            .limit(options.limit)
            //We skip the number of documents to return document from current page
            .skip((options.p - 1) * options.limit)
            //Populate customer orders
            .populate(options.select && options.select.includes('-orders') ? undefined : { path: 'orders' })
            .populate(options.populate)
            .select(options.select)
            .select('-password')
            .sort(options.sort)
            .then(async docs => {
                cache.set(req.originalUrl, JSON.stringify({
                    //Documents array
                    documents: docs,
                    //Number of documents
                    count: count,
                    //Current page
                    currentPage: options.p,
                    //Limit of documents per page
                    limit: options.limit
                }));
                return res.status(200).send({
                    //Documents array
                    documents: docs,
                    //Number of documents
                    count: count,
                    //Current page
                    currentPage: options.p,
                    //Limit of documents per page
                    limit: options.limit
                })
            });
    } catch (err) {
        return res.status(400).send({ message: err });
    };
};

/**
 * Update category
 */

export const updateCustomer = async (req: Request, res: Response) => {
    //Body request destructuration
    const { title, birth, name, lastname, email, password, confirmPassword, newPassword, addresses, phone, cart, orders } = req.body;

    //Check that the id params exists
    if (req.params.id) {
        //Check if the id params is a valide MongoDB ID
        if (!ObjectID.isValid(req.params.id))
            return res.status(400).send("ID unknown : " + req.params.id);
        else {
            //If req.body contains current password and new password
            if (password && newPassword) {
                //If the new password is not strong enough, we return the appropriate error
                if (!isPasswordStrong(newPassword)) {
                    return res.status(400).send({ errors: { newPassword: `Votre mot de passe ne respecte pas les conditions requises, celui-ci doit contenir au moins : ${'- Une majuscule'} ${'- Une minuscule'} ${'- Un chiffre'} ${'- Un charactère spécial'} ${'- Contenir 8 caractères'}` } });
                }
                //If the password and confirm password are not the same, we return the appropriate error
                if (password !== confirmPassword) {
                    return res.status(400).send({ errors: { confirmPassword: 'Les mots de passe ne correspondent pas.' } });
                }
                //Check that the user exists
                const user = await CustomerModel.findById(req.params.id);
                if (user) {
                    //Decode the hash password and verify it
                    const isSamePassword = await bcrypt.compare(password, user.password);
                    //If the password is the same
                    if (isSamePassword) {
                        //Hash the new password
                        const salt = await bcrypt.genSalt();
                        const hash = await bcrypt.hash(newPassword, salt);
                        //Update the user password
                        await CustomerModel.findByIdAndUpdate({
                            _id: req.params.id
                        }, {
                            $set: {
                                password: hash
                            },
                        }, {
                            new: true,
                            runValidators: true,
                            context: 'query',
                        })
                    } else {
                        return res.status(400).send({ errors: { password: 'Mot de passe incorrect' } });
                    };
                };
            }

            //If the 'adresse' property exists and contains at least one element
            if (addresses && addresses.length > 0) {
                for (let i = 0; i < addresses.length; i++) {
                    //For each adresses
                    const { name, lastname, street, city, postcode, phone } = addresses[i];

                    //If one of the { name, lastname, street, city, postcode, phone } values is missing
                    //we return the appropriate error
                    if (name.length === 0) {
                        return res.status(400).send({ errors: { [`name-${i}`]: 'Veuillez saisir un prénom valide.' } });
                    }
                    if (lastname.length === 0) {
                        return res.status(400).send({ errors: { [`lastname-${i}`]: 'Veuillez saisir un nom valide.' } });
                    }
                    if (street.length === 0) {
                        return res.status(400).send({ errors: { [`street-${i}`]: 'Veuillez saisir une rue valide.' } });
                    }
                    if (city.length === 0) {
                        return res.status(400).send({ errors: { [`city-${i}`]: 'Veuillez saisir une ville valide.' } });
                    }
                    if (!isValidPostcode(postcode)) {
                        return res.status(400).send({ errors: { [`postcode-${i}`]: 'Veuillez saisir un code postal valide.' } });
                    }
                    if (phone.length === 0 || !isPhoneValid(phone)) {
                        return res.status(400).send({ errors: { [`phone-${i}`]: 'Veuillez saisir un départment valide.' } });
                    }
                };
            };

            //Database document update
            await CustomerModel.findByIdAndUpdate({
                _id: req.params.id
            }, {
                $set: {
                    title,
                    name,
                    lastname,
                    email,
                    birth,
                    addresses,
                    phone,
                    cart,
                },
                $addToSet: {
                    orders
                }
            }, {
                new: true,
                runValidators: true,
                context: 'query',
            })
                .then(docs => {
                    //Clear the current object caches
                    cache.del(`/api/customers`);
                    cache.del(`/api/customers/${req.params.id}`);
                    //We send the response to client
                    return res.send(docs);
                })
                .catch(err => {
                    //If theres's errors we convert them to human readable message and send 'em
                    const errors = customerErrors(err);
                    return res.status(400).send({ errors });
                });
        };
    };
};