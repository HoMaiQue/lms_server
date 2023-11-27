import { Router } from 'express'
import { accessTokenValidator } from '~/middleware/user.middleware'
import ReviewController from '~/controllers/review.controller'
import asyncHandler from '~/helpers/asyncHandler'
const reviewRouter = Router()

reviewRouter.use(accessTokenValidator)
reviewRouter.post('', asyncHandler(ReviewController.createReview))
reviewRouter.get('', asyncHandler(ReviewController.getListReview))

export default reviewRouter
