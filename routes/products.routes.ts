import express, { Request, Response} from 'express'
import ProductModel from '../models/product.model.js'
import { getProducts, updateProduct, createProduct, getProductByUrl } from '../controllers/products.controller.js'
import { deleteOne, getOne } from '../controllers/default.controllers.js'

const productsRoutes = express.Router()

productsRoutes.get('/', getProducts)
productsRoutes.get('/variant/:url', getProductByUrl)
productsRoutes.get('/:id', (req: Request, res: Response) => getOne(req, res, ProductModel, { populate: 'images category promotions' }))
productsRoutes.post('/create', createProduct)
productsRoutes.put('/:id/update', updateProduct)
productsRoutes.delete('/:id/delete', (req: Request, res: Response) => deleteOne(req, res, ProductModel))

export default productsRoutes;