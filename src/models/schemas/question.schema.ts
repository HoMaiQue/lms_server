import { Schema, model, Document, ObjectId, Types } from 'mongoose'

const DOCUMENT_NAME = 'Question'
const COLLECTION_NAME = 'questions'

interface Question extends Document {
  question_lessonId: ObjectId
  question_userId: ObjectId
  question_content: string
  question_left: number
  question_right: number
  question_parentId: ObjectId
  isDeleted: boolean
}
// Declare the Schema of the Mongo model
const questionSchema = new Schema<Question>(
  {
    question_lessonId: {
      type: Schema.Types.ObjectId,
      ref: 'CourseData'
    },
    question_userId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    question_content: {
      type: String,
      default: 'text'
    },
    question_left: {
      type: Number,
      default: 0
    },
    question_right: {
      type: Number,
      default: 0
    },
    question_parentId: {
      type: Schema.Types.ObjectId,
      ref: DOCUMENT_NAME
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
