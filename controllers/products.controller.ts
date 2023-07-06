import mongoose, { HydratedDocument, InferSchemaType } from 'mongoose'
const ObjectID = mongoose.Types.ObjectId
import { Request, Response } from 'express'
import { IProduct, IProductVariant } from '../types/types';
import ProductModel from '../models/product.model.js';
import { productErrors } from '../errors/products.errors.js';
import { convertStringToRegexp, convertStringToURL, onlyNumbers, randomNbID, sanitize } from '../utils/utils.js';
import { cache } from '../app.js';

type ProductType = HydratedDocument<InferSchemaType<typeof ProductModel>>

/**
 * Get and search products
 */

export const getProducts = async (req: Request, res: Response) => {
    //Object containing the query search
    let queries: Record<string, any> = {};
    //We assign core values to the option object
    //p = current page
    //limit = number of returned objects
    let options: Record<string, any> = {
        p: 1,
        limit: 24,
        sort: 'name'
    };

    //If there's query params
    if (req.query) {
        //If the 'limit' query params exists
        if (req.query.limit) {
            //Convert it to string and sanitize it
            options.limit = sanitize(String(req.query.limit));
            //Convert it to number
            options.limit = Number(options.limit);
        }
        //If the 'sort' query params exists
        if (req.query.sort) {
            //Convert it to string and sanitize it
            options.sort = sanitize(String(req.query.sort));
            //Check if the sort parameter has a value provided as : variants.price.desc
            const isArray: string[] = options.sort.split('.');
            //If the values is splittable
            if (isArray.length > 0) {
                //Get the possible direction
                const direction = isArray[isArray.length - 1];
                //Checki if the last value is a direction : 'asc' or 'desc
                if (direction === 'asc' || direction === 'desc') {
                    //Convert the splitted string back to a string and remove the direction (last element)
                    const query = isArray
                        .slice(0, isArray.length - 1)
                        .map(value => value)
                        .join('.');
                    //Assign the new sort query to the 'options' object
                    options.sort = { [query]: direction };
                }
            }
        }
        //If the 'minprice' and the 'maxprice' query params exists
        //'minprice' => used to filter products with a minimum price
        //'maxprice' => used to filter products with a maximum price
        if (req.query.minprice && req.query.maxprice) {
            if (onlyNumbers(req.query.minprice) && onlyNumbers(req.query.maxprice)) {
                queries = {
                    ...queries,
                    "base_variant.price": {
                        '$gte': Number(req.query.minprice),
                        '$lte': Number(req.query.maxprice),
                    }
                };
            }
        }
        //If only the 'minprice' query params exists
        if (req.query.minprice && !req.query.maxprice) {
            if (onlyNumbers(req.query.minprice)) {
                queries = {
                    ...queries,
                    "base_variant.price": {
                        '$gte': Number(req.query.minprice)
                    }
                };
            }
        }
        //If only the 'maxprice' query params exists
        if (!req.query.minprice && req.query.maxprice) {
            if (onlyNumbers(req.query.maxprice)) {
                queries = {
                    ...queries,
                    "base_variant.price": {
                        '$lte': Number(req.query.maxprice)
                    }
                };
            }
        }
        //If the 'p' query params exists
        if (req.query.p && onlyNumbers(req.query.p)) {
            //Convert it to number
            options.p = Number(req.query.p);
        }
        //If the 'populate' query params exists
        if (req.query.populate) {
            //Convert it to string and sanitize it
            options.populate = sanitize(String(req.query.populate));
        }
        //If the 'select' query params exists
        if (req.query.select) {
            //Convert it to string and sanitize it
            options.select = sanitize(String(req.query.select));
        }
        //If the 'q' query params exists
        if (req.query.q) {
            //Convert it to string and sanitize it
            const q = sanitize((req.query.q).toString());
            //Convert it to MongoDB caseSensitive Regexp
            const regex = convertStringToRegexp(q);
            //Pass the 'regex' to the 'name' property
            queries = {
                ...queries,
                "name": { "$regex": regex },
            };
        }
        //If the 'category' query params exists
        if (req.query.category) {
            //Convert it to string and sanitize it
            options.category = sanitize(String(req.query.category));
        }
        //If the 'categoryId' query params exists
        if (req.query.categoryId) {
            //Convert it to string and sanitize it
            const categoryId = sanitize(String(req.query.categoryId));
            queries = {
                ...queries,
                "category": categoryId
            };
        }

        //If the 'stock' query params exists
        if (req.query.stock) {
            //req.query.stock === 'in stock'
            //We check for stock greater than 0
            if (req.query.stock == 'in') {
                queries = {
                    ...queries,
                    "stock": { '$gt': 0 }
                };
            }
            //req.query.stock === 'out of stock'
            //We check for stock equal to 0
            if (req.query.stock == 'out') {
                queries = {
                    ...queries,
                    "stock": { '$eq': 0 }
                };
            }
        }

        //If the 'published' query params exists
        if (req.query.published) {
            //Convert it to string
            const published = req.query.published.toString();
            //Check that the values are valid 'true' or 'false
            if (published === 'true' || published === 'false') {
                options.published = published;
            }
        }

        //Fetch all the products based on a promotion ID stored in the 'promotions' array
        if (req.query.promotion) {
            //Convert it to string
            const promotion = sanitize(String(req.query.promotion));
            //If the promotion do not concern all products, we filter by promotion ID
            if (promotion !== 'all') {
                //Pass the 'regex' to the 'promotions' property
                queries = {
                    ...queries,
                    "promotions": promotion
                };
            }
        }

        //Date range query params :
        //If there's the 'from' query param
        if (req.query.from) {
            //Check that the date is a valid one
            if (Date.parse(req.query.from.toString())) {
                //If there's no 'to' query param
                if (!req.query.to) {
                    //Convert 'from' param to plain date
                    let startDate = new Date(req.query.from.toString());
                    //Convert 'from' param to date starting a 00:00
                    let endDate = new Date(startDate.getTime() + 60 * 60 * 24 * 1000);
                    //Passing 'startDate' to 'greater than'
                    //Passing 'endDate' to 'less than'
                    queries = {
                        ...queries,
                        "createdAt": {
                            $gte: startDate,
                            $lte: endDate
                        }
                    };
                }
                //If there's 'to' query param
                else {
                    //Check that the date is a valid one
                    if (Date.parse(req.query.to.toString())) {
                        //Convert 'from' param to plain date
                        let startDate = new Date(req.query.from.toString());
                        //Convert 'to' param to plain date
                        let endDate = new Date(req.query.to.toString());
                        //Passing 'startDate' to 'greater than'
                        //Passing 'endDate' to 'less than'
                        queries = {
                            ...queries,
                            "createdAt": {
                                $gte: startDate,
                                $lte: endDate
                            }
                        };
                    };
                };
            };
        };
    };

    //If 'options' object contains 'published'
    if (options.published) {
        //We pass it to the 'query' object
        queries = { ...queries, "published": options.published || true };
    }

    //Count the number of documents matching the query object
    const count = await ProductModel.countDocuments(queries);

    //Check that the 'p' (page) params is not greater than the maximum value it could take
    //So we prevent 'no document found' error
    //Maximum value = number of documents / number of documents per page
    if (options.p) {
        //If 'p' param if greater than the maximum value it could take
        //We assign to it the maximum value it could take
        if (options.p > Math.ceil(count / options.limit)) {
            options.p = Math.ceil(count / options.limit);
        }
        //If 'p' param is smaller than 1 => p = 1
        if (options.p < 1) {
            options.p = 1;
        }
    };

    //Launch the query search
    //As the category fields in products is a referenced field, we can not query him in the 'find()' method
    //So if the search param 'category' is present we use a aggregation to join the categories collection to the products collection
    if (!options.category) {
        try {
            await ProductModel
                .find(queries)
                .limit(options.limit)
                //We skip the number of documents to return document from current page
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
                    cache.set(req.originalUrl, JSON.stringify({
                        //Documents array
                        documents: docs,
                        //Number of documents
                        count: count,
                        //Current page
                        currentPage: options.p,
                        //Limit of documents per page
                        limit: options.limit
                    }));
                    return res.status(200).send({
                        //Documents array
                        documents: docs,
                        //Number of documents
                        count: count,
                        //Current page
                        currentPage: options.p,
                        //Limit of documents per page
                        limit: options.limit
                    });
                })
        } catch (err) {
            return res.status(400).send({ message: err });
        }
    } else {
        try {
            const products = await ProductModel.aggregate([
                // join Categories collection
                {
                    $lookup: {
                        from: 'categories', //collection to join
                        localField: 'category', //field from the input documents
                        foreignField: '_id', //field from the documents of the "from" collection
                        as: 'category' //output array field
                    }
                }, {
                    // convert array of Categories to object
                    $unwind: '$category'
                }, {
                    // filter
                    $match: {
                        "$or": [
                            {
                                'category.name': options.category
                            }, {
                                'category._id': options.category
                            }
                        ]
                    }
                }, {
                    $limit: options.limit
                }, {
                    $skip: (options.p - 1) * options.limit
                }, {
                    $sort: {
                        [options.sort]: 1
                    }
                }, {
                    //Remove certain fields
                    $project: {
                        "description": 0,
                        "content": 0
                    }
                }
            ])
                .exec()

            await ProductModel
                .populate(products, [
                    {
                        path: 'images',
                    }, {
                        path: 'category',
                        select: '_id name parent link'
                    }, {
                        path: 'promotions',
                        select: '_id type code value description start_date end_date is_active'
                    }
                ])
                .then(async docs => {
                    cache.set(req.originalUrl, JSON.stringify({
                        //Documents array
                        documents: docs,
                        //Number of documents
                        count: count,
                        //Current page
                        currentPage: options.p,
                        //Limit of documents per page
                        limit: options.limit
                    }));
                    return res.status(200).send({
                        //Documents array
                        documents: docs,
                        //Number of documents
                        count: count,
                        //Current page
                        currentPage: options.p,
                        //Limit of documents per page
                        limit: options.limit
                    });
                })
        } catch (err) {
            return res.status(400).send({ message: err });
        }
    }
}

