import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { loginErrors } from '../errors/sign.errors.js'
import { UserDocument } from '../types/types.js'

/**
 * Create unique token to validate user authenticity
 */

const maxAge = 3000 * 24 * 60 * 60 * 1000

const createToken = (id: string) => {
    return jwt.sign({ id }, process.env.JWT_TOKEN, { expiresIn: maxAge })
}

/**
 * User login function
 */

export const login = async (req: Request, res: Response, model: UserDocument) => {
    const { email, password } = req.body

    try {
        const user = await model.login(email, password)
        const token = createToken(user._id)
        res.cookie('jwt', token, { httpOnly: false, maxAge: maxAge })
        res.status(200).json({ user: user._id })
    } catch (err) {
        const errors = loginErrors(err)
        res.send({ errors });
    }
}

/**
 * Logout function, remove the unique jwt token and redirect to the root page
 * @param {*} req 
 * @param {*} res 
 */

export const logout = (req: Request, res: Response) => {
    res.cookie('jwt', '', { maxAge: 1 })
    res.status(200).send({ message: 'Successfully logged out' })
}