import { Request, Response } from 'express'
import mongoose, { PopulateOptions } from 'mongoose'
import { sanitize } from '../utils/utils.js';
const ObjectID = mongoose.Types.ObjectId

interface GetAllOptions<T> {
    query?: mongoose.FilterQuery<T>;
    select?: string | string[] | Record<string, number | boolean | object>;
    limit?: number | null;
    sort?: string | { [key: string]: -1 | 1 | 'asc' | 'ascending' | 'desc' | 'descending' };
    populate?: string | any;
    p?: number;
}

const defaultGetAllOptions: GetAllOptions<any> = { query: {}, select: null, limit: null, p: null, populate: null, sort: { createAt: 'asc' } }

export const getAll = async<T>(req: Request, res: Response, model: mongoose.Model<T>, options: GetAllOptions<T> = defaultGetAllOptions) => {

    if (req.query) {
        if (req.query.limit) {
            options.limit = Number(sanitize(String(req.query.limit)))
        }
        if (req.query.sort) {
            options.sort = sanitize(String(req.query.sort))
        }
        if (req.query.select) {
            options.select = sanitize(String(req.query.select))
        }
        if (req.query.populate) {
            if (req.query.populate !== 'false') {
                options.populate = sanitize(String(req.query.populate))
            } else options.populate = ''
        }
        if (req.query.p) {
            options.p = Number(req.query.p)
        }
    }

    try {
        const response = await model
            .find(options.query)
            .limit(options.limit)
            .select(options.select)
            .skip((options.p - 1) * options.limit)
            .populate(options.populate)
            .sort(options.sort)
            .exec()

        if (response) {
            res.status(200).send(response);
        }

    } catch (err) {
        return res.status(400).send({ message: err })
    }
}

interface GetOneOptions {
    populate?: string | any;
    select?: string | string[] | Record<string, number | boolean | object>;
}

const defaultGetOneOptions: GetOneOptions = { populate: null, select: null }

export const getOne = async<T>(req: Request, res: Response, model: mongoose.Model<T>, options: GetOneOptions = defaultGetOneOptions) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).send('Unknown ID : ' + req.params.id)
    }

    try {
        const response = await model
            .findById(req.params.id)
            .populate(options.populate)
            .select(options.select)
            .exec()

        res.status(200).send(response)

    } catch (err) {
        return res.status(400).send({ message: err })
    }
};

export const deleteOne = async<T>(req: Request, res: Response, model: mongoose.Model<T>) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).send('Unknown ID : ' + req.params.id)
    }

    try {
        const response = await model
            .findByIdAndDelete({ _id: req.params.id })
            .exec()

        res.status(200).json(response)

    } catch (err) {
        return res.status(400).send({ message: err })
    }
}