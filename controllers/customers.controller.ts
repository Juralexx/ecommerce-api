import mongoose from 'mongoose'
const ObjectID = mongoose.Types.ObjectId
import { Request, Response } from 'express'
import * as argon2 from 'argon2'
import CustomerModel from '../models/customer.model.ts';
import { ICustomer } from '../types/types';
import { customerErrors } from '../errors/customers.errors.ts';
import { isPasswordStrong, isValidPostcode, sanitize } from '../utils/utils.js';

/**
 * User register function
 */

export const register = async (req: Request, res: Response) => {
    const { title, birth, name, lastname, email, password, addresses, phone, cart, orders, registration_date }: ICustomer = req.body

    if (addresses.length > 0) {
        for (let i = 0; i < addresses.length; i++) {
            const { street, city, postcode, department, region } = addresses[i]
            if (street.length === 0) {
                return res.status(400).send({ errors: { [`street-${i}`]: 'Veuillez saisir une rue valide.' } })
            }
            if (city.length === 0) {
                return res.status(400).send({ errors: { [`city-${i}`]: 'Veuillez saisir une ville valide.' } })
            }
            if (!isValidPostcode(postcode)) {
                return res.status(400).send({ errors: { [`postcode-${i}`]: 'Veuillez saisir un code postal valide.' } })
            }
            if (department.length === 0) {
                return res.status(400).send({ errors: { [`department-${i}`]: 'Veuillez saisir un département valide.' } })
            }
            if (region.length === 0) {
                return res.status(400).send({ errors: { [`region-${i}`]: 'Veuillez saisir une région valide.' } })
            }
        }
    }

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
        registration_date
    })
        .then(docs => {
            return res.send(docs)
        })
        .catch(err => {
            const errors = customerErrors(err);
            return res.status(400).send({ errors })
        })
}

/**
 * Get customers
 */

export const getCustomers = async (req: Request, res: Response) => {
    let options: Record<string, any> = {
        p: 1,
        limit: 24,
        select: '-password'
    }

    if (req.query) {
        if (req.query.limit) {
            options.limit = sanitize(String(req.query.limit))
            options.limit = Number(options.limit)
        }
        if (req.query.sort) {
            options.sort = sanitize(String(req.query.sort))
        }
        if (req.query.p) {
            options.p = Number(req.query.p)
        }
        if (req.query.populate) {
            options.populate = sanitize(String(req.query.populate))
        }
        if (req.query.select) {
            options.select = sanitize(String(req.query.select))
        }
    }

    const count = await CustomerModel.countDocuments();

    if (options.p) {
        if (options.p > Math.ceil(count / options.limit)) {
            options.p = Math.ceil(count / options.limit)
        }
        if (options.p < 1) {
            options.p = 1
        }
    }

    try {
        await CustomerModel
            .find()
            .limit(options.limit)
            .skip((options.p - 1) * options.limit)
            .populate({
                path: 'orders',
            })
            .populate(options.populate)
            .select(options.select)
            .sort(options.sort)
            .then(async docs => {
                return res.status(200).send({
                    documents: docs,
                    count: count,
                    currentPage: options.p,
                    limit: options.limit
                })
            })
    } catch (err) {
        return res.status(400).send({ message: err })
    }
}

/**
 * Update category
 */

export const updateCustomer = async (req: Request, res: Response) => {
    const { title, birth, name, lastname, email, password, confirmPassword, newPassword, addresses, phone, cart, orders } = req.body

    if (req.params.id) {
        if (!ObjectID.isValid(req.params.id))
            return res.status(400).send("ID unknown : " + req.params.id);
        else {
            if (password && newPassword) {
                if (!isPasswordStrong(newPassword)) {
                    return res.status(400).send({ errors: { newPassword: `Votre mot de passe ne respecte pas les conditions requises, celui-ci doit contenir au moins : ${'- Une majuscule'} ${'- Une minuscule'} ${'- Un chiffre'} ${'- Un charactère spécial'} ${'- Contenir 8 caractères'}` } })
                }
                if (password !== confirmPassword) {
                    return res.status(400).send({ errors: { confirmPassword: 'Les mots de passe ne correspondent pas.' } })
                }
                const user = await CustomerModel.findById(req.params.id)
                if (user) {
                    const isSamePassword = await argon2.verify(user.password, password);
                    if (isSamePassword) {
                        const hash = await argon2.hash(newPassword)
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
                        return res.status(400).send({ errors: { password: 'Mot de passe incorrect' } })
                    }
                }
            }
            if (addresses.length > 0) {
                for (let i = 0; i < addresses.length; i++) {
                    const { street, city, postcode, department, region } = addresses[i]
                    if (street.length === 0) {
                        return res.status(400).send({ errors: { [`street-${i}`]: 'Veuillez saisir une rue valide.' } })
                    }
                    if (city.length === 0) {
                        return res.status(400).send({ errors: { [`city-${i}`]: 'Veuillez saisir une ville valide.' } })
                    }
                    if (!isValidPostcode(postcode)) {
                        return res.status(400).send({ errors: { [`postcode-${i}`]: 'Veuillez saisir un code postal valide.' } })
                    }
                    if (department.length === 0) {
                        return res.status(400).send({ errors: { [`department-${i}`]: 'Veuillez saisir un départment valide.' } })
                    }
                    if (region.length === 0) {
                        return res.status(400).send({ errors: { [`region-${i}`]: 'Veuillez saisir une région valide.' } })
                    }
                }
            }
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
                    return res.send(docs)
                })
                .catch(err => {
                    const errors = customerErrors(err);
                    return res.status(400).send({ errors })
                })
        }
    }
};