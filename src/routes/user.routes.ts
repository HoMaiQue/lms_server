import { Router } from 'express'
import UserController from '~/controllers/user.controller'
import asyncHandler from '~/helpers/asyncHandler'
import {
  registerValidator,
  loginValidator,
  accessTokenValidator,
  refreshTokenValidator
} from '~/middleware/user.middleware'

const userRouter = Router()

userRouter.post('/register', registerValidator, asyncHandler(UserController.register))
userRouter.post('/activate-user', asyncHandler(UserController.activationAccount))
userRouter.post('/login', loginValidator, asyncHandler(UserController.login))

userRouter.post('/refresh-token', refreshTokenValidator, asyncHandler(UserController.refreshToken))
userRouter.use(accessTokenValidator)
userRouter.post('/logout', asyncHandler(UserController.logout))

export default userRouter
