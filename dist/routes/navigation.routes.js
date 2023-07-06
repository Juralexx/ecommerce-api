import express from 'express';
import NavigationModel from '../models/navigation.model.js';
import { updateNavigation } from '../controllers/navigation.controller.js';
import { getAll } from '../controllers/default.controllers.js';
var navigationRoutes = express.Router();
navigationRoutes.get('/', function (req, res) { return getAll(req, res, NavigationModel); });
navigationRoutes.put('/update', updateNavigation);
export default navigationRoutes;
