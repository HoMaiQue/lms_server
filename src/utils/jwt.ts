import jwt from 'jsonwebtoken'
import { TokenType, UserVerifyStatus } from '~/constants/enum'

import { ActivationTokenPayload, TokenPayload } from '~/models/request/user.request'

interface TokenPayloadType {
  payload: string | Buffer | object
  key: string
  options?: jwt.SignOptions
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
export const createTokenPair = async (payload: string | Buffer | object, publicKey: string, privateKey: string) => {
  try {
    const [access_token, refresh_token] = await Promise.all([
      signToken({
        payload: { ...(payload as object), tokenType: TokenType.AccessToken },
        key: publicKey,
        options: {
          expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN
        }
      }),
      signToken({
        payload: { ...(payload as object), tokenType: TokenType.RefreshToken },
        key: privateKey,
        options: {
          expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN
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
