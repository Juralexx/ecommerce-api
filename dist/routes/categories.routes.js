import express from 'express';
import { updateCategory, createCategory } from '../controllers/categories.controller.js';
import CategoryModel from '../models/category.model.js';
import { deleteOne, getAll, getOne } from '../controllers/default.controllers.js';
var categoriesRoutes = express.Router();
categoriesRoutes.get('/', function (req, res) { return getAll(req, res, CategoryModel, { populate: 'image promotions' }); });
categoriesRoutes.get('/:id', function (req, res) { return getOne(req, res, CategoryModel, { populate: 'image promotions' }); });
categoriesRoutes.post('/create', createCategory);
categoriesRoutes.put('/:id/update', updateCategory);
categoriesRoutes.delete('/:id/delete', function (req, res) { return deleteOne(req, res, CategoryModel); });
export default categoriesRoutes;
