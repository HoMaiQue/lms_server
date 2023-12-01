import courseDataSchema from '../schemas/courseData.schema'

export const getCourseDataById = async (courseDataId: string) => {
  return await courseDataSchema.findById(courseDataId).lean()
}
