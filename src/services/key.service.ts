import Key from '~/models/schemas/key.schema'
import { convertToObjectIdMongodb } from '~/utils/formatter'
class KeyServices {
  static findByUserId = async (user_id: string) => {
    return Key.findOne({ user: convertToObjectIdMongodb(user_id) }).lean()
  }
  static createKeyToken = async ({
    user_id,
    public_key,
    private_key,
    refresh_token
  }: {
    user_id: string
    public_key: string
    private_key: string
    refresh_token: string
  }) => {
    const filter = { user: convertToObjectIdMongodb(user_id) }
    const update = {
      public_key,
      private_key,
      refresh_token_used: [],
      refresh_token
    }
    const options = {
      upsert: true,
      new: true
    }
    const tokens = await Key.findOneAndUpdate(filter, update, options)

    return tokens ? tokens.public_key : null
  }
  static removeKeyById = async (key_id: string) => {
    return await Key.deleteOne({ _id: key_id })
  }
}
export default KeyServices
