import { NextFunction, Request, Response } from 'express'
import { COMMON_MESSAGE } from '~/constants/message'
import { BadRequestError } from '~/core/error.response'
import { Ok } from '~/core/success.response'
import UploadService from '~/services/upload.service'
class UploadController {
  async uploadImageFromUrl(req: Request, res: Response, next: NextFunction) {
    return new Ok({
      message: COMMON_MESSAGE.UPLOAD_SUCCESS,
      metaData: await UploadService.uploadImageFromUrl()
    }).send(res)
  }
  async uploadImageFromLocal(req: Request, res: Response, next: NextFunction) {
    const { file } = req
    return new Ok({
      message: COMMON_MESSAGE.UPLOAD_SUCCESS,
      metaData: await UploadService.uploadImageLocal({ path: (file as Express.Multer.File).path })
    }).send(res)
  }
  async uploadImageFromLocalFiles(req: Request, res: Response, next: NextFunction) {
    const { files } = req
    if (!files?.length) {
      throw new BadRequestError('file is required')
    }
    return new Ok({
      message: COMMON_MESSAGE.UPLOAD_SUCCESS,
      metaData: await UploadService.uploadImageFromLocalFiles({ files: files as Express.Multer.File[] })
    }).send(res)
  }
  async uploadImageFromLocalS3(req: Request, res: Response, next: NextFunction) {
    const { file } = req
    if (!file) {
      throw new BadRequestError('file is required')
    }
    return new Ok({
      message: COMMON_MESSAGE.UPLOAD_SUCCESS,
      metaData: await UploadService.uploadImageFromLocalS3({ file })
    }).send(res)
  }
}

export default new UploadController()
