import multer from 'multer'
import { UPLOAD_IMAGE_TEMP_DIR, UPLOAD_VIDEO_TEMP_DIR } from '~/constants/dir'
import fs from 'fs'
import { UnprocessableEntityError } from '~/core/error.response'

export const initFolder = () => {
  ;[UPLOAD_IMAGE_TEMP_DIR, UPLOAD_VIDEO_TEMP_DIR].forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, {
        recursive: true // tao folder nested
      })
    }
  })
}
export const uploadMemory = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype.includes('image/')) {
      cb(null, true)
    } else {
      return cb(
        new UnprocessableEntityError({
          errors: {
            image: {
              msg: 'file type is not valid'
            }
          }
        }) as any
      )
    }
  }
})

export const uploadDisk = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, UPLOAD_IMAGE_TEMP_DIR)
    },
    filename: function (req, file, cb) {
      cb(null, `${Date.now()}-${file.originalname}`)
    },
   
  }),
  fileFilter: (req, file, cb) => {
    console.log(123)
    if (file.mimetype.includes('image/')) {
      cb(null, true)
    } else {
      return cb(
        new UnprocessableEntityError({
          errors: {
            image: {
              msg: 'file type is not valid'
            }
          }
        }) as any
      )
    }
  }
})
