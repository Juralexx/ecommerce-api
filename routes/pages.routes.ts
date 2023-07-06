import express, { Request, Response } from 'express'
import PageModel from '../models/page.model.js';
import { updatePage, createPage, getPages, getPageByUrl } from '../controllers/pages.controller.js'
import { deleteOne, getOne } from '../controllers/default.controllers.js';

const pagesRoutes = express.Router()

pagesRoutes.get('/', getPages)
pagesRoutes.get('/single/:url', getPageByUrl)
pagesRoutes.get('/:id', (req: Request, res: Response) => getOne(req, res, PageModel, { populate: 'image' }))
pagesRoutes.post('/create', createPage)
pagesRoutes.put('/:id/update', updatePage)
pagesRoutes.delete('/:id/delete', (req: Request, res: Response) => deleteOne(req, res, PageModel))

export default pagesRoutes