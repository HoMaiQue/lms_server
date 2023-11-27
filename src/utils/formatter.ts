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

export const formatDateString = (dateString: string | Date) => {
  const dateObject = new Date(dateString)

  const options = { day: '2-digit', month: '2-digit', year: 'numeric' } as Intl.DateTimeFormatOptions
  const formatter = new Intl.DateTimeFormat('en-US', options)

  return formatter.format(dateObject)
}
