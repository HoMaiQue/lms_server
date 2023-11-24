import { Router } from 'express'
import { accessTokenValidator } from '~/middleware/user.middleware'
import QuestionController from '~/controllers/question.controller'
import asyncHandler from '~/helpers/asyncHandler'
const questionRouter = Router()

questionRouter.use(accessTokenValidator)
questionRouter.post('', asyncHandler(QuestionController.createQuestion))

export default questionRouter
