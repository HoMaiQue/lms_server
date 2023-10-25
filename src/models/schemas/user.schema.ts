import { Schema, model, Document, ObjectId, Types } from 'mongoose'

const DOCUMENT_NAME = 'User'
const COLLECTION_NAME = 'users'

export interface UserDocument extends Document {
  name: string
  email: string
  password: string
  avatar: {
    public_id: string
    url: string
  }
  role: string
  isVerified: boolean
  courses: Array<{ courseId: string }>
  comparePassword: (password: string) => Promise<boolean>
}
// Declare the Schema of the Mongo model
const userSchema = new Schema<UserDocument>(
  {
    name: {
      type: String,
      required: true
    },
    email: { type: String, required: true },
    password: { type: String, required: true },
    avatar: {
      public_id: String,
      url: String
    },
    role: { type: String, default: 'user' },
    isVerified: {
      type: Boolean,
      default: false
    },
    courses: [{ courseId: String }]
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME
  }
)

//Export the model
export default model<UserDocument>(DOCUMENT_NAME, userSchema)
