import { ActivationTokenPayload, RegisterRequestPayload } from '~/models/request/user.request'
import crypto from 'node:crypto'
import KeyServices from './key.service'
import { createTokenPair, signEmailVerifyActivationCode, signToken, verifyJWT } from '~/utils/jwt'
import { BadRequestError } from '~/core/error.response'
import { USER_MESSAGE } from '~/constants/message'
import { sendVerifyEmailRegister } from '~/utils/email'
import userSchema from '~/models/schemas/user.schema'
import { hashPassword, randomCode } from '~/utils/crypto'

class UserService {
  async Register(payload: RegisterRequestPayload) {
    const activationCode = randomCode()
    const newPayload = { ...payload, activationCode }

    const activationToken = signEmailVerifyActivationCode(newPayload)

    await sendVerifyEmailRegister(payload.email, payload.name, activationCode)

    return activationToken
  }

  async ActiveAccount(payload: ActivationTokenPayload) {
    const { activationCode, activationToken } = payload
    const decodedActivationAccount = await verifyJWT({
      token: activationToken,
      keySecret: process.env.ACTIVATION_SECRET as string
    })

    if (decodedActivationAccount.activationCode !== activationCode) {
      throw new BadRequestError('Invalid activation code')
    }
    const password = hashPassword(decodedActivationAccount.password)
    const { name, email, avatar } = decodedActivationAccount
    const user = await userSchema.create({
      name,
      email,
      password,
      avatar: avatar || ''
    })

    return user
  }
}

export default new UserService()
