import mongoose from 'mongoose'
const ObjectID = mongoose.Types.ObjectId
import { Request, Response } from 'express'
import PageModel from "../models/page.model.ts";
import { IPage } from '../types/types';
import { pageErrors } from '../errors/pages.errors.ts';

/**
 * Create pages
 */

export const createPage = async (req: Request, res: Response) => {
    const { title, link, content, published } = req.body as IPage

    await PageModel.create({
        title: title,
        link: link,
        content: content,
        published: published
    })
        .then(docs => {
            return res.send(docs)
        })
        .catch(err => {
            const errors = pageErrors(err);
            return res.status(400).send({ errors })
        })
}

/**
 * Update pages
 */

export const updatePage = async (req: Request, res: Response) => {
    const { title, link, content, published } = req.body as IPage

    if (req.params.id) {
        if (!ObjectID.isValid(req.params.id))
            return res.status(400).send("ID unknown : " + req.params.id);
        else {
            await PageModel.findByIdAndUpdate({
                _id: req.params.id
            }, {
                $set: {
                    title: title,
                    link: link,
                    content: content,
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
                    const errors = pageErrors(err);
                    return res.status(400).send({ errors })
                })
        }
    }
};