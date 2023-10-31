import jwt from 'jsonwebtoken'
import { TokenType } from '~/constants/enum'
import client from '~/dbs/init.redis'

import { ActivationTokenPayload, TokenPayload } from '~/models/request/user.request'

interface TokenPayloadType {
  payload: TokenPayload | ActivationTokenPayload
  key: string
  options?: jwt.SignOptions
}
interface OptionCookieType {
  expires: Date
  maxAge: number
  httpOnly: boolean
  sameSite: boolean
  secure?: true
}
export const signToken = ({ payload, key, options = { algorithm: 'HS256' } }: TokenPayloadType) => {
  return new Promise<string>((resolve, reject) => {
    jwt.sign(payload, key, options, (error, token) => {
      if (error) {
        throw reject(error)
      }
      resolve(token as string)
    })
  })
}
export const signRefreshToken = ({ payload, key, options = { algorithm: 'HS256' } }: TokenPayloadType) => {
  return new Promise<string>((resolve, reject) => {
    jwt.sign(payload, key, options, (error, token) => {
      if (error) {
        throw reject(error)
      }
      client.set(payload.user_id, token as string, 'EX', 100 * 24 * 60 * 60)
      resolve(token as string)
    })
  })
}
export const verifyJWT = async ({ token, keySecret }: { token: string; keySecret: string }) => {
  return new Promise<TokenPayload | ActivationTokenPayload>((resolve, reject) => {
    jwt.verify(token, keySecret, (error, decoded) => {
      if (error) {
        throw reject(error)
      }
      resolve(decoded as TokenPayload)
    })
  })
}
export const createTokenPair = async (payload: TokenPayload, publicKey: string, privateKey: string) => {
  try {
    const [access_token, refresh_token] = await Promise.all([
      signToken({
        payload: { ...payload, tokenType: TokenType.AccessToken },
        key: publicKey,
        options: {
          expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
          algorithm: 'HS256'
        }
      }),
      signToken({
        payload: { ...payload, tokenType: TokenType.RefreshToken },
        key: privateKey,
        options: {
          expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
          algorithm: 'HS256'
        }
      })
    ])

    return { access_token, refresh_token }
  } catch (error) {
    console.log(error)
    // return error
  }
}

export const signEmailVerifyActivationCode = (payload: ActivationTokenPayload) => {
  return signToken({
    payload: {
      ...payload,
      tokenType: TokenType.ActivationCode
    },
    key: process.env.ACTIVATION_SECRET as string,
    options: {
      expiresIn: process.env.EMAIL_VERIFY_TOKEN_EXPIRES_IN
    }
  })
}

export const handleOptionCookie = () => {
  const accessTokenExpire = 15 * 60 * 60
  const refreshTokenExpire = 100 * 24 * 60 * 60

  const accessTokenOptions: OptionCookieType = {
    expires: new Date(Date.now() + accessTokenExpire),
    maxAge: accessTokenExpire,
    httpOnly: true,
    sameSite: true
  }
  const refreshTokenOptions: OptionCookieType = {
    expires: new Date(Date.now() + refreshTokenExpire),
    maxAge: refreshTokenExpire,
    httpOnly: true,
    sameSite: true
  }
  if (process.env.NODE_ENV === 'production') {
    accessTokenOptions.secure = true
  }
  return {
    accessTokenOptions,
    refreshTokenOptions
  }
}
