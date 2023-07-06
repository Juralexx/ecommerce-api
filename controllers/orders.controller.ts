import mongoose from 'mongoose'
const ObjectID = mongoose.Types.ObjectId
import { Request, Response } from 'express'
import { IOrder } from '../types/types';
import OrderModel from '../models/order.model.js';
import CustomerModel from '../models/customer.model.js';
import { convertStringToRegexp, onlyNumbers, sanitize } from '../utils/utils.js';
import { sendOrderInPreparationEmail, sendOrderShippedEmail } from '../email/email.controller.js';
import { cache } from '../app.js';

/**
 * Get and search orders
 */

export const getOrders = async (req: Request, res: Response) => {
    //Object containing the query search
    let queries: Record<string, any> = {};
    //We assign core values to the option object
    //p = current page
    //limit = number of returned objects
    //sort = sort chronologically
    let options: Record<string, any> = {
        p: 1,
        limit: 24,
        sort: { '_id': -1 }
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
        }
        //If the 'p' query params exists
        if (req.query.p && onlyNumbers(req.query.p)) {
            //Convert it to number
            options.p = Number(req.query.p);
        }
        //If the 'select' query params exists
        if (req.query.select) {
            //Convert it to string and sanitize it
            options.select = sanitize(String(req.query.select));
        }
        //If the 'q' query params exists
        if (req.query.q) {
            //Convert it to string and sanitize it
            const q = sanitize(String(req.query.q));
            //Convert it to MongoDB caseSensitive Regexp
            const regex = convertStringToRegexp(q);
            //Add $or operator in 'queries' object
            //to make a search in multiple fields
            queries = {
                ...queries,
                "$or": [
                    { "payment_method": { "$regex": regex } },
                    { "payment_status": { "$regex": regex } },
                    { "status": { "$regex": regex } },
                ]
            };
        };

        //Split the queries params with multiple possible values
        //used as 'status=1,2' to [1, 2]
        ['status', 'payment_status', 'payment_method', 'carrier']
            .forEach(type => {
                //If the query param exists
                if (req.query[type]) {
                    //Split it to array
                    const isMultiple = req.query[type].toString().split(',');
                    //If array as multiple values we pass the array to the property
                    if (isMultiple.length > 1) {
                        queries = {
                            ...queries,
                            [type]: isMultiple
                        };
                    }
                    //Else we pass the single originale value
                    else {
                        queries = {
                            ...queries,
                            [type]: req.query[type]
                        };
                    };
                };
            });

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
                        "date": {
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
                            "date": {
                                $gte: startDate,
                                $lte: endDate
                            }
                        }
                    };
                };
            };
        };
    };

    //Count the number of documents matching the query object
    const count = await OrderModel.countDocuments(queries);

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
    try {
        await OrderModel
            .find(queries)
            .sort(options.sort)
            .limit(options.limit)
            //We skip the number of documents to return document from current page
            .skip((options.p - 1) * options.limit)
            //Populate the 'customer' object
            //Remove the password
            .populate({
                path: 'customer',
                select: '-password'
            })
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
            .select(options.select)
            .then(docs => {
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
                })
            })
    } catch (err) {
        console.log(err);
        return res.status(400).send({ message: err });
    };
};

/**
 * Create order
 */

export const createOrder = async (req: Request, res: Response) => {
    //Body request destructuration
    const { customer, date, payment_method, delivery_address, billing_address, products, price, shipping_fees, carrier, status, timeline }: IOrder = req.body;

    //Database document creation
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
            //We add the created order to the customers 'orders' property
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
            //We send the order to the client
            return res.send(docs);
        })
        .catch(err => {
            //If theres's errors send 'em to the client
            return res.status(400).send({ message: err });
        });
};

/**
 * Update order
 */

export const updateOrder = async (req: Request, res: Response) => {
    //Body request destructuration
    const { customer, date, payment_method, delivery_address, billing_address, products, price, shipping_fees, carrier, status, timeline }: IOrder = req.body;

    //If req.body contains 'status'
    if (status) {
        if (status === 'preparation') {
            //Find the current order
            await OrderModel
                .findById(req.params.id)
                .populate('customer')
                .then(doc => {
                    //Send the mail to inform the customer that the order 
                    //is 'in preparation'
                    return sendOrderInPreparationEmail(doc);
                })
                .catch(err => console.log(err))
        }
        if (status === 'shipped') {
            //Find the current order
            await OrderModel
                .findById(req.params.id)
                .populate('customer')
                .then(doc => {
                    //Send the mail to inform the customer that the order 
                    //is 'shipped'
                    return sendOrderShippedEmail(doc);
                })
                .catch(err => console.log(err))
        }
    };

    //Check that the id params exists
    if (req.params.id) {
        //Check if the id params is a valide MongoDB ID
        if (!ObjectID.isValid(req.params.id))
            return res.status(400).send("ID unknown : " + req.params.id);
        else {
            //Database document update
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
                    //Clear the current object caches
                    cache.del(`/api/orders`);
                    cache.del(`/api/orders/${req.params.id}`);
                    //We send the response to client
                    return res.send(docs);
                })
                .catch(err => {
                    //If theres's errors send 'em to the client
                    return res.status(400).send({ message: err });
                })
        };
    };
};