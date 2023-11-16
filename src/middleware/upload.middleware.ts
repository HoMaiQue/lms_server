import { NextFunction, Request, Response } from 'express'
import multer from 'multer'
import { UnprocessableEntityError } from '~/core/error.response'

export const uploadSingleImage = (error: any, req: Request, res: Response, next: NextFunction) => {
  if (error instanceof multer.MulterError) {
    if (error.message === 'Unexpected field') {
      throw new UnprocessableEntityError({
        errors: {
          image: {
            msg: 'file is required'
          }
        }
      })
    }
  }
}
