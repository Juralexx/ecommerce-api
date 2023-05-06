import mongoose from 'mongoose'
const ObjectID = mongoose.Types.ObjectId
import { Request, Response } from 'express'
import CategoryModel from "../models/category.model.ts";
import { ICategory } from '../types/types';
import { categoryErrors } from '../errors/categories.errors.ts';

/**
 * Create category
 */

export const createCategory = async (req: Request, res: Response) => {
    const { name, link, content, parent, image } = req.body as ICategory

    await CategoryModel.create({
        name: name,
        link: link,
        content: content,
        parent: parent,
        image: image._id
    })
        .then(docs => {
            return res.send(docs)
        })
        .catch(err => {
            const errors = categoryErrors(err);
            return res.status(400).send({ errors })
        })
}

/**
 * Update category
 */

export const updateCategory = async (req: Request, res: Response) => {
    const { name, link, content, parent, image } = req.body as ICategory

    if (req.params.id) {
        if (!ObjectID.isValid(req.params.id))
            return res.status(400).send("ID unknown : " + req.params.id);
        else {
            await CategoryModel.findByIdAndUpdate({
                _id: req.params.id
            }, {
                $set: {
                    name: name,
                    link: link,
                    content: content,
                    parent: parent,
                    image: image._id
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
                    const errors = categoryErrors(err);
                    return res.status(400).send({ errors })
                })
        }
    }
};