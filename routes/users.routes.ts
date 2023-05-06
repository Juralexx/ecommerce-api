import express, { Request, Response } from 'express'
import UserModel from '../models/user.model.ts'
import { login, logout } from '../controllers/auth.controller.ts'
import { register, updateUser } from '../controllers/users.controller.ts'
import { deleteOne, getAll, getOne } from '../controllers/default.controllers.ts'

const usersRoutes = express.Router()

usersRoutes.post('/register', register)
usersRoutes.post('/login', (req: Request, res: Response) => login(req, res, UserModel))
usersRoutes.get('/logout', logout)

usersRoutes.get('/', (req: Request, res: Response) => getAll(req, res, UserModel, { select: '-password' }))
usersRoutes.get('/:id', (req: Request, res: Response) => getOne(req, res, UserModel, { select: '-password' }))
usersRoutes.put('/:id/update', updateUser)
usersRoutes.delete('/:id/delete', (req: Request, res: Response) => deleteOne(req, res, UserModel))

export default usersRoutes