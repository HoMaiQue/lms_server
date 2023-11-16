import compression from 'compression'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import express, { NextFunction, Request, Response } from 'express'
import { default as helmet } from 'helmet'
import morgan from 'morgan'
import cors from 'cors'
import instanceMongoDB from '~/dbs/init.mongodb'
import router from './routes'
import { initFolder } from './configs/multer.config'
// import client from './dbs/init.redis'
// import { initFolder } from './utils/file'
// import '~/utils/s3'
// import router from
dotenv.config()
const app = express()
initFolder()
// init middleware
app.use(morgan('dev'))
app.use(helmet())
app.use(compression())
// app.use('static', express.static(UPLOAD_IMAGE_DIR))
// express version 4  ho tro ue code nen khong can body parse
app.use(express.json({ limit: '50mb' }))
app.use(
  express.urlencoded({
    extended: true
  })
)
app.use(cookieParser())
app.use(
  cors({
    origin: process.env.ORIGIN
  })
)
// init db
instanceMongoDB
// client

//init router
app.use('/', router)

// handle errors
app.use((reg, res, next) => {
  const error: any = new Error('Not Found')
  error.status = 404
  next(error)
})

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = error.status || 500
  return res.status(statusCode).json({
    stack: error.stack,
    message: error.message || 'Internal Server Error',
    ...error
  })
})
export default app
