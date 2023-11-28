import { ObjectId } from 'mongoose'
import { NOTIFICATION_MESSAGE } from '~/constants/message'
import { NotFoundError } from '~/core/error.response'
import { getNotification } from '~/models/repositories/notification.repo'
import notificationSchema from '~/models/schemas/notification.schema'
import cron from 'node-cron'
class NotificationService {
  async getNotification() {
    return await getNotification()
  }
  async createNotification({ user, title, message }: { user: ObjectId | string; title: string; message: string }) {
    return await notificationSchema.create({ user, title, message })
  }

  async updateNotification(notification_id: string) {
    const foundNotification = await notificationSchema.findById(notification_id)
    if (!foundNotification) {
      throw new NotFoundError(NOTIFICATION_MESSAGE.NOT_FOUND_NOTIFICATION)
    }
    foundNotification.status = 'read'
    foundNotification.save()
    return await getNotification()
  }
}
export default new NotificationService()

//delete notification
cron.schedule('0 0 0 * * *', async () => {
  const thirtyDayAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  await notificationSchema.deleteMany({ status: 'read', createdAt: { $lt: thirtyDayAgo } })
})
