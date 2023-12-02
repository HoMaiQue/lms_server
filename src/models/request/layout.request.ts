export interface CreateLayoutRequest {
  type: string
  banner?: { image: { public_id: string; url: string }; title: string; subtitle: string }
  faq?: { question: string; answer: string }[]
  categories?: { title: string }[]
}
