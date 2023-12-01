import { Router } from 'express'
import { accessTokenValidator, authorizeRoles } from '~/middleware/user.middleware'
import OrderController from '~/controllers/order.controller'
import asyncHandler from '~/helpers/asyncHandler'
const orderRouter = Router()

orderRouter.use(accessTokenValidator)
orderRouter.post('', asyncHandler(OrderController.createOrder))
orderRouter.get('', asyncHandler(OrderController.getAllOrder))
orderRouter.get('/analytics', authorizeRoles('admin'), asyncHandler(OrderController.getOrderAnalysis))

export default orderRouter
