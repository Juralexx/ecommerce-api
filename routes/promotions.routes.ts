import express, { Request, Response } from 'express'
import { updatePromotion, createPromotion, deletePromotion } from '../controllers/promotions.controller.js'
import PromotionModel from '../models/promotion.model.js'
import { getAll, getOne } from '../controllers/default.controllers.js'

const promotionsRoutes = express.Router()

const population = [{
    path: 'condition.categories',
    select: '_id name parent link image',
    populate: [
        {
            path: 'image',
            select: '_id name path',
        }
    ]
}, {
    path: 'condition.products',
    select: '_id ref name category published price variants stock promotion images',
    populate: [
        {
            path: 'images',
            select: '_id name path',
        }, {
            path: 'category',
            select: '_id name parent link',
        }
    ]
}]

promotionsRoutes.get('/', (req: Request, res: Response) => getAll(req, res, PromotionModel, { populate: population }))
promotionsRoutes.get('/:id', (req: Request, res: Response) => getOne(req, res, PromotionModel, { populate: population }))
promotionsRoutes.post('/create', createPromotion)
promotionsRoutes.put('/:id/update', updatePromotion)
promotionsRoutes.delete('/:id/delete', deletePromotion)

export default promotionsRoutes