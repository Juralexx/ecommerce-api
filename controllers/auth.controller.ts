import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { loginErrors } from '../errors/sign.errors.js'
import { UserDocument } from '../types/types.js'

//30 days
const maxAge = 30 * 24 * 60 * 60 * 1000;

/**
 * Create unique token to validate user authenticity
 * @param id ID used to create the token
 */

const createToken = (id: string) => {
    return jwt.sign({ id }, process.env.JWT_TOKEN, { expiresIn: maxAge });
};

/**
 * User login function
 * @param model MongoDB model
 */

export const login = async (req: Request, res: Response, model: UserDocument) => {
    const { email, password } = req.body;
    //Header to define if the request come from the dashboard or site
    const type = req.get('AuthType');

    const domain = process.env.NODE_ENV === 'production' ? process.env.ROOT_DOMAIN : 'localhost';

    try {
        //Check that the email and password are valide in the database within the
        //model static login method
        const user = await model.login(email, password);
        //Token creation
        const token = createToken(user._id);
        //Send the JWT cookie with the token as value
        res.cookie(`jwt_${type}`, token, { httpOnly: false, maxAge: maxAge, domain: domain });
        //Send the user ID
        res.status(200).json({ user: user._id });
    } catch (err) {
        //If there's errors we return the current error
        const errors = loginErrors(err);
        res.status(400).send({ errors });
    };
};

/**
 * Logout function, remove the unique jwt token and redirect to the root page
 */

export const logout = (req: Request, res: Response) => {
    //Header to define if the request come from the dashboard or site
    const type = req.get('AuthType');
    const domain = process.env.NODE_ENV === 'production' ? process.env.ROOT_DOMAIN : 'localhost';
    //We remove the JWT cookie
    res.cookie(`jwt_${type}`, '', { maxAge: 1, domain: domain });
    //We send validation message
    res.status(200).send({ message: 'Successfully logged out' });
};