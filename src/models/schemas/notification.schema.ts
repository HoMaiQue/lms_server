import { Schema, model, Document, ObjectId, Types } from 'mongoose'

const DOCUMENT_NAME = 'Notification'
const COLLECTION_NAME = 'notifications'

interface Notification extends Document {
  title: string
  message: string
  status: string
  user: ObjectId
}
// Declare the Schema of the Mongo model
const notificationSchema = new Schema<Notification>(
  {
    user: { type: Schema.Types.ObjectId, required: true },
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    status: {
      type: String,
      required: true,
      default: 'unread'
    }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME
  }
)

//Export the model

export default model(DOCUMENT_NAME, notificationSchema)
