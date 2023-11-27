import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { HydratedDocument } from 'mongoose'
import { REVIEW_MESSAGE } from '~/constants/message'
import { Created, Ok } from '~/core/success.response'
import { CreateReviewRequest } from '~/models/request/review.request'
import { UserDocument } from '~/models/schemas/user.schema'
import ReviewService from '~/services/review.service'
class ReviewController {
  createReview = async (req: Request<ParamsDictionary, any, CreateReviewRequest>, res: Response) => {
    const user = req.user as HydratedDocument<UserDocument>
    return new Created({
      message: REVIEW_MESSAGE.CREATE_REVIEW_SUCCESS,
      metaData: await ReviewService.createReview(user, req.body)
    }).send(res)
  }
  getListReview = async (req: Request<ParamsDictionary, any, any, any>, res: Response) => {
    const user = req.user as HydratedDocument<UserDocument>
    return new Ok({
      message: REVIEW_MESSAGE.GET_LIST_REVIEW_SUCCESS,
      metaData: await ReviewService.getReviewByParentId(req.query)
    }).send(res)
  }
}

export default new ReviewController()
