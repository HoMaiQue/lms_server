import { Request, Response } from 'express'
import { Created } from '~/core/success.response'
import { ActivationTokenPayload, RegisterRequestPayload } from '~/models/request/user.request'
import UserService from '~/services/user.service'
import { ParamsDictionary } from 'express-serve-static-core'
import { USER_MESSAGE } from '~/constants/message'
class UserController {
  register = async (req: Request<ParamsDictionary, any, RegisterRequestPayload>, res: Response) => {
    return new Created({
      message: USER_MESSAGE.ACTIVE_ACCOUNT,
      metaData: await UserService.Register(req.body)
    }).send(res)
  }
  activationAccount = async (req: Request<ParamsDictionary, any, ActivationTokenPayload>, res: Response) => {
    return new Created({
      message: USER_MESSAGE.REGISTER_SUCCESSFUL,
      metaData: await UserService.ActiveAccount(req.body)
    }).send(res)
  }
}

export default new UserController()
