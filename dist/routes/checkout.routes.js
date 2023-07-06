import express from 'express';
import OrderModel from '../models/order.model.js';
import { deleteOne, getOne } from '../controllers/default.controllers.js';
import { createCheckout, updateCheckout } from '../controllers/checkout.controller.js';
var checkoutRoutes = express.Router();
checkoutRoutes.get('/:id', function (req, res) { return getOne(req, res, OrderModel, {
    populate: [
        {
            path: 'customer',
            select: '-password'
        }, {
            path: 'products.product',
            select: '_id name category images',
            populate: [
                {
                    path: 'images',
                    select: '_id name path',
                }, {
                    path: 'category',
                    select: '_id name parent link',
                }
            ]
        }, {
            path: 'carrier'
        }
    ]
}); });
checkoutRoutes.post('/create', createCheckout);
checkoutRoutes.put('/:id/update', updateCheckout);
checkoutRoutes.delete('/:id/delete', function (req, res) { return deleteOne(req, res, OrderModel); });
export default checkoutRoutes;
