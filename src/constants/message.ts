export const USER_MESSAGE = {
  EMAIL_IS_IN_VALID: 'email is invalid',
  NAME_MUST_BE_STRING: 'name must be a string',
  NAME_IS_REQUIRED: 'name is required',
  PASSWORD_IS_REQUIRED: 'Password is required',
  PASSWORD_MUST_BE_STRING: 'Password must be string',
  PASSWORD_LENGTH_MUST_BE_FROM_6_TO_50: 'Password length must be between 6 and 50 characters',
  PASSWORD_MUST_BE_STRONG:
    'Password must be must be 6-50 characters long and contain at lest 1 lowercase, 1 uppercase, 1 number, 1 symbol',
  CONFIRM_PASSWORD_IS_REQUIRED: 'Confirm Password is required',
  CONFIRM_PASSWORD_MUST_BE_STRING: 'Confirm Password must be string',
  CONFIRM_PASSWORD_LENGTH_MUST_BE_FROM_6_TO_50: 'Confirm Password length must be between 6 and 50 characters',
  CONFIRM_PASSWORD_MUST_BE_STRONG:
    'Confirm Password must be must be 6-50 characters long and contain at lest 1 lowercase, 1 uppercase, 1 number, 1 symbol',
  CONFIRM_PASSWORD_NOT_MATCHED: 'Confirm password does not match password',
  AVATAR_MUST_BE_STRING: 'Avatar must be a string',
  REGISTER_SUCCESSFUL: 'Register successful',
  ACTIVE_ACCOUNT: 'please check your email to active your account'
} as const
