import { Request, Response } from 'express'
import SiteModel from '../models/site.model.js';

/**
 * Create site datas
 */

export const createSiteDatas = async (req: Request, res: Response) => {
    const { denomination, slogan, email, phone, address, street, postal_code, openings, social_networks } = req.body

    await SiteModel.create({
        denomination,
        slogan,
        email,
        phone,
        address,
        street,
        postal_code,
        openings,
        social_networks
    })
        .then(docs => {
            return res.send(docs)
        })
        .catch(err => {
            return res.status(400).send({ message: err })
        })
}

/**
 * Update site datas
 */

export const updateSiteDatas = async (req: Request, res: Response) => {
    const { denomination, slogan, email, phone, address, street, postal_code, openings, social_networks } = req.body

    const isDocument = await SiteModel.find().exec()

    if (isDocument.length > 0) {
        await SiteModel.findByIdAndUpdate({
            _id: isDocument[0]._id
        }, {
            $set: {
                denomination,
                slogan,
                email,
                phone,
                address,
                street,
                postal_code,
                openings,
                social_networks
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
                return res.status(400).send({ message: err })
            })
    } else {
        await SiteModel.create({
            denomination,
            slogan,
            email,
            phone,
            address,
            street,
            postal_code,
            openings,
            social_networks
        })
            .then(docs => {
                return res.send(docs)
            })
            .catch(err => {
                return res.status(400).send({ message: err })
            })
    }
};