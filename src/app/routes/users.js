import { Router } from "express"
import userController from "../controllers/users.js"
import { authMiddleware } from "../middleware/auth.js"

const userRoutes = Router()
const usersController = new userController

userRoutes.get('/users', usersController.index)
userRoutes.post('/users', usersController.store)
userRoutes.post('/users/authenticate', usersController.authenticate)
userRoutes.post('/users/me', authMiddleware, usersController.me)
userRoutes.delete('/users/delete', authMiddleware, usersController.delete)

export default userRoutes