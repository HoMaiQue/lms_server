import express from 'express'
import courseRouter from './course.routes'
import uploadRouter from './upload.routes'
import userRouter from './user.routes'

const router = express.Router()

router.use('/v1/upload', uploadRouter)
router.use('/v1/user', userRouter)
router.use('/v1/course', courseRouter)
export default router
