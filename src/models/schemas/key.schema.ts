import { Document, Schema, Types, model } from 'mongoose'

const DOCUMENT_NAME = 'Key'
const COLLECTION_NAME = 'Keys'

// Define interface for Key document
export interface KeyDocument extends Document {
  user: Types.ObjectId
  private_key: string
  public_key: string
  refresh_token_used: Array<string>
  refresh_token: string
}

// Declare the Schema of the Mongo model
const keyTokenSchema = new Schema<KeyDocument>(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    private_key: {
      type: String,
      required: true
    },
    public_key: {
      type: String,
      required: true
    },
    refresh_token_used: {
      type: [String],
      default: []
    },
    refresh_token: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME
  }
)

// Export the model
export default model<KeyDocument>(DOCUMENT_NAME, keyTokenSchema)
