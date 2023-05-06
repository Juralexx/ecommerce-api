import express, { Request, Response} from 'express'
import NavigationModel from '../models/navigation.model.ts'
import { updateNavigation } from '../controllers/navigation.controller.ts'
import { getAll } from '../controllers/default.controllers.ts'

const navigationRoutes = express.Router()

navigationRoutes.get('/', (req: Request, res: Response) => getAll(req, res, NavigationModel))
navigationRoutes.put('/update', updateNavigation)

export default navigationRoutes