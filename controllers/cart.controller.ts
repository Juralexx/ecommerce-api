import mongoose from 'mongoose'
const ObjectID = mongoose.Types.ObjectId
import { Request, Response } from 'express'
import CartModel from "../models/cart.model.js";
import { cache } from '../app.js';

/**
 * Create cart
 */

export const createCart = async (req: Request, res: Response) => {
    //Body request destructuration
    const { products } = req.body;

    //Database document creation
    await CartModel
        .create({ products })
        .then(docs => {
            //We send the response to client
            return res.send(docs);
        })
        //If theres's errors we convert them to human readable message and send 'em
        .catch(err => {
            return res.status(400).send({ err });
        });
};

/**
 * Update cart
 */

export const updateCart = async (req: Request, res: Response) => {
    //Body request destructuration
    const { products } = req.body;

    //Check that the id params exists
    if (req.params.id) {
        //Check if the id params is a valide MongoDB ID
        if (!ObjectID.isValid(req.params.id))
            return res.status(400).send("ID unknown : " + req.params.id);
        else {
            //If the ID is valide we find the document based on it and trigger an update
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
                    //Clear the current object caches
                    cache.del(`/api/carts`);
                    cache.del(`/api/carts/${req.params.id}`);
                    //We send the response to client
                    return res.send(docs);
                })
                .catch(err => {
                    //If theres's errors we convert them to human readable message and send 'em
                    return res.status(400).send({ err });
                });
        };
    };
};