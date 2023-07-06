import express, { Request, Response} from 'express'
import NavigationModel from '../models/navigation.model.js'
import { updateNavigation } from '../controllers/navigation.controller.js'
import { getAll } from '../controllers/default.controllers.js'

const navigationRoutes = express.Router()

navigationRoutes.get('/', (req: Request, res: Response) => getAll(req, res, NavigationModel))
navigationRoutes.put('/update', updateNavigation)

export default navigationRoutes