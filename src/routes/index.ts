import express from 'express'
import userRouter from './user.routes'
import uploadRouter from './upload.routes'

const router = express.Router()

router.use('/v1/upload', uploadRouter)
router.use('/v1/user', userRouter)
export default router
