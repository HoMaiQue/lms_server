import { Router } from 'express'
import { accessTokenValidator } from '~/middleware/user.middleware'
import OrderController from '~/controllers/order.controller'
import asyncHandler from '~/helpers/asyncHandler'
const orderRouter = Router()

orderRouter.use(accessTokenValidator)
orderRouter.post('', asyncHandler(OrderController.createOrder))
// orderRouter.get('', asyncHandler(ReviewController.getListReview))

export default orderRouter
