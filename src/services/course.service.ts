import courseSchema from '~/models/schemas/course.schema'
import { convertToObjectIdMongodb } from '~/utils/formatter'

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
}
export default new CourseService()
