import { ReasonStatusCode } from '~/constants/reasonphrase'
import { StatusCode } from '~/constants/statusCode'

export class ErrorResponseCustom {
  status: number
  message: string
  constructor(message: string, status: number) {
    this.message = message
    this.status = status
  }
}

export class ErrorResponse extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}
export class ConflictRequestError extends ErrorResponse {
  constructor(message = ReasonStatusCode.CONFLICT, statusCode = StatusCode.CONFLICT) {
    super(message, statusCode)
  }
}
export class BadRequestError extends ErrorResponse {
  constructor(message = ReasonStatusCode.FORBIDDEN, statusCode = StatusCode.FORBIDDEN) {
    super(message, statusCode)
  }
}

export class AuthFailureError extends ErrorResponse {
  constructor(message = ReasonStatusCode.UNAUTHORIZED, statusCode = StatusCode.UNAUTHORIZED) {
    super(message, statusCode)
  }
}

export class NotFoundError extends ErrorResponse {
  constructor(message = ReasonStatusCode.NOT_FOUND, statusCode = StatusCode.NOT_FOUND) {
    super(message, statusCode)
  }
}

export class ForbiddenError extends ErrorResponse {
  constructor(message = ReasonStatusCode.FORBIDDEN, statusCode = StatusCode.FORBIDDEN) {
    super(message, statusCode)
  }
}

type ErrorsType = Record<string, { msg: string; [key: string]: any }>
export class UnprocessableEntityError extends ErrorResponseCustom {
  errors: ErrorsType
  constructor({
    message = ReasonStatusCode.UNPROCESSABLE_ENTITY,
    statusCode = StatusCode.UNPROCESSABLE_ENTITY,
    errors
  }: {
    message?: string
    statusCode?: number
    errors: ErrorsType
  }) {
    super(message, statusCode)
    this.errors = errors as ErrorsType
  }
}
