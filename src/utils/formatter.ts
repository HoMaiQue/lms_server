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
