import express, { Request, Response } from 'express'
import CartModel from '../models/cart.model.ts'
import { createCart, updateCart } from '../controllers/cart.controller.ts'
import { deleteOne, getAll, getOne } from '../controllers/default.controllers.ts'

const cartRoutes = express.Router()

const population = [
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
]

cartRoutes.get('/', (req: Request, res: Response) => getAll(req, res, CartModel, { populate: population }))
cartRoutes.get('/:id', (req: Request, res: Response) => getOne(req, res, CartModel, { populate: population }))
cartRoutes.post('/create', createCart)
cartRoutes.put('/:id/update', updateCart)
cartRoutes.delete('/:id/delete', (req: Request, res: Response) => deleteOne(req, res, CartModel))

export default cartRoutes