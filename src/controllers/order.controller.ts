import { ParamsDictionary } from 'express-serve-static-core'
import { Request, Response } from 'express'
import { ORDER_MESSAGE } from '~/constants/message'
import { Created } from '~/core/success.response'
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
}
export default new OrderController()
