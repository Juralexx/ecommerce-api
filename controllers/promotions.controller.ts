import mongoose, { Document } from 'mongoose'
const ObjectID = mongoose.Types.ObjectId
import { Request, Response } from 'express'
import PromotionModel from "../models/promotion.model.ts";
import { ICategory, IPromotion } from '../types/types';
import { promotionsErrors } from '../errors/promotion.errors.ts';
import ProductModel from '../models/product.model.ts';
import CategoryModel from '../models/category.model.ts';

/**
 * Create promotion
 */

export const createPromotion = async (req: Request, res: Response) => {
    const { type, code, value, description, start_date, end_date, condition } = req.body as IPromotion

    await PromotionModel.create({
        type,
        code,
        value,
        description,
        start_date,
        end_date,
        condition
    })
        .then(async docs => {
            if (condition.type !== 'all') {
                if (condition.categories.length > 0) {
                    condition.categories.forEach(async element => {
                        try {
                            await CategoryModel.findByIdAndUpdate({
                                _id: element._id
                            }, {
                                $addToSet: {
                                    promotions: docs._id,
                                },
                            }, {
                                new: true,
                                runValidators: true,
                                context: 'query',
                            })
                        } catch (err) {
                            return res.status(400).send({ message: err })
                        }
                    })
                }
                if (condition.products.length > 0) {
                    condition.products.forEach(async element => {
                        try {
                            await ProductModel.findByIdAndUpdate({
                                _id: element._id
                            }, {
                                $addToSet: {
                                    promotions: docs._id,
                                },
                            }, {
                                new: true,
                                runValidators: true,
                                context: 'query',
                            })
                        } catch (err) {
                            return res.status(400).send({ message: err })
                        }
                    })
                }
            } else {
                await ProductModel.updateMany({
                    $addToSet: {
                        promotions: docs._id,
                    },
                }, {
                    new: true,
                    runValidators: true,
                    context: 'query',
                })
            }

            return res.send(docs)
        })
        .catch(err => {
            const errors = promotionsErrors(err);
            return res.status(400).send({ errors })
        })
}

/**
 * Update promotion
 */

const updatePromotionInCollections = async<T>(res: Response, model: mongoose.Model<T>, promotion: any, elements: any[]) => {
    let promotionsToAdd: any[] = []
    let promotionsToRemove: any[] = []

    await model
        .find()
        .select('_id promotions')
        .then((res: any[]) => {
            if (res.length > 0) {
                res.forEach((el) => {
                    const isProductInPromotion = elements.some(e => e._id.toString() === el._id.toString())
                    const isPromotionInProduct = el.promotions.some((prom: any) => prom._id.toString() === promotion._id.toString())

                    if (isProductInPromotion && !isPromotionInProduct) {
                        promotionsToAdd = [...promotionsToAdd, el]
                    }
                    else if (!isProductInPromotion && isPromotionInProduct) {
                        promotionsToRemove = [...promotionsToRemove, el]
                    }
                })
            }
        })

    promotionsToAdd.forEach(async element => {
        try {
            await model.findByIdAndUpdate({
                _id: element._id
            }, {
                $addToSet: {
                    promotions: promotion._id,
                },
            }, {
                new: true,
                runValidators: true,
                context: 'query',
            })
        } catch (err) {
            return res.status(400).send({ message: err })
        }
    })
    promotionsToRemove.forEach(async element => {
        try {
            await model.findByIdAndUpdate({
                _id: element._id
            }, {
                $pull: {
                    promotions: promotion._id,
                },
            }, {
                new: true,
                runValidators: true,
                context: 'query',
            })
        } catch (err) {
            return res.status(400).send({ message: err })
        }
    })
}

export const updatePromotion = async (req: Request, res: Response) => {
    const { type, code, value, description, start_date, end_date, condition, is_active } = req.body as IPromotion

    if (req.params.id) {
        if (!ObjectID.isValid(req.params.id))
            return res.status(400).send("ID unknown : " + req.params.id);
        else {
            await PromotionModel.findByIdAndUpdate({
                _id: req.params.id
            }, {
                $set: {
                    type,
                    code,
                    value,
                    description,
                    start_date,
                    end_date,
                    condition,
                    is_active
                },
            }, {
                new: true,
                runValidators: true,
                context: 'query',
            })
                .then(async docs => {
                    if (condition) {
                        if (condition.products) {
                            await updatePromotionInCollections(res, ProductModel, docs, condition.products)
                        }
                        if (condition.categories) {
                            await updatePromotionInCollections(res, CategoryModel, docs, condition.categories)
                        }
    
                        if (condition.type === 'all') {
                            await ProductModel.updateMany({
                                $addToSet: {
                                    promotions: docs._id,
                                },
                            }, {
                                new: true,
                                runValidators: true,
                                context: 'query',
                            })
                        }
                    }

                    return res.send(docs)
                })
                .catch(err => {
                    console.log(err);
                    const errors = promotionsErrors(err);
                    return res.status(400).send({ errors })
                })
        }
    }
};

/**
 * Delete promotion
 */

export const deletePromotion = async (req: Request, res: Response) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).send('Unknown ID : ' + req.params.id)
    }

    try {
        const response = await PromotionModel
            .findByIdAndDelete({ _id: req.params.id })
            .exec()

        if (response) {
            try {
                await ProductModel.updateMany({
                    "promotions": {
                        $exists: true,
                        $eq: response._id
                    },
                    "$pull": {
                        promotions: response._id,
                    },
                }, {
                    new: true,
                    runValidators: true,
                })
                await CategoryModel.updateMany({
                    "promotions": {
                        $exists: true,
                        $eq: response._id
                    },
                    "$pull": {
                        promotions: response._id,
                    },
                }, {
                    new: true,
                    runValidators: true,
                })
            } catch (err) {
                console.log(err)
                return res.status(400).send({ message: err })
            }
        }

        res.status(200).json(response)

    } catch (err) {
        return res.status(400).send({ message: err })
    }
}