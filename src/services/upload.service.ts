import cloudinary from '~/configs/cloudinary.config'
import { s3, PutObjectCommand, GetObjectCommand } from '~/configs/s3.config'
import crypto from 'node:crypto'
import fsPromise from 'fs/promises'
// import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { getSignedUrl } from '@aws-sdk/cloudfront-signer'
const randomName = () => crypto.randomBytes(16).toString('hex')

const urlImagePublic = 'https://d32rbcw26z5722.cloudfront.net'
class UploadService {
  async uploadImageFromUrl() {
    try {
      const urlImage = ''
      const folderName = '/product/'
      const fileName = 'testDemo'

      return await cloudinary.uploader.upload(urlImage, {
        public_id: fileName,
        folder_name: folderName
      })
    } catch (error) {
      console.log('Error upload image from url')
    }
  }

  async uploadImageLocal({ path, folderName = 'lms/avatars' }: { path: string; folderName?: string }) {
    try {
      const result = await cloudinary.uploader.upload(path, {
        folder: folderName,
        width: 150
      })
      await fsPromise.unlink(path)
      return {
        image_url: result.secure_url,
        public_id: result.public_id,
        thumb_url: await cloudinary.url(result.public_id, {
          height: 200,
          width: 200,
          format: 'jpg'
        })
      }
    } catch (error) {
      console.error('Error uploading image from local', error)
    }
  }

  async uploadImageFromLocalFiles({
    files,
    folderName = 'lms'
  }: {
    files: Express.Multer.File[]
    folderName?: string
  }) {
    try {
      if (!files.length) return
      const uploadedUrl = []
      // toi ui dung promise.....
      for (const file of files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: folderName
        })
        uploadedUrl.push({
          image_url: result.secure_url,
          thumb_url: await cloudinary.url(result.public_id, {
            height: 100,
            width: 100,
            format: 'jpg'
          })
        })
      }
      return uploadedUrl
    } catch (error) {
      console.error('Error uploading image from local files', error)
    }
  }

  async uploadImageFromLocalS3({ file }: { file: Express.Multer.File }) {
    try {
      const imageName = randomName()
      const command = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME as string,
        Key: imageName, //file.originalname || 'unknown',
        Body: file.buffer,
        ContentType: 'image/jpeg'
      })
      const result = await s3.send(command)
      // const singedUrl = new GetObjectCommand({
      //   Bucket: process.env.AWS_BUCKET_NAME as string,
      //   Key: imageName
      // })
      // const url = await getSignedUrl(s3, singedUrl, { expiresIn: 3600 }) //s3

      //cloudfront
      const url = getSignedUrl({
        url: `${urlImagePublic}/${imageName}`,
        keyPairId: process.env.AWS_KEY_PAIR_ID as string,
        dateLessThan: new Date(Date.now() + 1000 * 60).toString(),
        privateKey: process.env.AWS_BUCKET_PRIVATE_KEY as string
      })
      // protect url cloudfront
      //gen a private key with openssl: command: openssl genrsa -out private_key.pem 2048
      //gen public key use rsa from private key command: openssl rsa -pubout -in private_key.pem -out public_key.pem
      return {
        url,
        result
      }
    } catch (error) {
      console.error('Error upload Image to s3')
    }
  }
}

export default new UploadService()
