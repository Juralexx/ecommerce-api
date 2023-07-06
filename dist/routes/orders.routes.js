import express from 'express';
import OrderModel from '../models/order.model.js';
import { deleteOne, getOne } from '../controllers/default.controllers.js';
import { createOrder, getOrders, updateOrder } from '../controllers/orders.controller.js';
var ordersRoutes = express.Router();
ordersRoutes.get('/', getOrders);
ordersRoutes.get('/:id', function (req, res) { return getOne(req, res, OrderModel, {
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
ordersRoutes.post('/create', createOrder);
ordersRoutes.put('/:id/update', updateOrder);
ordersRoutes.delete('/:id/delete', function (req, res) { return deleteOne(req, res, OrderModel); });
export default ordersRoutes;
