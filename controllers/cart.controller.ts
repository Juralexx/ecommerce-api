import mongoose from 'mongoose'
const ObjectID = mongoose.Types.ObjectId
import { Request, Response } from 'express'
import CartModel from "../models/cart.model.ts";

/**
 * Create cart
 */

export const createCart = async (req: Request, res: Response) => {
    const { products } = req.body

    await CartModel.create({
        products
    })
        .then(docs => {
            return res.send(docs)
        })
        .catch(err => {
            return res.status(400).send({ err })
        })
}

/**
 * Update cart
 */

export const updateCart = async (req: Request, res: Response) => {
    const { products } = req.body

    if (req.params.id) {
        if (!ObjectID.isValid(req.params.id))
            return res.status(400).send("ID unknown : " + req.params.id);
        else {
            await CartModel.findByIdAndUpdate({
                _id: req.params.id
            }, {
                $set: {
                    products: products
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
                    return res.status(400).send({ err })
                })
        }
    }
};