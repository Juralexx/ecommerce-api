import mongoose from 'mongoose'
const ObjectID = mongoose.Types.ObjectId
import { Request, Response } from 'express'
import { IOrder } from '../types/types';
import OrderModel from '../models/order.model.ts';
import CustomerModel from '../models/customer.model.ts';
import { productErrors } from '../errors/products.errors.ts';
import { convertStringToRegexp, sanitize } from '../utils/utils.js';

/**
 * Get and search orders
 */

export const getOrders = async (req: Request, res: Response) => {
    let queries: Record<string, any> = {}
    let options: Record<string, any> = {
        p: 1,
        limit: 24,
        sort: { '_id': -1 }
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

        ['status', 'payment_status', 'payment_method', 'carrier']
            .forEach(type => {
                if (req.query[type]) {
                    const isMultiple = req.query[type].toString().split(',')
                    if (isMultiple.length > 1) {
                        queries = {
                            ...queries,
                            [type]: isMultiple
                        }
                    } else {
                        queries = {
                            ...queries,
                            [type]: req.query[type]
                        }
                    }
                }
            })

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

    const count = await OrderModel.countDocuments(queries);

    if (options.p) {
        if (options.p > Math.ceil(count / options.limit)) {
            options.p = Math.ceil(count / options.limit)
        }
        if (options.p < 1) {
            options.p = 1
        }
    }

    try {
        await OrderModel
            .find(queries)
            .sort(options.sort)
            .limit(options.limit)
            .select(options.select)
            .skip((options.p - 1) * options.limit)
            .populate('customer', '-password')
            .populate('carrier')
            .populate({
                path: 'products.product',
                select: '_id ref name category price stock promotion images',
                populate: [
                    {
                        path: 'images',
                        select: '_id name path',
                    },
                    {
                        path: 'category',
                        select: '_id name parent link',
                    }
                ]
            })
            .populate('carrier')
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
 * Create order
 */

export const createOrder = async (req: Request, res: Response) => {
    const { customer, date, payment_method, delivery_address, billing_address, products, price, shipping_fees, carrier, status, timeline }: IOrder = req.body


    await OrderModel.create({
        customer,
        date,
        payment_method,
        delivery_address,
        billing_address,
        products,
        price,
        shipping_fees,
        carrier,
        status,
        timeline
    })
        .then(async (docs) => {
            await CustomerModel.findByIdAndUpdate({
                _id: customer._id
            }, {
                $addToSet: {
                    orders: docs._id
                }
            }, {
                new: true,
                runValidators: true,
                context: 'query',
            })
            return res.send(docs)
        })
        .catch(err => {
            const errors = productErrors(err);
            return res.status(400).send({ errors })
        })
}

/**
 * Update order
 */

export const updateOrder = async (req: Request, res: Response) => {
    const { customer, date, payment_method, delivery_address, billing_address, products, price, shipping_fees, carrier, status, timeline }: IOrder = req.body

    if (req.params.id) {
        if (!ObjectID.isValid(req.params.id))
            return res.status(400).send("ID unknown : " + req.params.id);
        else {
            await OrderModel.findByIdAndUpdate({
                _id: req.params.id
            }, {
                $set: {
                    customer,
                    date,
                    payment_method,
                    delivery_address,
                    billing_address,
                    products,
                    price,
                    shipping_fees,
                    carrier,
                    status,
                },
                $addToSet: {
                    timeline: timeline
                }
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