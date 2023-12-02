import { Router } from 'express'
import LayoutController from '~/controllers/layout.controller'
import asyncHandler from '~/helpers/asyncHandler'
import { filterMiddleware } from '~/middleware/common.middleware'
import { accessTokenValidator, authorizeRoles } from '~/middleware/user.middleware'

const layoutRouter = Router()

layoutRouter.use(accessTokenValidator)
layoutRouter.post('', authorizeRoles('admin'), asyncHandler(LayoutController.createLayout))
layoutRouter.put('/:layout_id', authorizeRoles('admin'), asyncHandler(LayoutController.updateLayout))
layoutRouter.get('', authorizeRoles('admin'), asyncHandler(LayoutController.getLayoutByType))

export default layoutRouter
