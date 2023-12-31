import { Router } from 'express'
import UserController from '~/controllers/user.controller'
import asyncHandler from '~/helpers/asyncHandler'
import { filterMiddleware } from '~/middleware/common.middleware'
import {
  registerValidator,
  loginValidator,
  accessTokenValidator,
  refreshTokenValidator,
  updateUserValidator,
  changePasswordValidator,
  authorizeRoles
} from '~/middleware/user.middleware'

const userRouter = Router()

userRouter.post('/register', registerValidator, asyncHandler(UserController.register))

userRouter.post('/activate-user', asyncHandler(UserController.activationAccount))

userRouter.post('/login', loginValidator, asyncHandler(UserController.login))
userRouter.post('/social-auth', asyncHandler(UserController.socialAuth))

userRouter.post('/refresh-token', refreshTokenValidator, asyncHandler(UserController.refreshToken))

userRouter.use(accessTokenValidator)

userRouter.get('/me', asyncHandler(UserController.getInfo))
userRouter.get('', authorizeRoles('admin'), asyncHandler(UserController.getAllUser))
userRouter.put('/update-role/:user_id', authorizeRoles('admin'), asyncHandler(UserController.updateRoleUser))
userRouter.delete('/:user_id', authorizeRoles('admin'), asyncHandler(UserController.deleteUser))
userRouter.get('/analytics', authorizeRoles('admin'), asyncHandler(UserController.getUserAnalysis))

userRouter.patch(
  '/update',
  updateUserValidator,
  filterMiddleware(['name', 'email']),
  asyncHandler(UserController.updateUser)
)
userRouter.put('/change-password', changePasswordValidator, asyncHandler(UserController.changePassword))
userRouter.put('/update-avatar', asyncHandler(UserController.updateAvatar))
userRouter.post('/logout', asyncHandler(UserController.logout))

export default userRouter
