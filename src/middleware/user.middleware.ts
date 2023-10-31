import { NextFunction, Request, Response } from 'express'
import { ParamSchema, checkSchema } from 'express-validator'
import { JsonWebTokenError } from 'jsonwebtoken'
import { capitalize } from 'lodash'
import { USER_MESSAGE } from '~/constants/message'
import { AuthFailureError, ForbiddenError, NotFoundError } from '~/core/error.response'
import client from '~/dbs/init.redis'
import { findUserByCondition } from '~/models/repositories/user.repo'
import { hashPassword } from '~/utils/crypto'
import { verifyJWT } from '~/utils/jwt'
import { validate } from '~/utils/validation'
const HEADER = {
  API_KEY: 'x-api-key',
  CLIENT_ID: 'x-client-id',
  AUTHORIZATION: 'authorization',
  REFRESH_TOKEN: 'x-rtoken-id'
}
const passwordSchema: ParamSchema = {
  isString: { errorMessage: USER_MESSAGE.PASSWORD_MUST_BE_STRING },
  notEmpty: { errorMessage: USER_MESSAGE.PASSWORD_IS_REQUIRED },
  isLength: {
    errorMessage: USER_MESSAGE.PASSWORD_LENGTH_MUST_BE_FROM_6_TO_50,
    options: {
      min: 6,
      max: 100
    }
  },
  isStrongPassword: {
    errorMessage: USER_MESSAGE.PASSWORD_MUST_BE_STRONG,
    options: {
      minLength: 6,
      minLowercase: 1,
      minUppercase: 1,
      minSymbols: 1
    }
  }
}
const confirmPasswordSchema: ParamSchema = {
  isString: { errorMessage: USER_MESSAGE.CONFIRM_PASSWORD_MUST_BE_STRING },
  notEmpty: { errorMessage: USER_MESSAGE.CONFIRM_PASSWORD_IS_REQUIRED },
  isLength: {
    errorMessage: USER_MESSAGE.CONFIRM_PASSWORD_LENGTH_MUST_BE_FROM_6_TO_50,
    options: {
      min: 6,
      max: 100
    }
  },
  isStrongPassword: {
    options: {
      minLength: 6,
      minLowercase: 1,
      minUppercase: 1,
      minSymbols: 1
    },
    errorMessage: USER_MESSAGE.CONFIRM_PASSWORD_MUST_BE_STRONG
  },
  custom: {
    options: (value, { req }) => {
      if (value !== req.body.password) {
        throw new Error(USER_MESSAGE.CONFIRM_PASSWORD_NOT_MATCHED)
      }
      return true
    }
  }
}
export const registerValidator = validate(
  checkSchema(
    {
      email: {
        isEmail: { errorMessage: USER_MESSAGE.EMAIL_IS_INVALID },
        trim: true,
        custom: {
          options: async (value) => {
            const foundEmail = await findUserByCondition({ email: value })
            if (foundEmail) {
              throw new Error('Email already exists')
            }
          }
        }
      },
      name: {
        isString: { errorMessage: USER_MESSAGE.NAME_MUST_BE_STRING },
        notEmpty: { errorMessage: USER_MESSAGE.NAME_IS_REQUIRED },
        trim: true
      },
      password: passwordSchema,
      confirmPassword: confirmPasswordSchema,
      avatar: {
        optional: true,
        isString: { errorMessage: USER_MESSAGE.AVATAR_MUST_BE_STRING },
        trim: true
      }
    },
    ['body']
  )
)

export const loginValidator = validate(
  checkSchema({
    email: {
      isEmail: { errorMessage: USER_MESSAGE.EMAIL_IS_INVALID },
      trim: true,
      custom: {
        options: async (value, { req }) => {
          const user = await findUserByCondition({
            email: value,
            password: hashPassword(req.body.password)
          })
          if (!user) {
            throw new Error(USER_MESSAGE.EMAIL_OR_PASSWORD)
          }
          req.user = user
          return true
        }
      }
    },
    password: passwordSchema
  })
)

export const accessTokenValidator = validate(
  checkSchema(
    {
      Authorization: {
        trim: true,
        custom: {
          options: async (value: string, { req }) => {
            try {
              if (!value) {
                throw new AuthFailureError(USER_MESSAGE.ACCESS_TOKEN_IS_REQUIRED)
              }
              const user_id = (req as any).headers[HEADER.CLIENT_ID]
              const user = await client.get(user_id)
              const public_key = await client.get('puk_' + user_id)

              if (!user) {
                throw new NotFoundError(USER_MESSAGE.INVALID_REQUEST)
              }
              const access_token = value.split(' ')[1]
              if (!access_token) {
                throw new AuthFailureError(USER_MESSAGE.ACCESS_TOKEN_IS_INVALID)
              }
              const decoded_authorization = await verifyJWT({ token: access_token, keySecret: public_key as string })
              ;(req as Request).decoded_authorization = decoded_authorization
              return true
            } catch (error) {
              throw new AuthFailureError(capitalize((error as JsonWebTokenError).message))
            }
          }
        }
      }
    },
    ['headers']
  )
)

export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user
    if (!roles.includes(user?.role as string)) {
      throw new ForbiddenError('Access denied')
    }
    return next()
  }
}
