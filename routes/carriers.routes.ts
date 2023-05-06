import express, { Request, Response } from 'express'
import CarrierModel from '../models/carrier.model.ts'
import { deleteOne, getAll, getOne } from '../controllers/default.controllers.ts'
import { createCarrier, updateCarrier } from '../controllers/carrier.controller.ts'

const carriersRoutes = express.Router()

carriersRoutes.get('/', (req: Request, res: Response) => getAll(req, res, CarrierModel))
carriersRoutes.get('/:id', (req: Request, res: Response) => getOne(req, res, CarrierModel))
carriersRoutes.post('/create', createCarrier)
carriersRoutes.put('/:id/update', updateCarrier)
carriersRoutes.delete('/:id/delete', (req: Request, res: Response) => deleteOne(req, res, CarrierModel))

export default carriersRoutes