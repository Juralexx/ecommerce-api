import express from 'express';
import CartModel from '../models/cart.model.js';
import { createCart, updateCart } from '../controllers/cart.controller.js';
import { deleteOne, getAll, getOne } from '../controllers/default.controllers.js';
var cartRoutes = express.Router();
var population = [
    {
        path: 'products.product',
        select: '_id name category images promotions variants',
        populate: [
            {
                path: 'images',
                select: '_id name path',
            }, {
                path: 'category',
                select: '_id name parent link',
            }, {
                path: 'promotions',
            }
        ]
    }
];
cartRoutes.get('/', function (req, res) { return getAll(req, res, CartModel, { populate: population }); });
cartRoutes.get('/:id', function (req, res) { return getOne(req, res, CartModel, { populate: population }); });
cartRoutes.post('/create', createCart);
cartRoutes.put('/:id/update', updateCart);
cartRoutes.delete('/:id/delete', function (req, res) { return deleteOne(req, res, CartModel); });
export default cartRoutes;
