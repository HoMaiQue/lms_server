import { Types } from 'mongoose'
import _ from 'lodash'
export const convertToObjectIdMongodb = (id: string) => new Types.ObjectId(id)

interface ObjectData {}

// Define interface for the getInfoData function options
interface GetInfoDataOptions {}

// Export the function
export const getInfoData = ({ fields = [], object = {} }: { fields: string[]; object: { [key: string]: any } }) => {
  return _.pick(object, fields)
}

export const getSelectData = (select: string[] = []) => {
  return Object.fromEntries(select.map((el) => [el, 1]))
}
export const unGetSelectData = (select: string[] = []) => {
  return Object.fromEntries(select.map((el) => [el, 0]))
}
