import express from 'express'
import courseRouter from './course.routes'
import uploadRouter from './upload.routes'
import userRouter from './user.routes'
import questionRouter from './question.routes'
import reviewRouter from './review.routes'
import orderRouter from './order.routes'
import layoutRouter from './layout.routes'

const router = express.Router()

router.use('/v1/upload', uploadRouter)
router.use('/v1/user', userRouter)
router.use('/v1/question', questionRouter)
router.use('/v1/review', reviewRouter)
router.use('/v1/order', orderRouter)
router.use('/v1/course', courseRouter)
router.use('/v1/layout', layoutRouter)
export default router
