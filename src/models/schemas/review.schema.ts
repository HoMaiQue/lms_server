import { Schema, model, Document, ObjectId, Types } from 'mongoose'

const DOCUMENT_NAME = 'Review'
const COLLECTION_NAME = 'reviews'

interface Review extends Document {
  review_courseId: ObjectId
  review_rating: number
  review_userId: ObjectId
  review_content: string
  review_parentId: ObjectId 
  isDeleted: boolean,
}
// Declare the Schema of the Mongo model
const questionSchema = new Schema<Review>(
  {
    review_courseId: {
      type: Schema.Types.ObjectId,
      ref: 'Course'
    },
    review_userId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    review_content: {
      type: String,
      default: 'text'
    },
    review_parentId: {
      type: Schema.Types.ObjectId,
      ref: DOCUMENT_NAME
    },
    review_rating: {
      type: Number,
      default: 0
    },
  
    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME
  }
)

//Export the model

export default model(DOCUMENT_NAME, questionSchema)
