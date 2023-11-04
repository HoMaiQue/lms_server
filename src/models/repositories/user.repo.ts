import userSchema from '../schemas/user.schema'

export const findUserByCondition = async ({ ...key }) => {
  return userSchema.findOne({ ...key }).lean()
}
