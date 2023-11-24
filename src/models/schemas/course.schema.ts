import { Schema, model, Document, ObjectId, Types } from 'mongoose'

const DOCUMENT_NAME = 'Course'
const COLLECTION_NAME = 'courses'

// interface Comment extends Document {
//   user: object
//   question: string
//   questionReplies?: Comment[]
// }
// interface Review extends Document {
//   user: object
//   rating: number
//   comment: string
//   commentReplies: Comment[]
// }

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
  reviews: string[]
  courseData: ObjectId[]
  ratings?: number
  purchased?: number
}

// Declare the Schema of the Mongo model
// const reviewSchema = new Schema<Review>(
//   {
//     user: Object,
//     rating: {
//       type: Number,
//       default: 0
//     },
//     comment: {
//       type: String
//     }
//   },
//   {
//     timestamps: true,
//     collection: COLLECTION_NAME
//   }
// )

const courseSchema = new Schema<Course>(
  {
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
    reviews: { type: [String], default: [] },
    courseData: [{ type: Schema.Types.ObjectId, ref: 'CourseData' }],
    ratings: { type: Number, default: 0 },
    purchased: { type: Number, default: 0 }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME
  }
)

//Export the model
export default model<Course>(DOCUMENT_NAME, courseSchema)
