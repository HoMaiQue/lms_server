import { Router } from 'express'
import CourseController from '~/controllers/course.controller'
import asyncHandler from '~/helpers/asyncHandler'
import { filterMiddleware } from '~/middleware/common.middleware'
import { accessTokenValidator, authorizeRoles } from '~/middleware/user.middleware'

const courseRouter = Router()
courseRouter.get('/:course_id', asyncHandler(CourseController.getSingleCourse))
courseRouter.get('', asyncHandler(CourseController.getAllCourse))

courseRouter.use(accessTokenValidator)
courseRouter.post('', authorizeRoles('admin'), asyncHandler(CourseController.uploadCourse))
courseRouter.get('/all', authorizeRoles('admin'), asyncHandler(CourseController.getAllCourseByAdmin))
courseRouter.get('/course-content/:course_id', asyncHandler(CourseController.getCourseByUser))
courseRouter.delete('/:course_id', asyncHandler(CourseController.deleteCourse))
courseRouter.patch(
  '/:course_id',
  filterMiddleware([
    'name',
    'description',
    'price',
    'estimatePrice',
    'thumbnail',
    'tags',
    'level',
    'demoUrl',
    'benefits',
    'prerequisites',
    'reviews',
    'courseData',
    'ratings',
    'purchased'
  ]),
  authorizeRoles('admin'),
  asyncHandler(CourseController.updateCourse)
)

export default courseRouter
