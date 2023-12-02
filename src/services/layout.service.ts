import { LayoutType } from '~/constants/enum'
import { LAYOUT_MESSAGE } from '~/constants/message'
import { ForbiddenError, NotFoundError } from '~/core/error.response'
import { CreateLayoutRequest } from '~/models/request/layout.request'
import layoutSchema from '~/models/schemas/layout.schema'

class LayoutService {
  async createLayout({ type, banner, faq, categories }: CreateLayoutRequest) {
    const isExistType = await layoutSchema.findOne({ type }).lean()
    if (isExistType) {
      throw new ForbiddenError(LAYOUT_MESSAGE.TYPE_ALREADY_EXISTENT)
    }
    if (type === LayoutType.Banner) {
      return await layoutSchema.create({ type, banner })
    }

    if (type === LayoutType.Faq) {
      return await layoutSchema.create({ type, faq })
    }

    if (type === LayoutType.Category) {
      return await layoutSchema.create({ type, categories })
    }
  }

  async updateLayout(layout_id: string, { type, banner, faq, categories }: CreateLayoutRequest) {
    if (type === LayoutType.Banner) {
      return await layoutSchema.findByIdAndUpdate(layout_id, { banner }, { new: true })
    }
    if (type === LayoutType.Faq) {
      return await layoutSchema.findByIdAndUpdate(layout_id, { faq }, { new: true })
    }
    if (type === LayoutType.Category) {
      return await layoutSchema.findByIdAndUpdate(layout_id, { categories }, { new: true })
    }
  }

  async getLayoutByType(type: string){
    return await layoutSchema.findOne({type}).lean()
  }
}

export default new LayoutService()
