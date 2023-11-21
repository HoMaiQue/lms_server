import client from '~/dbs/init.redis'
import courseSchema from '~/models/schemas/course.schema'
import { convertToObjectIdMongodb, unGetSelectData } from '~/utils/formatter'

class CourseService {
  async uploadCourse(payload: any) {
    return await courseSchema.create(payload)
  }

  async updateCourse(course_id: string, payload: any) {
    return await courseSchema.findOneAndUpdate(
      { _id: convertToObjectIdMongodb(course_id) },
      { $set: payload },
      { new: true }
    )
  }

  async getSingleCourse(course_id: string) {
    const isCacheExist = (await client.get(course_id)) as string
    if (!isCacheExist) {
      const course = await courseSchema
        .findById(course_id)
        .select(
          unGetSelectData([
            '_v',
            'courseData.videoUrl',
            'courseData.suggestion',
            'courseData.questions',
            'courseData.links'
          ])
        )
        .lean()

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
        .select(
          unGetSelectData([
            '_v',
            'courseData.videoUrl',
            'courseData.suggestion',
            'courseData.questions',
            'courseData.links'
          ])
        )
        .lean()
      await client.set('allCourse', JSON.stringify(allCourse))
      return allCourse
    }
    return JSON.parse(isCacheExist)
  }
}
export default new CourseService()
