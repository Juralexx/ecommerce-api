import mongoose from 'mongoose'
const ObjectID = mongoose.Types.ObjectId
import { Request, Response } from 'express'
import CarrierModel from "../models/carrier.model.ts";
import { ICarrier } from '../types/types';
import { carrierErrors } from '../errors/carrier.errors.ts';

/**
 * Create category
 */

export const createCarrier = async (req: Request, res: Response) => {
    const { name, description, price, published = false } = req.body as ICarrier

    await CarrierModel.create({
        name: name,
        description: description,
        price: price,
        published: published
    })
        .then(docs => {
            return res.send(docs)
        })
        .catch(err => {
            const errors = carrierErrors(err);
            return res.status(400).send({ errors })
        })
}

export const updateCarrier = async (req: Request, res: Response) => {
    const { name, description, price, published } = req.body as ICarrier

    if (req.params.id) {
        if (!ObjectID.isValid(req.params.id))
            return res.status(400).send("ID unknown : " + req.params.id);
        else {
            await CarrierModel.findByIdAndUpdate({
                _id: req.params.id
            }, {
                $set: {
                    name: name,
                    description: description,
                    price: price,
                    published: published
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
                    const errors = carrierErrors(err);
                    return res.status(400).send({ errors })
                })
        }
    }
};