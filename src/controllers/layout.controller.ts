import { ParamsDictionary } from 'express-serve-static-core'
import { Request, Response } from 'express'
import { LAYOUT_MESSAGE } from '~/constants/message'
import { Created, Ok } from '~/core/success.response'
import LayoutService from '~/services/layout.service'
import { CreateLayoutRequest } from '~/models/request/layout.request'
class LayoutController {
  createLayout = async (req: Request<ParamsDictionary, any, CreateLayoutRequest>, res: Response) => {
    return new Created({
      message: LAYOUT_MESSAGE.CREATE_LAYOUT_SUCCESS,
      metaData: await LayoutService.createLayout(req.body)
    }).send(res)
  }
  updateLayout = async (req: Request<ParamsDictionary, any, CreateLayoutRequest>, res: Response) => {
    return new Ok({
      message: LAYOUT_MESSAGE.UPDATE_LAYOUT_SUCCESS,
      metaData: await LayoutService.updateLayout(req.params.layout_id, req.body)
    }).send(res)
  }
  getLayoutByType = async (req: Request, res: Response) => {
    return new Ok({
      message: LAYOUT_MESSAGE.GET_LAYOUT_SUCCESS,
      metaData: await LayoutService.getLayoutByType(req.params.layout_type)
    }).send(res)
  }
}

export default new LayoutController()
