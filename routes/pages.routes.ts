import express, { Request, Response } from 'express'
import PageModel from '../models/page.model.ts';
import { updatePage, createPage } from '../controllers/pages.controller.ts'
import { deleteOne, getAll, getOne } from '../controllers/default.controllers.ts';

const pagesRoutes = express.Router()

pagesRoutes.get('/', (req: Request, res: Response) => getAll(req, res, PageModel))
pagesRoutes.get('/:id', (req: Request, res: Response) => getOne(req, res, PageModel))
pagesRoutes.post('/create', createPage)
pagesRoutes.put('/:id/update', updatePage)
pagesRoutes.delete('/:id/delete', (req: Request, res: Response) => deleteOne(req, res, PageModel))

export default pagesRoutes