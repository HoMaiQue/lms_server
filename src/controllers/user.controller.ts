import { Request, Response } from 'express'
import { Created, Ok } from '~/core/success.response'
import { ActivationTokenPayload, RegisterRequestPayload } from '~/models/request/user.request'
import UserService from '~/services/user.service'
import { ParamsDictionary } from 'express-serve-static-core'
import { USER_MESSAGE } from '~/constants/message'
import { UserDocument } from '~/models/schemas/user.schema'
import { HydratedDocument } from 'mongoose'
class UserController {
  register = async (req: Request<ParamsDictionary, any, RegisterRequestPayload>, res: Response) => {
    return new Created({
      message: USER_MESSAGE.ACTIVE_ACCOUNT,
      metaData: await UserService.register(req.body)
    }).send(res)
  }
  activationAccount = async (req: Request<ParamsDictionary, any, ActivationTokenPayload>, res: Response) => {
    return new Created({
      message: USER_MESSAGE.REGISTER_SUCCESSFUL,
      metaData: await UserService.activeAccount(req.body)
    }).send(res)
  }

  login = async (req: Request<ParamsDictionary, any, ActivationTokenPayload>, res: Response) => {
    const user = req.user as HydratedDocument<UserDocument>
    return new Ok({
      message: USER_MESSAGE.LOGIN_SUCCESSFUL,
      metaData: await UserService.login(user, res)
    }).send(res)
  }

  logout = async (req: Request, res: Response) => {
    const decoded_authorization = req.decoded_authorization
    console.log(decoded_authorization)
    const user_id = decoded_authorization.user_id
    return new Ok({
      message: USER_MESSAGE.LOGOUT_SUCCESSFUL,
      metaData: await UserService.logout(user_id, res)
    }).send(res)
  }
}

export default new UserController()
