import express, { Request, Response} from 'express'
import SiteModel from '../models/site.model.js'
import { getAll } from '../controllers/default.controllers.js'
import { updateSiteDatas } from '../controllers/site.controller.js'

const siteRoutes = express.Router()

siteRoutes.get('/', (req: Request, res: Response) => getAll(req, res, SiteModel))
siteRoutes.put('/update', updateSiteDatas)

export default siteRoutes