import { HydratedDocument } from 'mongoose'
import { COURSE_MESSAGE, REVIEW_MESSAGE } from '~/constants/message'
import { ForbiddenError, NotFoundError } from '~/core/error.response'
import { getCourseById } from '~/models/repositories/course.repo'
import { CreateReviewRequest, GetListReviewRequest } from '~/models/request/review.request'
import reviewSchema from '~/models/schemas/review.schema'
import { UserDocument } from '~/models/schemas/user.schema'

class ReviewService {
  async createReview(
    user: HydratedDocument<UserDocument>,
    { review_courseId, review_rating, review_content, review_parentId = null }: CreateReviewRequest
  ) {
    const { courses } = user
    const isHasCourse = courses.find((c) => c.toString() === review_courseId)
    if (!isHasCourse) {
      throw new ForbiddenError(COURSE_MESSAGE.YOU_ARE_NOT_ELIGIBLE_TO_ACCESS_THIS_COURSE)
    }
    const courseReview = await getCourseById(review_courseId)
    if (!courseReview) {
      throw new NotFoundError(COURSE_MESSAGE.NOT_FOUND_COURSE)
    }
    if (review_parentId) {
      const reviewParent = await reviewSchema.findById(review_parentId)
      if (!reviewParent) {
        throw new NotFoundError(REVIEW_MESSAGE.NOT_FOUND_REVIEW)
      }
    } else {
      courseReview.number_of_rating = courseReview?.number_of_rating + 1
      courseReview.total_score = courseReview?.total_score + review_rating
      courseReview.ratings = courseReview.total_score / courseReview.number_of_rating
    }
    await courseReview.save()
    //create notification
    return await reviewSchema.create({ review_courseId, review_rating, review_content, review_parentId })
  }

  async getReviewByParentId({ review_courseId, review_parentId = null }: GetListReviewRequest) {
    return await reviewSchema.find({ review_courseId, review_parentId })
  }
}

export default new ReviewService()
