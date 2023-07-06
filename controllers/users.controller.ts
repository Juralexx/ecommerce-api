import mongoose from 'mongoose'
const ObjectID = mongoose.Types.ObjectId
import { Request, Response } from 'express'
import UserModel from '../models/user.model.js'
import bcrypt from 'bcryptjs'
import { userErrors } from '../errors/users.errors.js'
import { userRegisterErrors } from '../errors/sign.errors.js'
import { isPasswordStrong } from '../utils/utils.js'
import { cache } from '../app.js'

/**
 * User register function
 */

export const register = async (req: Request, res: Response) => {
    //Body request destructuration
    const { name, lastname, email, password, role, phone, image } = req.body

    //Database document creation
    await UserModel
        .create({ name, lastname, email, password, image, role, phone })
        .then(docs => {
            //We send the response to client
            return res.send(docs)
        })
        .catch(err => {
            //If theres's errors we convert them to human readable message and send 'em
            const errors = userRegisterErrors(err);
            return res.status(400).send({ errors })
        })
}

/**
 * Update user profil
 */

export const updateUser = async (req: Request, res: Response) => {
    //Body request destructuration
    const { name, lastname, email, password, newPassword, role, image, phone } = req.body

    //Check that the id params exists
    if (req.params.id) {
        //Check if the id params is a valide MongoDB ID
        if (!ObjectID.isValid(req.params.id))
            return res.status(400).send("ID unknown : " + req.params.id);
        else {
            //If req.body contains current password and new password
            if (password && newPassword) {
                //If the password is not strong enough, we return the appropriate error
                if (!isPasswordStrong(newPassword)) {
                    return res.status(400).send({ errors: { newPassword: `Votre mot de passe ne respecte pas les conditions requises, celui-ci doit contenir au moins : ${'- Une majuscule'} ${'- Une minuscule'} ${'- Un chiffre'} ${'- Un charactère spécial'} ${'- Contenir 8 caractères'}` } })
                }
                //Check that the user exists
                const user = await UserModel.findById(req.params.id)
                if (user) {
                    //Decode the hash password and verify it
                    const isSamePassword = await bcrypt.compare(password, user.password);
                    //If the password is the same
                    if (isSamePassword) {
                        //Hash the new password
                        const salt = await bcrypt.genSalt();
                        const hash = await bcrypt.hash(newPassword, salt);
                        //Update the user password
                        await UserModel.findByIdAndUpdate({
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

            //Database document update
            await UserModel.findByIdAndUpdate({
                _id: req.params.id
            }, {
                $set: {
                    name: name,
                    lastname: lastname,
                    email: email,
                    role: role,
                    image: image,
                    phone: phone
                },
            }, {
                new: true,
                runValidators: true,
                context: 'query',
            })
                .then(docs => {
                    //Clear the current object caches
                    cache.del(`/api/users`);
                    cache.del(`/api/users/${req.params.id}`);
                    //We send the response to client
                    return res.send(docs)
                })
                .catch(err => {
                    //If theres's errors we convert them to human readable message and send 'em
                    const errors = userErrors(err)
                    return res.status(400).send({ errors })
                })
        }
    }
};