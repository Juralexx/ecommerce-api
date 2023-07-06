import mongoose from 'mongoose'
const ObjectID = mongoose.Types.ObjectId
import { Request, Response } from 'express'
import PageModel from "../models/page.model.js";
import { IPage } from '../types/types';
import { pageErrors } from '../errors/pages.errors.js';
import { convertStringToRegexp, convertStringToURL, onlyNumbers, randomNbID, sanitize } from '../utils/utils.js';
import { cache } from '../app.js';

/**
 * Get pages
 */

export const getPages = async<T>(req: Request, res: Response) => {
    //Object containing the query search
    let queries: Record<string, any> = {};
    //We assign core values to the option object
    //p = current page
    //limit = number of returned objects
    let options: Record<string, any> = {
        p: 1,
        sort: 'category'
    };

    //If there's query params
    if (req.query) {
        //If the 'limit' query params exists
        if (req.query.limit) {
            //Convert it to string, sanitize it and convert it to number
            options.limit = Number(sanitize(String(req.query.limit)));
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
        //If the 'select' query params exists
        if (req.query.select) {
            //Convert it to string and sanitize it
            options.select = sanitize(String(req.query.select));
        }
        //If the 'populate' query params exists
        if (req.query.populate) {
            //Authorize a 'false' value to prevent population
            //And lighten the response
            if (req.query.populate !== 'false') {
                //Convert it to string and sanitize it
                options.populate = sanitize(String(req.query.populate));
            }
            //If the value is 'false', we populate nothing
            else {
                options.populate = '';
            }
        }
        //If the 'p' query params exists
        if (req.query.p && onlyNumbers(req.query.p)) {
            //Convert it to number
            options.p = Number(req.query.p);
        }

        //If 'q' params and 'fields' params exists
        //q = query params
        //fields = fields to process query search in
        if (req.query.q && req.query.fields) {
            //Convert it to string and sanitize it
            const q = sanitize(String(req.query.q));
            //Convert it to MongoDB caseSensitive Regexp
            const regex = convertStringToRegexp(q);

            //Split the 'fields' to an array to be able to map it
            //From 'field1,field2,field3' to [field1, field2, field3]
            const fields = req.query.fields.toString().split(',');

            //Check that the 'query' parameter on the 'options' object exists
            //If not, we assign it an empty object
            if (typeof options.query === 'undefined') {
                options.query = {};
            }

            //If the 'fields' param contains more than one value
            if (fields.length > 1) {
                //Assign '$or' param to the 'query' param in 'options' object
                options.query['$or'] = [];

                //Process for each fields
                fields.forEach(field => {
                    //Add to the '$or' parameter the field property and its value from the 'q' param
                    options.query = {
                        ...options.query,
                        "$or": [
                            ...options.query.$or,
                            { [field as any]: { "$regex": regex } },
                        ]
                    };
                })
            }
            //If it contains only one value
            else {
                //Add the field property and its value from the 'q' param
                options.query = {
                    ...options.query,
                    [fields[0]]: { "$regex": regex }
                };
            }
        }

        //If the 'category' query params exists
        if (req.query.category) {
            //Convert it to string and sanitize it
            const category = sanitize(String(req.query.category));
            //Add the category property and its value from the 'category' param
            options.query = {
                ...options.query,
                "$or": [
                    { "category.name": category },
                    { "category.url": category }
                ]
            };
        }

        //If the 'published' query params exists
        if (req.query.published) {
            //Convert it to string
            const published = req.query.published.toString();
            //Check that the values are valid 'true' or 'false
            if (published === 'true' || published === 'false') {
                options.published = published;
                options.query = {
                    ...options.query,
                    "published": published
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
    }

    //Process query search
    try {
        const response = await PageModel
            .find(options.query)
            .sort(options.sort)
            .skip((options.p - 1) * options.limit)
            .limit(options.limit)
            .select(options.select)
            //We skip the number of documents to return document from current page
            .populate(options.populate)
            .populate('image')
            .exec()

        if (response) {
            //If the request to 'sorted' query param to 'true'
            if (req.query.sorted && req.query.sorted === 'true') {
                //Assign default empty value to the pages categories
                let categories: any[] = [];
                //Get all the pages categories and store them in the 'categories'
                response.forEach(page => {
                    //If the current page category do not already exists in the 'categories' variable
                    if (!categories.some(category => category.name === page.category.name)) {
                        categories = [...categories, page.category];
                    }
                })

                //If we only need the get the pages categories : 'only_categories=true'
                if (req.query.only_categories && req.query.only_categories === 'true') {
                    //We send the response to client
                    cache.set(req.originalUrl, JSON.stringify(categories));
                    res.status(200).send(categories);
                } else {
                    //Assign default empty value to the sorted pages variable
                    let sortedPages: { category: { name: string, url: string }, pages: any[] }[] = [];
                    //For earch categories
                    categories.forEach(category => {
                        //Get all the pages from this category
                        let pages = response.filter(page => page.category.name === category.name);
                        //Sort them in the 'sortedPages' variable
                        sortedPages = [...sortedPages, {
                            category: category,
                            pages: pages
                        }];
                    })
                    //We send the response to client
                    cache.set(req.originalUrl, JSON.stringify(sortedPages));
                    res.status(200).send(sortedPages);
                }
            } else {
                //We send the response to client
                cache.set(req.originalUrl, JSON.stringify(response));
                res.status(200).send(response);
            }
        }

    } catch (err) {
        //If theres's errors we send 'em to the client
        return res.status(400).send({ message: err });
    }
}

/**
 * Get single page by URL
 */

export const getPageByUrl = async (req: Request, res: Response) => {
    //Check if the url params exists
    if (!req.params.url) {
        return res.status(400).send('Unknown URL : ' + req.params.id)
    }

    //Process search from 'url' param
    try {
        const response = await PageModel
            .findOne({
                "link": req.params.url
            })
            .populate('image')
            .exec()

        if (response) {
            //Store datas in cache
            cache.set(req.originalUrl, JSON.stringify(response));
            //We send the response to client
            res.status(200).send(response)
        }

    } catch (err) {
        //If theres's errors we send 'em to the client
        return res.status(400).send({ message: err })
    }
};

/**
 * Create pages
 */

export const createPage = async (req: Request, res: Response) => {
    //Body request destructuration
    let { title, category, link, content, image, published } = req.body as IPage;

    //If no page link have been added
    if (!link || link.length === 0) {
        let url = convertStringToURL(title);
        //We add a random 8 number to the url so it is unique
        link = `${url}-${randomNbID(8)}`;
    }

    if (category) {
        category.url = convertStringToURL(category);
    }

    //Database document creation
    await PageModel.create({
        title: title,
        link: link,
        category: category,
        content: content,
        published: published,
        image: image._id
    })
        .then(docs => {
            //We send the response to client
            return res.send(docs)
        })
        .catch(err => {
            //If theres's errors we convert them to human readable message and send 'em
            const errors = pageErrors(err);
            return res.status(400).send({ errors })
        })
}

/**
 * Update pages
 */

export const updatePage = async (req: Request, res: Response) => {
    //Body request destructuration
    let { title, category, link, content, image, published } = req.body as IPage;

    //If the link is in the req.body object but has no value
    if (title && (link && link.length === 0)) {
        let url = convertStringToURL(title);
        //We add a random 8 number to the url so it is unique
        link = `${url}-${randomNbID(8)}`;
    }

    if (category.name) {
        category.url = convertStringToURL(category.name);
    }

    //Check that the id params exists
    if (req.params.id) {
        //Check if the id params is a valide MongoDB ID
        if (!ObjectID.isValid(req.params.id))
            return res.status(400).send("ID unknown : " + req.params.id);
        else {
            //If the ID is valide we find the document based on it and trigger an update
            await PageModel.findByIdAndUpdate({
                _id: req.params.id
            }, {
                $set: {
                    title: title,
                    link: link,
                    category: category,
                    content: content,
                    published: published,
                    image: image?._id
                },
            }, {
                new: true,
                runValidators: true,
                context: 'query',
            })
                .then(docs => {
                    //Clear the current object caches
                    cache.del(`/api/pages`);
                    cache.del(`/api/pages/${req.params.id}`);
                    //We send the response to client
                    return res.send(docs)
                })
                .catch(err => {
                    //If theres's errors we convert them to human readable message and send 'em
                    const errors = pageErrors(err);
                    return res.status(400).send({ errors })
                })
        }
    }
};