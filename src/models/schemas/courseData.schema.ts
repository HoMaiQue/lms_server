import { Document, Schema, model } from 'mongoose'

const DOCUMENT_NAME = 'CourseData'
const COLLECTION_NAME = 'courseData'

interface Link extends Document {
  title: string
  url: string
}
export interface CourseData extends Document {
  title: string
  description: string
  videoUrl: string
  videoThumbnail: object
  videoSection: string
  videoLength: number
  videoPlayer: string
  links: Link
  suggestion: string
}

const linkSchema = new Schema<Link>({
  title: { type: String, required: false },
  url: { type: String, required: false }
})

const courseDataSchema = new Schema<CourseData>(
  {
    title: String,
    description: String,
    videoUrl: String,
    videoSection: String,
    videoLength: Number,
    videoPlayer: String,
    links: [linkSchema],
    suggestion: String
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME
  }
)

//Export the model
export default model<CourseData>(DOCUMENT_NAME, courseDataSchema)
