import { convertToObjectIdMongodb } from '~/utils/formatter'
import userSchema from '../schemas/user.schema'
import client from '~/dbs/init.redis'

export const findUserByCondition = async ({ ...key }) => {
  return await userSchema.findOne({ ...key })
}

export const getUserById = async (user_id: string) => {
  const user = await client.hget(user_id, 'user')
  if (!user) {
    const foundUser = await userSchema.findById(convertToObjectIdMongodb(user_id)).lean()
    await client.hset(user_id, 'user', JSON.stringify(foundUser))
    return foundUser
  }
  return JSON.parse(user)
}

export const createUser = async (payload: { email: string; name: string; password?: string; avatar?: string }) => {
  return await userSchema.create(payload)
}
