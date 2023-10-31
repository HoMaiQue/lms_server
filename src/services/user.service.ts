import { Response } from 'express'
import { HydratedDocument } from 'mongoose'
import crypto from 'node:crypto'
import { BadRequestError } from '~/core/error.response'
import client from '~/dbs/init.redis'
import { ActivationTokenPayload, RegisterRequestPayload } from '~/models/request/user.request'
import userSchema, { UserDocument } from '~/models/schemas/user.schema'
import { hashPassword, randomCode } from '~/utils/crypto'
import { sendVerifyEmailRegister } from '~/utils/email'
import { createTokenPair, handleOptionCookie, signEmailVerifyActivationCode, verifyJWT } from '~/utils/jwt'

class UserService {
  async register(payload: RegisterRequestPayload) {
    const activationCode = randomCode()
    const newPayload = { ...payload, activationCode }

    const activationToken = signEmailVerifyActivationCode(newPayload)

    await sendVerifyEmailRegister(payload.email, payload.name, activationCode)

    return activationToken
  }

  async activeAccount(payload: ActivationTokenPayload) {
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

  async login(user: HydratedDocument<UserDocument>, res: Response) {
    const private_key = crypto.randomBytes(64).toString('hex')
    const public_key = crypto.randomBytes(64).toString('hex')
    const payloadCreateToken = {
      user_id: user._id.toString()
    }
    const resultCreateToken = await createTokenPair(payloadCreateToken, public_key, private_key)
    await Promise.all([
      client.set(user._id.toString(), JSON.stringify(user)),
      client.set('prk_' + user._id.toString(), private_key),
      client.set('puk_' + user._id.toString(), public_key)
    ])

    const optionCookie = handleOptionCookie()
    res.cookie('access_token', resultCreateToken?.access_token, optionCookie.accessTokenOptions)
    res.cookie('refresh_token', resultCreateToken?.refresh_token, optionCookie.refreshTokenOptions)
    return {
      user_id: user._id.toString(),
      tokens: resultCreateToken
    }
  }

  async logout(user_id: string, res: Response) {
    res.cookie('access_token', '', { maxAge: 1 })
    res.cookie('refresh_token', '', { maxAge: 1 })

    await Promise.all([
      client.del(user_id),
      client.del('prk_' + user_id),
      client.del('puk_' + user_id),
      client.del('refreshTokenUsed_' + user_id)
    ])
    return true
  }
}

export default new UserService()
