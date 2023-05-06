import express, { Request, Response } from 'express'
import { updateCategory, createCategory } from '../controllers/categories.controller.ts'
import CategoryModel from '../models/category.model.ts'
import { deleteOne, getAll, getOne } from '../controllers/default.controllers.ts'

const categoriesRoutes = express.Router()

categoriesRoutes.get('/', (req: Request, res: Response) => getAll(req, res, CategoryModel, { populate: 'image promotions' }))
categoriesRoutes.get('/:id', (req: Request, res: Response) => getOne(req, res, CategoryModel, { populate: 'image promotions' }))
categoriesRoutes.post('/create', createCategory)
categoriesRoutes.put('/:id/update', updateCategory)
categoriesRoutes.delete('/:id/delete', (req: Request, res: Response) => deleteOne(req, res, CategoryModel))

export default categoriesRoutes