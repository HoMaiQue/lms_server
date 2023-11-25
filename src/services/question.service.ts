import { COURSE_MESSAGE, QUESTION_MESSAGE } from '~/constants/message'
import { NotFoundError } from '~/core/error.response'
import { getCourseDataById } from '~/models/repositories/courseData.repo'
import { getQuestionById } from '~/models/repositories/question.repo'
import { CreateQuestionRequest } from '~/models/request/question.request'
import questionSchema from '~/models/schemas/question.schema'
import { convertToObjectIdMongodb } from '~/utils/formatter'

class QuestionService {
  static async createQuestion({ lessonId, userId, content, parentQuestionId = null }: CreateQuestionRequest) {
    const foundLesson = await getCourseDataById(lessonId)
    if (!foundLesson) {
      throw new NotFoundError(COURSE_MESSAGE.NOT_FOUND_LESSON)
    }
    const question = new questionSchema({
      question_lessonId: lessonId,
      question_content: content,
      question_userId: userId,
      question_parentId: parentQuestionId
    })

    let rightValue
    if (parentQuestionId) {
      const parentQuestion = await getQuestionById(parentQuestionId)
      if (!parentQuestion) throw new NotFoundError(QUESTION_MESSAGE.NOT_FOUND_QUESTION)

      rightValue = parentQuestion.question_right

      await this.incrementQuestionValues(lessonId, rightValue, 2)
    } else {
      const maxRightValue = await questionSchema.findOne(
        {
          question_lessonId: convertToObjectIdMongodb(lessonId)
        },
        'question_right',
        { sort: { question_right: -1 } }
      )
      const maxRightValue12 = await questionSchema.findOne(
        {
          question_lessonId: convertToObjectIdMongodb(lessonId)
        },
        'question_right',
        { sort: { question_right: -1 } }
      )
      console.log(maxRightValue12)
      if (maxRightValue) {
        rightValue = maxRightValue.question_right + 1
      } else {
        rightValue = 1
      }
    }
    question.question_left = rightValue
    question.question_right = rightValue + 1
    await question.save()
    return question
  }
  static async getQuestionsByParentId({
    lessonId,
    parentQuestionId = null,
    limit = 50,
    offset = 0
  }: {
    lessonId: string
    parentQuestionId: string | null
    limit: number
    offset: number
  }) {
    let query
    if (parentQuestionId) {
      const parent = await getQuestionById(parentQuestionId)
      if (!parent) {
        throw new NotFoundError(QUESTION_MESSAGE.NOT_FOUND_QUESTION)
      }
      query = {
        question_lessonId: convertToObjectIdMongodb(lessonId),
        question_left: { $gt: parent.question_left },
        question_right: { $lte: parent.question_right }
      }
    } else {
      query = {
        question_lessonId: convertToObjectIdMongodb(lessonId),
        question_parentId: parentQuestionId
      }
    }
    const questions = await questionSchema
      .find(query)
      .select({
        question_left: 1,
        question_right: 1,
        question_content: 1,
        question_parentId: 1
      })
      .sort({
        question_left: 1
      })
    return questions
  }
  static async deleteQuestion({ lessonId, questionId }: { lessonId: string; questionId: string }) {
    const foundLesson = await getCourseDataById(lessonId)
    if (!foundLesson) throw new NotFoundError(COURSE_MESSAGE.NOT_FOUND_LESSON)

    const question = await getQuestionById(questionId)
    if (!question) {
      throw new NotFoundError(QUESTION_MESSAGE.NOT_FOUND_QUESTION)
    }
    const leftValue = question?.question_left
    const rightValue = question?.question_right

    const width = rightValue - leftValue + 1

    await questionSchema.deleteMany({
      comment_productId: convertToObjectIdMongodb(lessonId),
      comment_left: { $gte: leftValue, $lte: rightValue }
    })

    await this.decrementQuestionValues(lessonId, rightValue, width)

    return true
  }

  static async incrementQuestionValues(lessonId: string, startValue: number, amount: number) {
    await questionSchema.updateMany(
      {
        question_lessonId: convertToObjectIdMongodb(lessonId),
        question_right: { $gte: startValue }
      },
      { $inc: { question_right: amount } }
    )

    await questionSchema.updateMany(
      {
        question_lessonId: convertToObjectIdMongodb(lessonId),
        question_left: { $gt: startValue }
      },
      { $inc: { question_left: amount } }
    )
  }

  static async decrementQuestionValues(lessonId: string, startValue: number, amount: number) {
    await questionSchema.updateMany(
      {
        question_lessonId: convertToObjectIdMongodb(lessonId),
        question_right: { $gt: startValue }
      },
      { $inc: { question_right: -amount } }
    )

    await questionSchema.updateMany(
      {
        question_lessonId: convertToObjectIdMongodb(lessonId),
        question_left: { $gt: startValue }
      },
      { $inc: { question_left: -amount } }
    )
  }
}
export default QuestionService

/**
 *              comment
 *          cmt 1.1      cmt1.2
 *      cmt 1.1.1          cmt 1.1.2
 *
 */
