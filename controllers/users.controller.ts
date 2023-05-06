import mongoose from 'mongoose'
const ObjectID = mongoose.Types.ObjectId
import { Request, Response } from 'express'
import UserModel from '../models/user.model.ts'
import * as argon2 from 'argon2'
import { userErrors } from '../errors/users.errors.ts'
import { registerErrors } from '../errors/sign.errors.ts'
import { isPasswordStrong } from '../utils/utils.js'

/**
 * User register function
 */

export const register = async (req: Request, res: Response) => {
    const { name, lastname, email, password, role, phone, image } = req.body

    await UserModel.create({ name, lastname, email, password, image, role, phone })
        .then(docs => {
            return res.send(docs)
        })
        .catch(err => {
            const errors = registerErrors(err);
            return res.status(400).send({ errors })
        })
}

/**
 * Update user profil
 */

export const updateUser = async (req: Request, res: Response) => {
    const { name, lastname, email, password, newPassword, role, image, phone } = req.body

    if (req.params.id) {
        if (!ObjectID.isValid(req.params.id))
            return res.status(400).send("ID unknown : " + req.params.id);
        else {
            if (password && newPassword) {
                if (!isPasswordStrong(newPassword)) {
                    return res.status(400).send({ errors: { newPassword: `Votre mot de passe ne respecte pas les conditions requises, celui-ci doit contenir au moins : ${'- Une majuscule'} ${'- Une minuscule'} ${'- Un chiffre'} ${'- Un charactère spécial'} ${'- Contenir 8 caractères'}` } })
                }
                const user = await UserModel.findById(req.params.id)
                if (user) {
                    const isSamePassword = await argon2.verify(user.password, password);
                    if (isSamePassword) {
                        const hash = await argon2.hash(newPassword)
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
                    return res.send(docs)
                })
                .catch(err => {
                    const errors = userErrors(err)
                    return res.status(400).send({ errors })
                })
        }
    }
};