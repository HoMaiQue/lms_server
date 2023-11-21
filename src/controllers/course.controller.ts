import { ParamsDictionary } from 'express-serve-static-core'
import { Request, Response } from 'express'
import { COMMON_MESSAGE, COURSE_MESSAGE } from '~/constants/message'
import { Created, Ok } from '~/core/success.response'
import CourseService from '~/services/course.service'
import { UpdateCourseRequestBody, uploadCourseRequestBody } from '~/models/request/course.request'
// import { uploadCourseRequestBody } from '~/models/request/course.request'
class CourseController {
  uploadCourse = async (req: Request<ParamsDictionary, any, uploadCourseRequestBody>, res: Response) => {
    return new Created({
      message: COMMON_MESSAGE.UPLOAD_SUCCESS,
      metaData: await CourseService.uploadCourse(req.body)
    }).send(res)
  }

  updateCourse = async (req: Request<ParamsDictionary, any, UpdateCourseRequestBody>, res: Response) => {
    const course_id = req.params.course_id
    return new Ok({
      message: COURSE_MESSAGE.UPDATE_COURSE_SUCCESS,
      metaData: await CourseService.updateCourse(course_id, req.body)
    }).send(res)
  }
  getSingleCourse = async (req: Request, res: Response) => {
    const course_id = req.params.course_id
    return new Ok({
      message: COURSE_MESSAGE.GET_COURSE_SUCCESS,
      metaData: await CourseService.getSingleCourse(course_id)
    }).send(res)
  }
  getAllCourse = async (req: Request, res: Response) => {
    return new Ok({
      message: COURSE_MESSAGE.GET_COURSE_SUCCESS,
      metaData: await CourseService.getAllCourse()
    }).send(res)
  }
}
export default new CourseController()
