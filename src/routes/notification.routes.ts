import { Router } from 'express'
import { accessTokenValidator, authorizeRoles } from '~/middleware/user.middleware'
import NotificationController from '~/controllers/notification.controller'
import asyncHandler from '~/helpers/asyncHandler'
const notificationRouter = Router()

notificationRouter.use(accessTokenValidator)
notificationRouter.get('', authorizeRoles('admin'), asyncHandler(NotificationController.getNotifications))
notificationRouter.post(
  '/:notification_id',
  authorizeRoles('admin'),
  asyncHandler(NotificationController.updateNotification)
)
// orderRouter.get('', asyncHandler(ReviewController.getListReview))

export default notificationRouter
