import { Router } from 'express'
import { uploadDisk, uploadMemory } from '~/configs/multer.config'
import UploadController from '~/controllers/upload.controller'
import asyncHandler from '~/helpers/asyncHandler'
import { uploadSingleImage } from '~/middleware/upload.middleware'

const uploadRouter = Router()

uploadRouter.post('/url-image', asyncHandler(UploadController.uploadImageFromUrl))

uploadRouter.post(
  '/thumb',
  uploadDisk.single('file'),
  uploadSingleImage,
  asyncHandler(UploadController.uploadImageFromLocal)
)

uploadRouter.post(
  '/multiple-thumb',
  uploadDisk.array('files', 3),
  asyncHandler(UploadController.uploadImageFromLocalFiles)
)
uploadRouter.post('/image', uploadMemory.single('file'), asyncHandler(UploadController.uploadImageFromLocalS3))

export default uploadRouter
