export interface CreateQuestionRequest {
  lessonId: string
  userId: string
  content: string
  parentQuestionId: string | null
}
