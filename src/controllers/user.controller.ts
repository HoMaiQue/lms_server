import { Request, Response } from 'express'
import { Created, Ok } from '~/core/success.response'
import {
  ActivationTokenPayload,
  ChangePasswordRequestBody,
  RegisterRequestPayload,
  SocialAuthRequestPayload,
  UpdateAvatarRequestBody,
  UpdateUserRequestPayload
} from '~/models/request/user.request'
import UserService from '~/services/user.service'
import { ParamsDictionary } from 'express-serve-static-core'
import { USER_MESSAGE } from '~/constants/message'
import { UserDocument } from '~/models/schemas/user.schema'
import { HydratedDocument } from 'mongoose'
import { QueryRequest } from '~/models/request/common.request'
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
    const user_id = decoded_authorization.user_id
    return new Ok({
      message: USER_MESSAGE.LOGOUT_SUCCESSFUL,
      metaData: await UserService.logout(user_id, res)
    }).send(res)
  }
  refreshToken = async (req: Request, res: Response) => {
    const decoded_refresh_token = req.decoded_refresh_token
    const user_id = decoded_refresh_token.user_id
    const refresh_token = req.refresh_token as string
    return new Ok({
      message: USER_MESSAGE.GET_TOKEN_SUCCESS,
      metaData: await UserService.refreshToken(user_id, refresh_token, res)
    }).send(res)
  }
  getInfo = async (req: Request, res: Response) => {
    const user = req.user as HydratedDocument<UserDocument>
    const user_id = user._id.toString()
    return new Ok({
      message: USER_MESSAGE.GET_INFO_SUCCESS,
      metaData: await UserService.getInfo(user_id)
    }).send(res)
  }

  socialAuth = async (req: Request<ParamsDictionary, any, SocialAuthRequestPayload>, res: Response) => {
    return new Ok({
      message: USER_MESSAGE.LOGIN_SUCCESSFUL,
      metaData: await UserService.socialAuth(req.body, res)
    }).send(res)
  }
  updateUser = async (req: Request<ParamsDictionary, any, UpdateUserRequestPayload>, res: Response) => {
    const user_id = (req.user as HydratedDocument<UserDocument>)._id
    return new Ok({
      message: USER_MESSAGE.UPDATE_SUCCESS,
      metaData: await UserService.updateUser(user_id, req.body)
    }).send(res)
  }
  changePassword = async (req: Request<ParamsDictionary, any, ChangePasswordRequestBody>, res: Response) => {
    const password = req.body.password
    const { user_id } = req.decoded_authorization
    return new Ok({
      message: USER_MESSAGE.UPDATE_SUCCESS,
      metaData: await UserService.changePassword(user_id, password)
    }).send(res)
  }

  updateAvatar = async (req: Request<ParamsDictionary, any, UpdateAvatarRequestBody>, res: Response) => {
    const { user_id } = req.decoded_authorization
    return new Ok({
      message: USER_MESSAGE.UPDATE_SUCCESS,
      metaData: await UserService.updateAvatar(user_id, req.body)
    }).send(res)
  }
  getAllUser = async (req: Request<ParamsDictionary, any, any, any>, res: Response) => {
    return new Ok({
      message: USER_MESSAGE.UPDATE_SUCCESS,
      metaData: await UserService.getAllUser(req.query)
    }).send(res)
  }
  updateRoleUser = async (req: Request, res: Response) => {
    return new Ok({
      message: USER_MESSAGE.UPDATE_ROLE_SUCCESS,
      metaData: await UserService.updateRoleUser({ user_id: req.params.user_id, role: req.body.role })
    }).send(res)
  }
  deleteUser = async (req: Request, res: Response) => {
    return new Ok({
      message: USER_MESSAGE.DELETE_USER_SUCCESS,
      metaData: await UserService.deleteUser(req.params.user_id)
    }).send(res)
  }
  getUserAnalysis = async (req: Request, res: Response) => {
    return new Ok({
      message: USER_MESSAGE.GET_ANALYTICS_USER_SUCCESS,
      metaData: await UserService.getUserAnalysis()
    }).send(res)
  }
}

export default new UserController()
