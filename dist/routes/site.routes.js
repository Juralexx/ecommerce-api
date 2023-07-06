import express from 'express';
import SiteModel from '../models/site.model.js';
import { getAll } from '../controllers/default.controllers.js';
import { updateSiteDatas } from '../controllers/site.controller.js';
var siteRoutes = express.Router();
siteRoutes.get('/', function (req, res) { return getAll(req, res, SiteModel); });
siteRoutes.put('/update', updateSiteDatas);
export default siteRoutes;
