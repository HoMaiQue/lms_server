import courseSchema from '../schemas/course.schema'

export const getCourseById = async (course_id: string, select: Record<string, number> = {}, populate: string = '') => {
  if (populate) {
    return await courseSchema.findById(course_id).populate(populate).select(select).lean()
  }
  return await courseSchema.findById(course_id).select(select).lean()
}
