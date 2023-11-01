import { TokenPayload } from '~/models/requests/User.requests'
import { Request } from 'express'
import { HydratedDocument } from 'mongoose'
import { UserDocument } from './models/schemas/user.schema'
declare module 'express' {
  interface Request {
    user?: HydratedDocument<UserDocument>
    decoded_authorization?: TokenPayload
    decoded_refresh_token?: TokenPayload
    refresh_token?: string
    // decoded_email_verify_token?: TokenPayload
    // decoded_forgot_password_token?: TokenPayload
  }
}
