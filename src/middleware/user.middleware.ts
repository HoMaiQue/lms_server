import { ParamSchema, checkSchema } from 'express-validator'
import { USER_MESSAGE } from '~/constants/message'
import { findEmail } from '~/models/repositories/user.repo'
import { validate } from '~/utils/validation'
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
        isEmail: { errorMessage: USER_MESSAGE.EMAIL_IS_IN_VALID },
        trim: true,
        custom: {
          options: async (value) => {
            const foundEmail = await findEmail(value)
            if (!foundEmail) {
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
