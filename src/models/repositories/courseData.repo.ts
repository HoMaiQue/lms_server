import courseSchema from '../schemas/course.schema'

export const getCourseDataById = async (courseDataId: string) => {
  return await courseSchema.findById(courseDataId).lean()
}
