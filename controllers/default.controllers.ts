import { Request, Response } from 'express'
import mongoose from 'mongoose'
import { convertStringToRegexp, onlyNumbers, sanitize } from '../utils/utils.js';
import { cache } from '../app.js';
const ObjectID = mongoose.Types.ObjectId

//Query options interface
interface GetAllOptions<T> {
    query?: mongoose.FilterQuery<T>;
    select?: string | string[] | Record<string, number | boolean | object> | null;
    limit?: number | null;
    sort?: string | { [key: string]: -1 | 1 | 'asc' | 'ascending' | 'desc' | 'descending' } | null;
    populate?: string | any | null;
    p?: number;
    published?: string | boolean
}

/**
 * Default get request to retrieve collection documents
 * @param req Express request
 * @param res Express response
 * @param model Mongoose model
 * @param options Query options : `query`, `select`, `limit`, `sort`, `populate`, `p`
 */

export const getAll = async<T>(req: Request, res: Response, model: mongoose.Model<T>, config?: GetAllOptions<T>) => {
    const options: GetAllOptions<T> = { query: {}, select: null, limit: null, p: null, populate: null, sort: { createAt: 'asc' }, ...config };

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

        //If the 'published' query params exists
        if (req.query.published) {
            //Convert it to string
            const published = req.query.published.toString();
            //Check that the values are valid 'true' or 'false
            if (published === 'true' || published === 'false') {
                options.query = { ...options.query, "published": published || true };
            }
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
    }

    //Process query search
    try {
        const response = await model
            .find(options.query)
            .limit(options.limit)
            .select(options.select)
            //We skip the number of documents to return document from current page
            .skip((options.p - 1) * options.limit)
            .populate(options.populate)
            .sort(options.sort)
            .exec()

        if (response) {
            //We send the response to client
            res.status(200).send(response);
        }

    } catch (err) {
        //If theres's errors we send 'em to the client
        return res.status(400).send({ message: err });
    }
}

//Query options interface
interface GetOneOptions {
    populate?: string | any;
    select?: string | string[] | Record<string, number | boolean | object>;
}

/**
 * Default get request to retrieve one collection document
 * @param req Express request
 * @param res Express response
 * @param model Mongoose model
 * @param options Query options : `select`, `populate`
 */

export const getOne = async<T>(req: Request, res: Response, model: mongoose.Model<T>, config?: GetOneOptions) => {
    //Check if the id params is a valide MongoDB ID
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).send('Unknown ID : ' + req.params.id)
    }

    const options: GetOneOptions = { populate: null, select: null, ...config };

    //Assign default values to 'options'
    //options = { ...defaultGetOneOptions }

    //Process search from 'id' param
    try {
        const response = await model
            .findById(req.params.id)
            .populate(options.populate)
            .select(options.select)
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
 * Default delete request to delete one collection document
 * @param req Express request
 * @param res Express response
 * @param model Mongoose model
 */

export const deleteOne = async<T>(req: Request, res: Response, model: mongoose.Model<T>) => {
    //Check if the id params is a valide MongoDB ID
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).send('Unknown ID : ' + req.params.id)
    }

    try {
        //Process deletion
        const response = await model
            .findByIdAndDelete({ _id: req.params.id })
            .exec()

        //We send the response to client
        res.status(200).json(response)

    } catch (err) {
        //If theres's errors we send 'em to the client
        return res.status(400).send({ message: err })
    }
}