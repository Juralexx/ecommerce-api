import express, { Request, Response } from 'express'
import OrderModel from '../models/order.model.js'
import { deleteOne, getOne } from '../controllers/default.controllers.js'
import { createCheckout, updateCheckout } from '../controllers/checkout.controller.js'

const checkoutRoutes = express.Router()

checkoutRoutes.get('/:id', (req: Request, res: Response) => getOne(req, res, OrderModel, {
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
}))
checkoutRoutes.post('/create', createCheckout)
checkoutRoutes.put('/:id/update', updateCheckout)
checkoutRoutes.delete('/:id/delete', (req: Request, res: Response) => deleteOne(req, res, OrderModel))

export default checkoutRoutes;