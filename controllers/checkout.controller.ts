import mongoose from 'mongoose'
const ObjectID = mongoose.Types.ObjectId
import { Request, Response } from 'express'
import CheckoutModel from "../models/checkout.model.js";

/**
 * Create checkout
 */

export const createCheckout = async (req: Request, res: Response) => {
    //Body request destructuration
    const { cartId, customer, date, payment_method, delivery_address, billing_address, products, price, shipping_fees, carrier, status } = req.body;

    //Database document creation
    await CheckoutModel.create({
        cartId,
        customer,
        date,
        payment_method,
        delivery_address,
        billing_address,
        products,
        price,
        shipping_fees,
        carrier,
        status
    })
        .then(async (docs) => {
            //We send the order to the client
            return res.send(docs);
        })
        .catch(err => {
            //If theres's errors send 'em to the client
            return res.status(400).send({ message: err });
        });
};

/**
 * Update checkout
 */

export const updateCheckout = async (req: Request, res: Response) => {
    //Body request destructuration
    const { cartId, customer, date, payment_method, delivery_address, billing_address, products, price, shipping_fees, carrier, status, timeline } = req.body;

    //Check that the id params exists
    if (req.params.id) {
        //Check if the id params is a valide MongoDB ID
        if (!ObjectID.isValid(req.params.id))
            return res.status(400).send("ID unknown : " + req.params.id);
        else {
            //Database document update
            await CheckoutModel.findByIdAndUpdate({
                _id: req.params.id
            }, {
                $set: {
                    cartId,
                    customer,
                    date,
                    payment_method,
                    delivery_address,
                    billing_address,
                    products,
                    price,
                    shipping_fees,
                    carrier,
                    status,
                },
                $addToSet: {
                    timeline: timeline
                }
            }, {
                new: true,
                runValidators: true,
                context: 'query',
            })
                .then(docs => {
                    //We send the response to client
                    return res.send(docs);
                })
                .catch(err => {
                    //If theres's errors send 'em to the client
                    return res.status(400).send({ message: err });
                })
        };
    };
};