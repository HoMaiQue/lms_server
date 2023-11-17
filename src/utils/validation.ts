import express from 'express'
import { ValidationChain, validationResult } from 'express-validator'
import { RunnableValidationChains } from 'express-validator/src/middlewares/schema'
import { StatusCode } from '~/constants/statusCode'
import { ErrorResponse, UnprocessableEntityError } from '~/core/error.response'
// can be reused by many routes

// sequential processing, stops running validations chain if the previous one fails.
export const validate = (validations: RunnableValidationChains<ValidationChain>) => {
  return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    await validations.run(req)

    const errors = validationResult(req)
    if (errors.isEmpty()) {
      return next()
    }

    const errorObject = errors.mapped()
    console.log('error object:::', errorObject)
    const entityError = new UnprocessableEntityError({ errors: {} })

    for (const key in errorObject) {
      const { msg } = errorObject[key]
      if (msg instanceof ErrorResponse && msg.status !== StatusCode.UNPROCESSABLE_ENTITY) {
        return next(msg)
      }
      entityError.errors[key] = errorObject[key]
    }

    next(entityError)
  }
}
