import { Request, Response } from 'express'
import NavigationModel from '../models/navigation.model.js';
import { INavigation } from '../types/types';
import { navigationErrors } from '../errors/navigation.errors.js';
import { cache } from '../app.js';

/**
 * Create navigation
 */

export const createNavigation = async (req: Request, res: Response) => {
    //Body request destructuration
    const { navigation } = req.body as INavigation

    //Database document creation
    await NavigationModel.create({
        navigation: navigation
    })
        .then(docs => {
            //We send the response to client
            return res.send(docs)
        })
        .catch(err => {
            //If theres's errors we convert them to human readable message and send 'em
            const errors = navigationErrors(err);
            return res.status(400).send({ errors })
        })
}

/**
 * Update navigation
 */

export const updateNavigation = async (req: Request, res: Response) => {
    const { navigation } = req.body as INavigation

    //The navigation collection containing only one document
    //Check that this document exists
    const isDocument = await NavigationModel.find().exec()

    //If there's a document
    if (isDocument.length > 0) {
        //Process update
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
                //Clear the current object caches
                cache.del(`/api/navigation`);
                //We send the response to client
                return res.send(docs)
            })
            .catch(err => {
                //If theres's errors we convert them to human readable message and send 'em
                const errors = navigationErrors(err);
                return res.status(400).send({ errors })
            })
    }
    //If there's no document, we create it
    else {
        await NavigationModel.create({
            navigation: navigation
        })
            .then(docs => {
                //We send the response to client
                return res.send(docs)
            })
            .catch(err => {
                //If theres's errors we convert them to human readable message and send 'em
                const errors = navigationErrors(err);
                return res.status(400).send({ errors })
            })
    }
};