import mongoose, { HydratedDocument, InferSchemaType } from 'mongoose'
const ObjectID = mongoose.Types.ObjectId
import { Request, Response } from 'express'
import { IProduct } from '../types/types';
import ProductModel from '../models/product.model.ts';
import { productErrors } from '../errors/products.errors.ts';
import { convertStringToRegexp, convertStringToURL, randomNbID, sanitize } from '../utils/utils.js';

type ProductType = HydratedDocument<InferSchemaType<typeof ProductModel>>

/**
 * Get and search products
 */

export const getProducts = async (req: Request, res: Response) => {
    let queries: Record<string, any> = {}
    let options: Record<string, any> = {
        p: 1,
        limit: 24,
    }

    if (req.query) {
        if (req.query.limit) {
            options.limit = sanitize(String(req.query.limit))
            options.limit = Number(options.limit)
        }
        if (req.query.sort) {
            options.sort = sanitize(String(req.query.sort))
        }
        if (req.query.p) {
            options.p = Number(req.query.p)
        }
        if (req.query.populate) {
            options.populate = sanitize(String(req.query.populate))
        }
        if (req.query.select) {
            options.select = sanitize(String(req.query.select))
        }
        if (req.query.q) {
            const q = sanitize((req.query.q).toString())
            queries = {
                ...queries,
                "name": { "$regex": convertStringToRegexp(q) },
            }
        }
        if (req.query.category) {
            const category = sanitize((req.query.category).toString())
            queries = {
                ...queries,
                "category": category
            }
        }

        if (req.query.stock == 'in') {
            queries = {
                ...queries,
                "stock": { '$gt': 0 }
            }
        }
        if (req.query.stock == 'out') {
            queries = {
                ...queries,
                "stock": { '$eq': 0 }
            }
        }

        if (req.query.published) {
            const published = req.query.published.toString()
            if (published === 'true' || published === 'false') {
                options.published = published
            }
        }

        if (req.query.from) {
            if (Date.parse(req.query.from.toString())) {
                if (!req.query.to) {
                    let startDate = new Date(req.query.from.toString())
                    let endDate = new Date(startDate.getTime() + 60 * 60 * 24 * 1000)
                    queries = {
                        ...queries,
                        "createdAt": {
                            $gte: startDate,
                            $lte: endDate
                        }
                    }
                } else {
                    if (Date.parse(req.query.to.toString())) {
                        let startDate = new Date(req.query.from.toString())
                        let endDate = new Date(req.query.to.toString())
                        queries = {
                            ...queries,
                            "createdAt": {
                                $gte: startDate,
                                $lte: endDate
                            }

                        }
                    }
                }
            }
        }
    }

    if (options.published) {
        queries = { ...queries, "published": options.published || true }
    }

    const count = await ProductModel.countDocuments(queries);

    if (options.p) {
        if (options.p > Math.ceil(count / options.limit)) {
            options.p = Math.ceil(count / options.limit)
        }
        if (options.p < 1) {
            options.p = 1
        }
    }

    try {
        await ProductModel
            .find(queries)
            .limit(options.limit)
            .skip((options.p - 1) * options.limit)
            .populate({
                path: 'images',
            })
            .populate({
                path: 'category',
                select: '_id name parent link'
            })
            .populate({
                path: 'promotions',
                select: '_id type code value description start_date end_date is_active'
            })
            .populate(options.populate)
            .select(options.select)
            .sort(options.sort)
            .then(async docs => {
                return res.status(200).send({
                    documents: docs,
                    count: count,
                    currentPage: options.p,
                    limit: options.limit
                })
            })
    } catch (err) {
        return res.status(400).send({ message: err })
    }
}

/**
 * Create product
 */

