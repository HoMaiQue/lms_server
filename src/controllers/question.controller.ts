import { ParamsDictionary } from 'express-serve-static-core'
import { Request, Response } from 'express'
import { QUESTION_MESSAGE } from '~/constants/message'
import { Created } from '~/core/success.response'
import QuestionService from '~/services/question.service'
import { CreateQuestionRequest, GetListQuestionRequest } from '~/models/request/question.request'
class QuestionController {
  createQuestion = async (req: Request<ParamsDictionary, any, CreateQuestionRequest>, res: Response) => {
    return new Created({
      message: QUESTION_MESSAGE.CREATE_QUESTION_SUCCESS,
      metaData: await QuestionService.createQuestion(req.body)
    }).send(res)
  }

  deleteQuestion = async (req: Request, res: Response) => {
    return new Created({
      message: QUESTION_MESSAGE.DELETE_QUESTION_SUCCESS,
      metaData: await QuestionService.deleteQuestion(req.body)
    }).send(res)
  }
  getListQuestion = async (req: Request<ParamsDictionary, any, any, any>, res: Response) => {
    return new Created({
      message: QUESTION_MESSAGE.GET_LIST_QUESTION_SUCCESS,
      metaData: await QuestionService.getQuestionsByParentId(req.query)
    }).send(res)
  }
}
export default new QuestionController()
