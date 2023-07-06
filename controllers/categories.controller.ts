import mongoose from 'mongoose'
const ObjectID = mongoose.Types.ObjectId
import { Request, Response } from 'express'
import CategoryModel from "../models/category.model.js";
import { ICategory } from '../types/types';
import { categoryErrors } from '../errors/categories.errors.js';
import { cache } from '../app.js';

/**
 * Create category
 */

export const createCategory = async (req: Request, res: Response) => {
    //Body request destructuration
    const { name, link, content, parent, image } = req.body as ICategory;

    //Database document creation
    await CategoryModel.create({
        name: name,
        link: '/category' + link,
        content: content,
        parent: parent,
        image: image
    })
        .then(docs => {
            //We send the response to client
            return res.send(docs);
        })
        .catch(err => {
            //If theres's errors we convert them to human readable message and send 'em
            const errors = categoryErrors(err);
            return res.status(400).send({ errors });
        });
};

/**
 * Update category
 */

export const updateCategory = async (req: Request, res: Response) => {
    //Body request destructuration
    const { name, link, content, parent, image } = req.body as ICategory;

    //Check that the id params exists
    if (req.params.id) {
        //Check if the id params is a valide MongoDB ID
        if (!ObjectID.isValid(req.params.id))
            return res.status(400).send("ID unknown : " + req.params.id);
        else {
            //If the ID is valide we find the document based on it and trigger an update
            await CategoryModel.findByIdAndUpdate({
                _id: req.params.id
            }, {
                $set: {
                    name: name,
                    link: link,
                    content: content,
                    parent: parent,
                    image: image
                },
            }, {
                new: true,
                runValidators: true,
                context: 'query',
            })
                .then(docs => {
                    //Clear the current object caches
                    cache.del(`/api/categories`);
                    cache.del(`/api/categories/${req.params.id}`);
                    //We send the response to client
                    return res.send(docs);
                })
                .catch(err => {
                    //If theres's errors we convert them to human readable message and send 'em
                    const errors = categoryErrors(err);
                    return res.status(400).send({ errors });
                });
        };
    };
};