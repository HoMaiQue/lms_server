import { S3, PutObjectCommand, GetObjectCommand, DeleteObjectCommand  } from '@aws-sdk/client-s3'

const s3 = new S3({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string
  }
})
export { s3, PutObjectCommand,  GetObjectCommand, DeleteObjectCommand }
