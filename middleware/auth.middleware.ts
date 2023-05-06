import { NextFunction, Request, Response } from 'express'
import jwt, { VerifyErrors } from 'jsonwebtoken'
import UserModel from '../models/user.model.js'

export const checkUser = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, process.env.JWT_TOKEN, async (error: VerifyErrors, decodedToken: any) => {
            if (error) {
                res.locals.user = null;
                next();
            } else {
                let user = await UserModel.findById(decodedToken.id);
                res.locals.user = user;
                next();
            }
        });
    } else {
        res.locals.user = null;
        next();
    }
};

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, process.env.JWT_TOKEN, async (error: VerifyErrors, decodedToken: any) => {
            if (error) {
                res.send(200).json('no token')
            } else {
                next();
            }
        });
    } else {
        res.end()
    }
};