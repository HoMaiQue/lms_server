import { HydratedDocument } from 'mongoose'
import { COURSE_MESSAGE } from '~/constants/message'
import { ForbiddenError, NotFoundError } from '~/core/error.response'
import { getCourseById } from '~/models/repositories/course.repo'
import { CreateOrderRequest } from '~/models/request/order.request'
import orderSchema from '~/models/schemas/order.schema'
import { UserDocument } from '~/models/schemas/user.schema'
import { sendEmailConfirmOrder } from '~/utils/email'
import { formatDateString } from '~/utils/formatter'
import notificationService from './notification.service'

class OrderService {
  async createOrder(user: HydratedDocument<UserDocument>, { course_id, payment_info }: CreateOrderRequest) {
    const courseExistInUser = user.courses.find((c) => c.toString() === course_id)
    if (courseExistInUser) {
      throw new ForbiddenError(COURSE_MESSAGE.YOU_HAVE_ALREADY_PURCHASED)
    }

    const foundCourse = await getCourseById(course_id)
    if (!foundCourse) {
      throw new NotFoundError(COURSE_MESSAGE.NOT_FOUND_COURSE)
    }

    const order = await orderSchema.create({
      course_id,
      user_id: user._id,
      payment_info
    })

    const dateCreate = formatDateString(new Date(Date.now()))
    const orderInfo = {
      name: user.name,
      order_number: order._id.toString(),
      date: dateCreate,
      course_name: foundCourse.name,
      quantity: 1,
      price: foundCourse.price
    }
    // send email
    await notificationService.createNotification({
      user: user._id,
      title: 'New Order',
      message: `You have a new order from  ${foundCourse.name}`
    })
    await sendEmailConfirmOrder(user.email, orderInfo)

    user.courses.push(foundCourse._id)
    await user.save()

    foundCourse.purchased = foundCourse.purchased! + 1
    await foundCourse.save()

    return order
  }
}

export default new OrderService()
