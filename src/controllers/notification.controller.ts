import { Request, Response } from 'express'
import { NOTIFICATION_MESSAGE } from '~/constants/message'
import { Ok } from '~/core/success.response'
import NotificationService from '~/services/notification.service'
class NotificationController {
  getNotifications = async (req: Request, res: Response) => {
    return new Ok({
      message: NOTIFICATION_MESSAGE.GET_NOTIFICATION_SUCCESS,
      metaData: await NotificationService.getNotification()
    }).send(res)
  }
  updateNotification = async (req: Request, res: Response) => {
    const notification_id = req.params.notification_id
    return new Ok({
      message: NOTIFICATION_MESSAGE.GET_NOTIFICATION_SUCCESS,
      metaData: await NotificationService.updateNotification(notification_id)
    }).send(res)
  }
}

export default new NotificationController()
