import { ParsedQs } from 'qs'
export interface CreateQuestionRequest {
  lessonId: string
  userId: string
  content: string
  parentQuestionId: string | null
}

export interface GetListQuestionRequest {
  lessonId: string
  parentQuestionId: string | null
  limit: number
  offset: number
}
