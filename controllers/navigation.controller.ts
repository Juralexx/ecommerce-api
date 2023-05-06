import mongoose from 'mongoose'
const ObjectID = mongoose.Types.ObjectId
import { Request, Response } from 'express'
import NavigationModel from '../models/navigation.model.ts';
import { INavigation } from '../types/types';
import { navigationErrors } from '../errors/navigation.errors.ts';

/**
 * Create navigation
 */

export const createNavigation = async (req: Request, res: Response) => {
    const { navigation } = req.body as INavigation

    await NavigationModel.create({
        navigation: navigation
    })
        .then(docs => {
            return res.send(docs)
        })
        .catch(err => {
            const errors = navigationErrors(err);
            return res.status(400).send({ errors })
        })
}

/**
 * Update navigation
 */

export const updateNavigation = async (req: Request, res: Response) => {
    const { navigation } = req.body as INavigation

    const isDocument = await NavigationModel.find().exec()

    if (isDocument.length > 0) {
        await NavigationModel.findByIdAndUpdate({
            _id: isDocument[0]._id
        }, {
            $set: {
                navigation: navigation
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
                const errors = navigationErrors(err);
                return res.status(400).send({ errors })
            })
    } else {
        await NavigationModel.create({
            navigation: navigation
        })
            .then(docs => {
                return res.send(docs)
            })
            .catch(err => {
                const errors = navigationErrors(err);
                return res.status(400).send({ errors })
            })
    }
};