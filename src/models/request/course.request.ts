export interface uploadCourseRequestBody {
  name: string
  description: string
  price: number
  estimatePrice: number
  thumbnail: { public_id: string; url: string }
  tags: string
  level: string
  demoUrl: string
  benefits: { title: string }[]
  prerequisites: { title: string }[]
  reviews: any
  courseData: any
  ratings: number
  purchased: number
}

export interface UpdateCourseRequestBody {
  name?: string
  description?: string
  price?: number
  estimatePrice?: number
  thumbnail?: { public_id: string; url: string }
  tags?: string
  level?: string
  demoUrl?: string
  benefits?: { title: string }[]
  prerequisites?: { title: string }[]
  reviews?: any
  courseData?: any
  ratings?: number
  purchased?: number
}



