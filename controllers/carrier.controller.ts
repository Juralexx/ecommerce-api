import mongoose from 'mongoose'
const ObjectID = mongoose.Types.ObjectId
import { Request, Response } from 'express'
import CarrierModel from "../models/carrier.model.js";
import { ICarrier } from '../types/types';
import { carrierErrors } from '../errors/carrier.errors.js';
import { cache } from '../app.js';

/**
 * Create category
 */

export const createCarrier = async (req: Request, res: Response) => {
    //Body request destructuration
    const { name, description, price, published = false, delivery_estimate } = req.body as ICarrier;

    //Check that the values of 'maximum' and 'minimum' in 'delivery_estimate' are valid
    if (delivery_estimate) {
        if (!delivery_estimate.maximum || delivery_estimate.maximum < 0) {
            return res.status(400).send({ errors: { delivery_estimate_maximum: 'Veuillez préciser le temps maximum de livraison' } });
        }
        if (!delivery_estimate.minimum || delivery_estimate.minimum < 0) {
            return res.status(400).send({ errors: { delivery_estimate_minimum: 'Veuillez préciser le temps minimum de livraison' } });
        }
    }

    //Database document creation
    await CarrierModel.create({
        name: name,
        description: description,
        price: price,
        delivery_estimate: delivery_estimate,
        published: published
    })
        .then(docs => {
            //We send the response to client
            return res.send(docs);
        })
        .catch(err => {
            //If theres's errors we convert them to human readable message and send 'em
            const errors = carrierErrors(err);
            return res.status(400).send({ errors });
        });
};

export const updateCarrier = async (req: Request, res: Response) => {
    //Body request destructuration
    const { name, description, price, published } = req.body as ICarrier;

    //Check that the id params exists
    if (req.params.id) {
        //Check if the id params is a valide MongoDB ID
        if (!ObjectID.isValid(req.params.id))
            return res.status(400).send("ID unknown : " + req.params.id);
        else {
            //If the ID is valide we find the document based on it and trigger an update
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
                    //Clear the current object caches
                    cache.del(`/api/carriers`);
                    cache.del(`/api/carriers/${req.params.id}`);
                    //We send the response to client
                    return res.send(docs);
                })
                .catch(err => {
                    //If theres's errors we convert them to human readable message and send 'em
                    const errors = carrierErrors(err);
                    return res.status(400).send({ errors });
                })
        };
    };
};