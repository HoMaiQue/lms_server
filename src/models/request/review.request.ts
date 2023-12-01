export interface CreateReviewRequest {
  review_courseId: string
  review_rating: number
  review_content: string
  review_parentId: string | null
}
export interface GetListReviewRequest {
  review_courseId: string
  review_parentId: string | null
}
