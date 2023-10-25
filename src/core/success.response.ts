import { Response } from 'express'

interface SuccessResponseOptions {
  message?: string
  statusCode?: string
  reasonStatusCode?: string
  metaData?: Record<string, any> | any
}

const StatusCode = {
  OK: '200',
  CREATED: '201'
}

const ReasonStatusCode = {
  OK: 'Success',
  CREATED: 'Created'
}

class SuccessResponse {
  message: string
  status: string
  metaData: Record<string, any>

  constructor({
    message,
    statusCode = StatusCode.OK,
    reasonStatusCode = ReasonStatusCode.OK,
    metaData = {}
  }: SuccessResponseOptions) {
    this.message = !message ? reasonStatusCode : message
    this.status = statusCode
    this.metaData = metaData
  }

  send(res: Response, headers: Record<string, any> = {}): void {
    res.status(parseInt(this.status)).json(this)
  }
}

class Ok extends SuccessResponse {
  constructor({ message, metaData }: SuccessResponseOptions) {
    super({ message, metaData })
  }
}

interface CreatedOptions extends SuccessResponseOptions {
  options?: any
}

class Created extends SuccessResponse {
  options: any

  constructor({
    message,
    statusCode = StatusCode.CREATED,
    reasonStatusCode = ReasonStatusCode.CREATED,
    metaData,
    options
  }: CreatedOptions) {
    super({ message, statusCode, reasonStatusCode, metaData })
    this.options = options
  }
}

export { Ok, Created, SuccessResponse }
