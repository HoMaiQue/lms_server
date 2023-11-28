import notificationSchema from '../schemas/notification.schema'

export const getNotification = async () => {
  return await notificationSchema.find().sort({ createdAt: -1 })
}
