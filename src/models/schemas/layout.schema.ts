import { Schema, model, Document, ObjectId, Types, Model } from 'mongoose'

const DOCUMENT_NAME = 'Layout'
const COLLECTION_NAME = 'layouts'
interface FagItem {
  question: string
  answer: string
}

interface Category {
  title: string
}
interface BannerImage {
  public_id: string
  url: string
}
interface Layout extends Document {
  type: string
  faq: FagItem[]
  categories: Category[]
  banner: {
    image: BannerImage
    title: string
    subtitle: string
  }
}
type LayoutModelType = Model<Layout>
const layoutSchema = new Schema<Layout, LayoutModelType>(
  {
    type: { type: String },
    faq: { type: [{ question: String, answer: String }] },
    categories: { type: [{ title: String }] },
    banner: {
      type: {
        image: { public_id: String, url: String },
        title: String,
        subtitle: String
      }
    }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME
  }
)

//Export the model
export default model<Layout, LayoutModelType>(DOCUMENT_NAME, layoutSchema)
