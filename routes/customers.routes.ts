import express, { Request, Response } from 'express'
import CustomerModel from '../models/customer.model.js'
import { login, logout } from '../controllers/auth.controller.js'
import { getCustomers, register, updateCustomer } from '../controllers/customers.controller.js'
import { deleteOne, getOne } from '../controllers/default.controllers.js'

const customersRoutes = express.Router()

customersRoutes.post('/register', register)
customersRoutes.post('/login', (req: Request, res: Response) => login(req, res, CustomerModel))
customersRoutes.get('/logout', logout)

customersRoutes.get('/', getCustomers)
customersRoutes.get('/:id', (req: Request, res: Response) => getOne(req, res, CustomerModel, { select: '-password', populate: 'orders' }))
customersRoutes.put('/:id/update', updateCustomer)
customersRoutes.delete('/:id/delete', (req: Request, res: Response) => deleteOne(req, res, CustomerModel))

export default customersRoutes;