import mongoose from 'mongoose'
const ObjectID = mongoose.Types.ObjectId
import { Request, Response } from 'express'
import PromotionModel from "../models/promotion.model.js";
import { IPromotion } from '../types/types';
import { promotionsErrors } from '../errors/promotion.errors.js';
import ProductModel from '../models/product.model.js';
import CategoryModel from '../models/category.model.js';
import { cache } from '../app.js';

/**
 * Create promotion
 */

export const createPromotion = async (req: Request, res: Response) => {
    //Body request destructuration
    const { type, code, value, description, start_date, end_date, condition } = req.body as IPromotion;

    //Handle all the promotion products
    let products: any[] = [];
    //If the promotions applies to categories,
    //Get all the products of the category and add them to the promotion products
    if (condition.categories.length > 0) {
        condition.categories.forEach(async category => {
            await ProductModel
                .find({ category: category._id })
                .then(docs => {
                    docs.forEach(doc => {
                        products = [...products, doc._id];
                    })
                })
                .catch(err => console.log(err))
        });
        //Add products to the promotion products
        condition.products = [...condition.products, ...products];
        //Filter all products to keep only unique _id
        condition.products = condition.products.filter((value, index, array) => array.indexOf(value) === index);
    };

    //Database document creation
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
            //If the promotion condition do not concern every database products
            if (condition.type !== 'all') {
                //If promotion condition contains categories
                if (condition.categories.length > 0) {
                    //For each category we pass the current promotion '_id' to the category 'promotions' array
                    condition.categories.forEach(async category => {
                        try {
                            await ProductModel.updateMany({
                                category: category._id
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
                            return res.status(400).send({ message: err });
                        }
                    })
                }
                //If promotion condition contains products
                if (condition.products.length > 0) {
                    //For each product we pass the current promotion '_id' to the product 'promotions' array
                    condition.products.forEach(async product => {
                        try {
                            await ProductModel.findByIdAndUpdate({
                                _id: product._id
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
                            return res.status(400).send({ message: err });
                        }
                    })
                }
            }
            //If the promotion condition concern every database products
            //For each product we pass the current promotion '_id' to the product 'promotions' array
            else {
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

            //We send the response to client
            return res.send(docs);
        })
        .catch(err => {
            //If theres's errors we convert them to human readable message and send 'em
            const errors = promotionsErrors(err);
            return res.status(400).send({ errors });
        });
};

/**
 * Update promotion
 */

const updatePromotionInCollections = async<T>(res: Response, model: mongoose.Model<T>, promotion: any, elements: any[]) => {
    //Array that contains the new objects (products or categories) to which must be added the promotion
    let promotionsToAdd: any[] = [];
    //Array that contains the old objects (products or categories) to which must be removed the promotion
    let promotionsToRemove: any[] = [];

    //Retrieve the all collection
    await model
        .find()
        //Select only the _id and the promotions
        .select('_id promotions')
        .then((res: any[]) => {
            //If there's documents
            if (res.length > 0) {
                //For each document
                res.forEach(el => {
                    //Check if the current element (el as product or category)
                    //is in the promotion condition products or categories
                    const isProductInPromotion = elements.some(e => e._id.toString() === el._id.toString());
                    //Check if the current element (el as product or category)
                    //already contains the promotion
                    const isPromotionInProduct = el.promotions.some((prom: any) => prom._id.toString() === promotion._id.toString());

                    //If the promotion concern a product that do not already contains it
                    //We add it to the 'promotionsToAdd' array
                    if (isProductInPromotion && !isPromotionInProduct) {
                        promotionsToAdd = [...promotionsToAdd, el]
                    }
                    //If the promotion no longer concerns a product that already contains it
                    //We add it to the 'promotionsToRemove' array
                    else if (!isProductInPromotion && isPromotionInProduct) {
                        promotionsToRemove = [...promotionsToRemove, el]
                    }
                })
            }
        })

    //Add the promotion to all the new object (products or categories) to which must be added the promotion
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
    });
    //Remove the promotion from all the old objects (products or categories) to which must be removed the promotion
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
    });
};

export const updatePromotion = async (req: Request, res: Response) => {
    //Body request destructuration
    const { type, code, value, description, start_date, end_date, condition, is_active } = req.body as IPromotion;

    //Handle all the promotion products
    let products: any[] = [];
    //If the promotions applies to categories,
    //Get all the products of the category and add them to the promotion products
    if (condition && condition?.categories?.length > 0) {
        condition.categories.forEach(async category => {
            await ProductModel
                .find({ category: category._id })
                .then(docs => {
                    docs.forEach(doc => {
                        products = [...products, doc._id];
                    })
                })
                .catch(err => console.log(err))
        });
        //Add products to the promotion products
        condition.products = [...condition.products, ...products];
        //Filter all products to keep only unique _id
        condition.products = condition.products.filter((value, index, array) => array.indexOf(value) === index);
    };

    //If there's 'id' param
    if (req.params.id) {
        //Check if the id params is a valide MongoDB ID
        if (!ObjectID.isValid(req.params.id))
            return res.status(400).send("ID unknown : " + req.params.id);
        else {
            //Process document update
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
                    //If req.body contains 'condition' object
                    if (condition) {
                        //If condition contains products
                        //We add promotion to products that do not contains it and are now concerned by the promotion
                        //And remove promotion from products that are not concerned by the promotion anymore
                        if (condition.products) {
                            await updatePromotionInCollections(res, ProductModel, docs, condition.products);
                        }
                        //If condition contains categories
                        //We add promotion to all category products that do not contains it and are now concerned by the promotion
                        //And remove promotion from category products that are not concerned by the promotion anymore
                        if (condition.categories) {
                            await updatePromotionInCollections(res, ProductModel, docs, condition.categories);
                        }

                        //If the promotion condition concern every database products
                        //For each product we pass the current promotion '_id' to the product 'promotions' array
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

                    //Clear the current object caches
                    cache.del(`/api/promotions`);
                    cache.del(`/api/promotions/${req.params.id}`);
                    //We send the response to client
                    return res.send(docs)
                })
                .catch(err => {
                    //If theres's errors we convert them to human readable message and send 'em
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
    //Check if the id params is a valide MongoDB ID
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).send('Unknown ID : ' + req.params.id)
    }

    try {
        //Process deletion
        const response = await PromotionModel
            .findByIdAndDelete({ _id: req.params.id })
            .exec()

        //If the promotion is successfully deleted
        if (response) {
            try {
                //Remove the promotion from all the products
                //that contains it
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
                //Remove the promotion from all the categories
                //that contains it
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

        //We send the response to client
        res.status(200).json(response)

    } catch (err) {
        //If theres's errors we send 'em to the client
        return res.status(400).send({ message: err })
    }
}