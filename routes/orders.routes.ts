import express, { Request, Response } from 'express'
import OrderModel from '../models/order.model.ts'
import { deleteOne, getOne } from '../controllers/default.controllers.ts'
import { createOrder, getOrders, updateOrder } from '../controllers/orders.controller.ts'

const ordersRoutes = express.Router()

ordersRoutes.get('/', getOrders)
ordersRoutes.get('/:id', (req: Request, res: Response) => getOne(req, res, OrderModel, {
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
ordersRoutes.post('/create', createOrder)
ordersRoutes.put('/:id/update', updateOrder)
ordersRoutes.delete('/:id/delete', (req: Request, res: Response) => deleteOne(req, res, OrderModel))

export default ordersRoutes