import { convertToObjectIdMongodb } from '~/utils/formatter'
import userSchema from '../schemas/user.schema'

export const findUserByCondition = async ({ ...key }) => {
  return await userSchema.findOne({ ...key })
}

export const getUserById = async (user_id: string) => {
  return await userSchema.findById(convertToObjectIdMongodb(user_id)).lean()
}

export const createUser = async (payload: { email: string; name: string; password?: string; avatar?: string }) => {
  return await userSchema.create(payload)
}
