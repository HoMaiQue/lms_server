import { Schema, model, Document, ObjectId, Types } from 'mongoose'

const DOCUMENT_NAME = 'Course'
const COLLECTION_NAME = 'courses'

interface Comment extends Document {
  user: object
  comment: string
  commentReplies?: Comment[]
}
interface Review extends Document {
  user: object
  rating: number
  comment: string
  commentReplies: Comment[]
}
interface Link extends Document {
  title: string
  url: string
}
interface CourseData extends Document {
  title: string
  description: string
  videoUrl: string
  videoThumbnail: object
  videoSection: string
  videoLength: number
  videoPlayer: string
  links: Link
  suggestion: string
  questions: Comment[]
}
interface Course extends Document {
  name: string
  description?: string
  price: number
  estimatePrice?: number
  thumbnail: object
  tags: string
  level: string
  demoUrl: string
  benefits: { title: string }[]
  prerequisites: { title: string }[]
  reviews: Review[]
  courseData: CourseData[]
  ratings?: number
  purchased?: number
}

// Declare the Schema of the Mongo model
const reviewSchema = new Schema<Review>(
  {
    user: Object,
    rating: {
      type: Number,
      default: 0
    },
    comment: {
      type: String
    }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME
  }
)
const linkSchema = new Schema<Link>({
  title: { type: String, required: false },
  url: { type: String, required: false }
})
const commentSchema = new Schema<Comment>({
  user: Object,
  comment: String,
  commentReplies: [Object]
})
const courseDataSchema = new Schema<CourseData>({
  title: String,
  description: String,
  videoUrl: String,
  videoSection: String,
  videoLength: Number,
  videoPlayer: String,
  links: [linkSchema],
  suggestion: String,
  questions: [commentSchema]
})

const courseSchema = new Schema<Course>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  estimatePrice: { type: Number },
  thumbnail: { public_id: { type: String }, url: { type: String } },
  tags: { type: String, required: true },
  level: { type: String, required: true },
  demoUrl: { type: String, required: true },
  benefits: [{ title: String }],
  prerequisites: [{ title: String }],
  reviews: [reviewSchema],
  courseData: [courseDataSchema],
  ratings: { type: Number, default: 0 },
  purchased: { type: Number, default: 0 }
})

//Export the model
export default model<Course>(DOCUMENT_NAME, courseSchema)
