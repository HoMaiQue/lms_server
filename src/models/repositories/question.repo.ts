import questionSchema from '../schemas/question.schema'

export const getQuestionById = async (question_id: string) => {
  return await questionSchema.findById(question_id).lean()
}
