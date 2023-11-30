import { ParsedQs } from 'qs'
export interface QueryRequest extends ParsedQs {
  page: string
  limit: string
}
