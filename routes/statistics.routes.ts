import express from 'express'
import { getCategoriesStatistics, getCustomersStatistics, getMostSoldProducts, getOrdersStatistics, getProductsStatistics, getSellsStatistics } from '../controllers/statistics.controller.js'

const statisticsRoutes = express.Router()

statisticsRoutes.get('/orders/:from', getOrdersStatistics)
statisticsRoutes.get('/sells/:from', getSellsStatistics)
statisticsRoutes.get('/products/:from', getProductsStatistics)
statisticsRoutes.get('/categories/:from', getCategoriesStatistics)
statisticsRoutes.get('/most-sold-products/:from', getMostSoldProducts)
statisticsRoutes.get('/customers/:from', getCustomersStatistics)

export default statisticsRoutes