/**
 * Get single product
 */

export const getProductByUrl = async (req: Request, res: Response) => {
    //Check if the url params exists
    if (!req.params.url) {
        return res.status(400).send('Unknown URL : ' + req.params.id)
    }

    //Process search from 'url' param
    try {
        const response = await ProductModel
            .findOne({
                "variants.url": req.params.url
            })
            .populate('images category promotions')
            .exec()

        //Define current variant, needed to define which variant has been requested on current product page
        let current_variant = {}

        //If there's a product
        if (response) {
            //Find variant with url as req.params.url and assign it a the current_variant
            current_variant = response.variants.find((variant: IProductVariant) => variant.url === req.params.url);
        }

        //We send the response to client : original response + current_variant
        cache.set(req.originalUrl, JSON.stringify({ ...response._doc, current_variant }));
        res.status(200).send({ ...response._doc, current_variant })

    } catch (err) {
        //If theres's errors we send 'em to the client
        return res.status(400).send({ message: err })
    }
};

/**
 * Create product
 */

export const createProduct = async (req: Request, res: Response) => {
    //Body request destructuration
    const { name, content, description, category, images, details, variants }: IProduct = req.body;

    //If variants and variants contains at least one value
    if (variants) {
        if (variants.length > 0) {
            //For each variant
            for (let i = 0; i < variants.length; i++) {
                const { price, taxe, ref, size, height, weight, barcode } = variants[i];

                //If one of the { price, taxe, ref, size, height, weight, barcode } values is missing
                //we return the appropriate error
                if (size.length === 0)
                    return res.status(400).send({ errors: { [`size-${i}`]: 'Veuillez préciser le litrage du produit.' } });
                if (height.length === 0)
                    return res.status(400).send({ errors: { [`height-${i}`]: 'Veuillez préciser la hauteur du produit.' } });
                if (weight.length === 0)
                    return res.status(400).send({ errors: { [`weight-${i}`]: 'Veuillez préciser le poids du produit.' } });
                if (!price || price < 1)
                    return res.status(400).send({ errors: { [`price-${i}`]: 'Veuillez saisir un prix valide.' } });
                if (taxe === 0)
                    return res.status(400).send({ errors: { [`taxe-${i}`]: 'Veuillez saisir la taxe appliquée au produit.' } });
                if (ref.length === 0)
                    return res.status(400).send({ errors: { [`ref-${i}`]: 'Veuillez saisir la référence du produit.' } });
                if (barcode.length === 0)
                    return res.status(400).send({ errors: { [`barcode-${i}`]: 'Veuillez préciser le code barre du produit.' } });

                if (name) {
                    //We create an url for each variant
                    let url = convertStringToURL(name);
                    //We add a random 8 number to the url so it is unique
                    variants[i].url = `${url}-${randomNbID(8)}`;
                }
            }
        }
        //Else we return the error that at least one variant is needed
        else {
            return res.status(400).send({
                errors: { variants: 'Veuillez ajouter au moins un variant.' }
            });
        }
    }

    //Find the variant with the starting product prices
    //Needed to be displayed as the first product variant in the front-end
    const base_variant = variants.reduce((prev, curr) => (
        prev.price < curr.price ? prev : curr
    ));

    //Database document creation
    await ProductModel.create({
        name,
        category,
        content,
        description,
        variants,
        base_variant,
        images,
        details
    })
        .then(docs => {
            //We send the response to client
            return res.send(docs);
        })
        .catch(err => {
            //If theres's errors, send 'em
            const errors = productErrors(err);
            return res.status(400).send({ errors });
        })
}