export const createProduct = async (req: Request, res: Response) => {
    const { name, content, description, category, images, tags, details, variants }: IProduct = req.body

    if (variants?.length > 0) {
        for (let i = 0; i < variants.length; i++) {
            if (name) {
                let url = convertStringToURL(name)
                variants[i].url = `${url}-${randomNbID(8)}`
            }

            const { price, taxe, ref, width, height, weight, barcode } = variants[i]
            if (price === 0) {
                return res.status(400).send({ errors: { [`price-${i}`]: 'Veuillez saisir un prix.' } })
            }
            if (taxe === 0) {
                return res.status(400).send({ errors: { [`taxe-${i}`]: 'Veuillez saisir la taxe appliquée au produit.' } })
            }
            if (ref.length === 0) {
                return res.status(400).send({ errors: { [`ref-${i}`]: 'Veuillez saisir la référence du produit.' } })
            }
            if (width.length === 0) {
                return res.status(400).send({ errors: { [`width-${i}`]: 'Veuillez préciser la largeur du produit.' } })
            }
            if (height.length === 0) {
                return res.status(400).send({ errors: { [`height-${i}`]: 'Veuillez préciser la hauteur du produit.' } })
            }
            if (weight.length === 0) {
                return res.status(400).send({ errors: { [`weight-${i}`]: 'Veuillez préciser le poids du produit.' } })
            }
            if (barcode.length === 0) {
                return res.status(400).send({ errors: { [`barcode-${i}`]: 'Veuillez préciser le code barre du produit.' } })
            }
        }
    } else {
        return res.status(400).send({ errors: { variants: 'Veuillez ajouter au moins un variant.' } })
    }

    await ProductModel.create({
        name,
        category: category._id,
        content,
        description,
        variants,
        images,
        details,
        tags
    })
        .then(docs => {
            return res.send(docs)
        })
        .catch(err => {
            const errors = productErrors(err);
            return res.status(400).send({ errors })
        })
}

/**
 * Update product
 */

export const updateProduct = async (req: Request, res: Response) => {
    const { published, name, content, description, category, images, tags, details, promotions, variants }: IProduct = req.body

    if (req.params.id) {
        if (!ObjectID.isValid(req.params.id))
            return res.status(400).send("ID unknown : " + req.params.id);
        else {
            if (variants) {
                if (variants.length > 0) {
                    for (let i = 0; i < variants.length; i++) {
                        if (name) {
                            let url = convertStringToURL(name)
                            variants[i].url = `${url}-${randomNbID(8)}`
                        }

                        const { price, taxe, ref, width, height, weight } = variants[i]
                        if (price === 0) {
                            return res.status(400).send({ errors: { [`price-${i}`]: 'Veuillez saisir un prix.' } })
                        }
                        if (taxe === 0) {
                            return res.status(400).send({ errors: { [`taxe-${i}`]: 'Veuillez saisir la taxe appliquée au produit.' } })
                        }
                        if (ref.length === 0) {
                            return res.status(400).send({ errors: { [`ref-${i}`]: 'Veuillez saisir la référence du produit.' } })
                        }
                        if (width.length === 0) {
                            return res.status(400).send({ errors: { [`width-${i}`]: 'Veuillez préciser la largeur du produit.' } })
                        }
                        if (height.length === 0) {
                            return res.status(400).send({ errors: { [`height-${i}`]: 'Veuillez préciser la hauteur du produit.' } })
                        }
                        if (weight.length === 0) {
                            return res.status(400).send({ errors: { [`weight-${i}`]: 'Veuillez préciser le poids du produit.' } })
                        }
                    }
                } else {
                    return res.status(400).send({ errors: { variants: 'Veuillez ajouter au moins un variant.' } })
                }
            }

            await ProductModel.findByIdAndUpdate({
                _id: req.params.id
            }, {
                $set: {
                    published,
                    name,
                    content,
                    description,
                    category,
                    variants,
                    images,
                    details,
                    promotions,
                    tags,
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
                    const errors = productErrors(err)
                    return res.status(400).send({ errors })
                })
        }
    }
};