import { ParamsDictionary } from 'express-serve-static-core'
import { Request, Response } from 'express'
import { ORDER_MESSAGE } from '~/constants/message'
import { Created, Ok } from '~/core/success.response'
import { CreateOrderRequest } from '~/models/request/order.request'
import OrderService from '~/services/order.service'
import { HydratedDocument } from 'mongoose'
import { UserDocument } from '~/models/schemas/user.schema'
class OrderController {
  createOrder = async (req: Request<ParamsDictionary, any, CreateOrderRequest>, res: Response) => {
    const user = req.user as HydratedDocument<UserDocument>
    return new Created({
      message: ORDER_MESSAGE.CREATE_ORDER_SUCCESS,
      metaData: await OrderService.createOrder(user, req.body)
    }).send(res)
  }

  getAllOrder = async (req: Request<ParamsDictionary, any, any, any>, res: Response) => {
    return new Ok({
      message: ORDER_MESSAGE.GET_ORDER_SUCCESS,
      metaData: await OrderService.getAllOrder(req.query)
    }).send(res)
  }
}
export default new OrderController()