/**
 * Update product
 */

export const updateProduct = async (req: Request, res: Response) => {
    //Body request destructuration
    const { published, name, content, description, category, images, details, promotions, variants }: IProduct = req.body;

    //If there's 'id' param
    if (req.params.id) {
        //Check if the id params is a valide MongoDB ID
        if (!ObjectID.isValid(req.params.id))
            return res.status(400).send("ID unknown : " + req.params.id);
        else {
            //If variants and variants contains at least one value
            if (variants) {
                if (variants.length > 0) {
                    //For each variant
                    for (let i = 0; i < variants.length; i++) {
                        //If req.body contains 'name'
                        if (name) {
                            //We create an url for each variant
                            let url = convertStringToURL(name);
                            //We add a random 8 number to the url so it is unique
                            variants[i].url = `${url}-${randomNbID(8)}`;
                        }

                        const { price, taxe, ref, size, height, weight, barcode } = variants[i];

                        //If one of the { price, taxe, ref, size, height, weight, barcode } values is missing
                        //we return the appropriate error
                        if (size.length === 0)
                            return res.status(400).send({ errors: { [`size-${i}`]: 'Veuillez préciser le litrage du produit.' } });
                        if (height.length === 0)
                            return res.status(400).send({ errors: { [`height-${i}`]: 'Veuillez préciser la hauteur du produit.' } });
                        if (weight.length === 0)
                            return res.status(400).send({ errors: { [`weight-${i}`]: 'Veuillez préciser le poids du produit.' } });
                        if (!price || price < 1)
                            return res.status(400).send({ errors: { [`price-${i}`]: 'Veuillez saisir un prix valide.' } });
                        if (taxe === 0)
                            return res.status(400).send({ errors: { [`taxe-${i}`]: 'Veuillez saisir la taxe appliquée au produit.' } });
                        if (ref.length === 0)
                            return res.status(400).send({ errors: { [`ref-${i}`]: 'Veuillez saisir la référence du produit.' } });
                        if (barcode.length === 0)
                            return res.status(400).send({ errors: { [`barcode-${i}`]: 'Veuillez préciser le code barre du produit.' } });
                    }
                }
                //Else we return the error that at least one variant is needed
                else {
                    return res.status(400).send({ errors: { variants: 'Veuillez ajouter au moins un variant.' } });
                }
            }

            let base_variant;
            if (variants && variants.length > 0) {
                //Find the variant with the starting product prices
                //Needed to be displayed as the first product variant
                base_variant = variants.reduce((prev, curr) => prev.price < curr.price ? prev : curr);
            }

            //Process document update
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
                    base_variant,
                    images,
                    details,
                    promotions
                },
            }, {
                new: true,
                runValidators: true,
                context: 'query',
            })
                .then(docs => {
                    //Clear the current object caches
                    cache.del(`/api/products`);
                    cache.del(`/api/products/${req.params.id}`);
                    //We send the response to client
                    return res.send(docs);
                })
                .catch(err => {
                    //If theres's errors we convert them to human readable message and send 'em
                    const errors = productErrors(err);
                    return res.status(400).send({ errors });
                })
        };
    };
};