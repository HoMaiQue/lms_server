import { Router } from 'express'
import UserController from '~/controllers/user.controller'
import asyncHandler from '~/helpers/asyncHandler'
import { registerValidator } from '~/middleware/user.middleware'

const userRouter = Router()

userRouter.post('/register', registerValidator, asyncHandler(UserController.register))
userRouter.post('/activate-user', asyncHandler(UserController.activationAccount))

export default userRouter
