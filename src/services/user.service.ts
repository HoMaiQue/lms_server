import { Response } from 'express'
import { HydratedDocument } from 'mongoose'
import crypto from 'node:crypto'
import { AuthFailureError, BadRequestError, ForbiddenError } from '~/core/error.response'
import client from '~/dbs/init.redis'
import { createUser, findUserByCondition, getUserById } from '~/models/repositories/user.repo'
import {
  ActivationTokenPayload,
  RegisterRequestPayload,
  SocialAuthRequestPayload,
  UpdateAvatarRequestBody,
  UpdateUserRequestPayload
} from '~/models/request/user.request'
import userSchema, { UserDocument } from '~/models/schemas/user.schema'
import { hashPassword, randomCode } from '~/utils/crypto'
import { sendVerifyEmailRegister } from '~/utils/email'
import { convertToObjectIdMongodb } from '~/utils/formatter'
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
    const { name, email } = decodedActivationAccount
    const user = await createUser({
      name,
      email,
      password
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

    await client.hmset(user._id.toString(), {
      user: JSON.stringify(user),
      private_key,
      public_key,
      refreshTokenUsed: JSON.stringify([])
    })

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

    await Promise.all([client.del(user_id), client.del('rft_' + user_id)])
    return true
  }

  async refreshToken(user_id: string, refresh_token: string, res: Response) {
    const refreshTokenUsed = JSON.parse((await client.hget(user_id, 'refreshTokenUsed')) as string)
    const isExist = refreshTokenUsed?.includes(refresh_token)

    if (isExist) {
      await Promise.all([client.del(user_id), client.del('rft_' + user_id)])
      throw new ForbiddenError('Something went wrong! Please login again')
    }

    const refreshTokenStore = await client.get('rft_' + user_id)
    if (refreshTokenStore !== refresh_token) {
      throw new AuthFailureError('invalid request')
    }
    const [private_key, public_key] = await client.hmget(user_id, 'private_key', 'public_key')

    const payloadCreateToken = {
      user_id
    }

    const resultCreateToken = await createTokenPair(payloadCreateToken, public_key as string, private_key as string)
    refreshTokenUsed.push(resultCreateToken?.refresh_token)
    await Promise.all([
      client.hset(user_id, 'refreshTokenUsed', JSON.stringify(refreshTokenUsed)),
      client.set('rft_' + user_id, resultCreateToken?.refresh_token as string)
    ])
    const optionCookie = handleOptionCookie()

    res.cookie('access_token', resultCreateToken?.access_token, optionCookie.accessTokenOptions)
    res.cookie('refresh_token', resultCreateToken?.refresh_token, optionCookie.refreshTokenOptions)
    return {
      user_id,
      tokens: resultCreateToken
    }
  }

  async getInfo(user_id: string) {
    const user = await getUserById(user_id)
    return user
  }

  async socialAuth(payload: SocialAuthRequestPayload, res: Response) {
    const { email } = payload
    const user = await findUserByCondition({ email })
    if (!user) {
      const newUser = await createUser(payload)
      return await this.login(newUser, res)
    } else {
      return await this.login(user, res)
    }
  }

  async updateUser(user_id: string, payload: UpdateUserRequestPayload) {
    const updateUser = await userSchema.findOneAndUpdate(
      { _id: convertToObjectIdMongodb(user_id) },
      { $set: payload },
      {
        new: true
      }
    )
    await client.hdel(user_id, 'user')
    return updateUser
  }

  async changePassword(user_id: string, password: string) {
    await userSchema.findOneAndUpdate(
      { _id: convertToObjectIdMongodb(user_id) },
      {
        $set: {
          password: hashPassword(password)
        }
      }
    )
    await client.hdel(user_id, 'user')
    return true
  }

  async updateAvatar(user_id: string, payload: UpdateAvatarRequestBody) {
    await userSchema.findOneAndUpdate(
      { _id: convertToObjectIdMongodb(user_id) },
      {
        $set: {
          avatar: {
            ...payload
          }
        }
      }
    )
    await client.hdel(user_id, 'user')
    return true
  }
}

export default new UserService()
