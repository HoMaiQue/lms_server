import { NextFunction, Request, Response } from 'express'
import { pick } from 'lodash'
type FilterTypes<T> = Array<keyof T>
export const filterMiddleware =
  <T>(filterKeys: FilterTypes<T>) =>
  (req: Request, res: Response, next: NextFunction) => {
    req.body = pick(req.body, filterKeys)
    console.log('this is req body after pass filter middleware:::', req.body)

    next()
  }
