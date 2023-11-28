export const USER_MESSAGE = {
  EMAIL_OR_PASSWORD: 'Email or password is incorrect',
  EMAIL_IS_INVALID: 'email is invalid',
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
  ACTIVE_ACCOUNT: 'please check your email to active your account',
  LOGOUT_SUCCESSFUL: 'Logout successful',
  LOGIN_SUCCESSFUL: 'Login successful',
  ACCESS_TOKEN_IS_REQUIRED: 'Access token is required',
  REFRESH_TOKEN_IS_REQUIRED: 'Refresh token is required',
  REFRESH_TOKEN_IS_INVALID: 'Refresh token is invalid',
  ACCESS_TOKEN_IS_INVALID: 'Access token is invalid',
  INVALID_REQUEST: 'Invalid request',
  GET_TOKEN_SUCCESS: 'Get token successfully',
  GET_INFO_SUCCESS: 'Get info successfully',
  UPDATE_SUCCESS: 'Update  successfully',
  INCORRECT_CURRENT_PASSWORD: 'Incorrect current password'
} as const

export const COMMON_MESSAGE = {
  UPLOAD_SUCCESS: 'Upload successfully'
} as const

export const COURSE_MESSAGE = {
  UPDATE_COURSE_SUCCESS: 'Update course successfully',
  GET_COURSE_SUCCESS: 'Get Course successfully',
  YOU_ARE_NOT_ELIGIBLE_TO_ACCESS_THIS_COURSE: 'you are not eligible to access this course',
  NOT_FOUND_COURSE: 'Not found Course',
  NOT_FOUND_LESSON: 'Not found lesson',
  YOU_HAVE_ALREADY_PURCHASED: 'You have already purchased this course'
} as const

export const QUESTION_MESSAGE = {
  NOT_FOUND_QUESTION: 'Not found question',
  CREATE_QUESTION_SUCCESS: 'Create question successfully',
  DELETE_QUESTION_SUCCESS: 'Delete question successfully',
  GET_LIST_QUESTION_SUCCESS: 'Get list question successfully'
} as const

export const REVIEW_MESSAGE = {
  NOT_FOUND_REVIEW: 'Not found review',
  CREATE_REVIEW_SUCCESS: 'Create review successfully',
  GET_LIST_REVIEW_SUCCESS: 'Get list review successfully'
} as const

export const ORDER_MESSAGE = {
  CREATE_ORDER_SUCCESS: 'Create order successfully'
} as const

export const NOTIFICATION_MESSAGE = {
  GET_NOTIFICATION_SUCCESS: 'Get notification successfully',
  NOT_FOUND_NOTIFICATION: 'Not found notification'
} as const
