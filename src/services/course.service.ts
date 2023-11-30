import { HydratedDocument, ObjectId } from 'mongoose'
import { COURSE_MESSAGE } from '~/constants/message'
import { ForbiddenError, NotFoundError } from '~/core/error.response'
import client from '~/dbs/init.redis'
import { getCourseById } from '~/models/repositories/course.repo'
import { QueryRequest } from '~/models/request/common.request'
import { uploadCourseRequestBody } from '~/models/request/course.request'
import courseSchema from '~/models/schemas/course.schema'
import courseDataSchema from '~/models/schemas/courseData.schema'
import { UserDocument } from '~/models/schemas/user.schema'
import { convertToObjectIdMongodb, unGetSelectData } from '~/utils/formatter'

class CourseService {
  async uploadCourse(payload: uploadCourseRequestBody) {
    const { courseData } = payload
    const idCourseDataList: ObjectId[] = []

    for (const lesson of courseData) {
      const createLesson = await courseDataSchema.create(lesson)
      idCourseDataList.push(createLesson._id)
    }
    return await courseSchema.create({ ...payload, courseData: idCourseDataList })
  }

  async updateCourse(course_id: string, payload: uploadCourseRequestBody) {
    return await courseSchema.findOneAndUpdate(
      { _id: convertToObjectIdMongodb(course_id) },
      { $set: payload },
      { new: true }
    )
  }

  async getSingleCourse(course_id: string) {
    const isCacheExist = (await client.get(course_id)) as string

    if (!isCacheExist) {
      const course = await getCourseById(course_id, unGetSelectData(['_v', 'courseData']))
      if (!course) {
        throw new NotFoundError(COURSE_MESSAGE.NOT_FOUND_COURSE)
      }
      await client.set(course_id, JSON.stringify(course))
      return course
    }
    return JSON.parse(isCacheExist)
  }
  async getAllCourse() {
    const isCacheExist = await client.get('allCourse')
    if (!isCacheExist) {
      const allCourse = await courseSchema
        .find()
        .select(unGetSelectData(['_v', 'courseData']))
        .lean()
      await client.set('allCourse', JSON.stringify(allCourse))
      return allCourse
    }
    return JSON.parse(isCacheExist)
  }

  async getCourseByUser(course_id: string, user: HydratedDocument<UserDocument>) {
    const isCourseExist = user.courses.find((id) => id.toString() === course_id)
    if (!isCourseExist) {
      throw new ForbiddenError(COURSE_MESSAGE.YOU_ARE_NOT_ELIGIBLE_TO_ACCESS_THIS_COURSE)
    }

    const course = await getCourseById(course_id, {}, 'courseData')
    if (!course) {
      throw new NotFoundError(COURSE_MESSAGE.NOT_FOUND_COURSE)
    }
    return course.courseData
  }

  async getAllCourseByAdmin({ page = '1', limit = '50' }: QueryRequest) {
    const skip = (+page - 1) * +limit
    return await courseSchema.find().sort({ createdAt: -1 }).skip(skip).limit(+limit)
  }

  async deleteCourse(course_id: string) {
    const foundCourse = await getCourseById(course_id)
    if (!foundCourse) {
      throw new NotFoundError(COURSE_MESSAGE.NOT_FOUND_COURSE)
    }
    await courseSchema.deleteOne({ _id: convertToObjectIdMongodb(course_id) })
    await client.del("allCourse")
    return true
  }
}
export default new CourseService()
