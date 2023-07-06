import { NextFunction, Request, Response } from 'express'
import jwt, { VerifyErrors } from 'jsonwebtoken'
import UserModel from '../models/user.model.js'
import CustomerModel from '../models/customer.model.js';

/**
 * Middleware that checks on every request that the user is authenticated and has a valid JWT token
 */

export const checkUser = (req: Request, res: Response, next: NextFunction) => {
    const type = req.get('AuthType');
    //Return the current JWT stored in the JWT cookie
    const token = req.cookies[`jwt_${type}`];
    //If the cookie exists and contains a value
    if (token !== undefined) {
        //Decode and verify the value of the JWT cookie
        //We pass the JWT cookie value and the secret JWT_TOKEN variable to the 'verify' function
        jwt.verify(token, process.env.JWT_TOKEN, async (error: VerifyErrors, decodedToken: any) => {
            //If the value of the cookie is not a valid JWT token
            if (error) {
                //We assign the 'null' value the to 'user' property in the temporary 'locals' object of the request
                res.locals.user = null;
                //We remove the JWT cookie
                res.cookie(`jwt_${type}`, '', { maxAge: 1 });
                next();
            }
            //If the value of the JWT cookie is a valid token
            else {
                //We retrieve the user document from the databse
                let user = null;
                if (type === 'user') {
                    user = await UserModel.findById(decodedToken.id);
                }
                if (type === 'customer') {
                    user = await CustomerModel.findById(decodedToken.id);
                }
                //We assign the user document the to 'user' property in the temporary 'locals' object of the request
                res.locals.user = user;
                next();
            }
        });
    }
    //Else the cookie does't exists
    else {
        //We assign the 'null' value the to 'user' property in the temporary 'locals' object of the request
        res.locals.user = null;
        next();
    }
};

//Middleware that checks if the user in authenticated

export const requireAuthentication = (req: Request, res: Response, next: NextFunction) => {
    const type = req.get('AuthType');
    //Return the current JWT stored in the JWT cookie
    const token = req.cookies[`jwt_${type}`];
    //If the cookie exists and contains a value
    if (token) {
        //Decode and verify the value of the JWT cookie
        //We pass the JWT cookie value and the secret JWT_TOKEN variable to the 'verify' function
        jwt.verify(token, process.env.JWT_TOKEN, async (error: VerifyErrors, decodedToken: any) => {
            //If the cookie value is not valid, we stop the request
            if (error) {
                res.end()
            }
            //If the JWT token is valid, we continue the request
            else {
                next();
            }
        });
    }
    //If the cookie doesn't exists or has no value, we close the request
    else {
        res.end()
    }
};