import { Schema, model, Document, ObjectId, Types } from 'mongoose'

const DOCUMENT_NAME = 'Order'
const COLLECTION_NAME = 'orders'

interface Order extends Document {
  course_id: ObjectId
  user_id: ObjectId
  payment_info: object
}
// Declare the Schema of the Mongo model
const notificationSchema = new Schema<Order>(
  {
    course_id: {
      type: Schema.Types.ObjectId,
      ref: 'Course'
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    payment_info: {
      type: Object
    }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME
  }
)

//Export the model

export default model(DOCUMENT_NAME, notificationSchema)
