import userSchema from '../schemas/user.schema'

export const findEmail = async (email: string) => {
  return userSchema.findOne({ email }).lean()
}
