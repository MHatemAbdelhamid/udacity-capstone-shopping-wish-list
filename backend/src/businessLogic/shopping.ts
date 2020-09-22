import 'source-map-support/register'

import * as uuid from 'uuid'

import { ShoppingAccess } from '../dataLayer/shoppingAccess'
import { ShoppingStorage } from '../dataLayer/shoppingStorage'
import { ShoppingItem } from '../models/ShoppingItem'
import { ShoppingUpdate } from '../models/ShoppingUpdate'
import { CreateShoppingRequest } from '../requests/CreateShoppingRequest'
import { UpdateShoppingRequest } from '../requests/UpdateShoppingRequest'
import { createLogger } from '../utils/logger'

const logger = createLogger('shopping')

const shoppingAccess = new ShoppingAccess()
const shoppingStorage = new ShoppingStorage()

export async function getShoppingItems(userId: string): Promise<ShoppingItem[]> {
  logger.info(`Retrieving all shopping items for user ${userId}`, { userId })

  return await shoppingAccess.getShoppingItems(userId)
}

export async function createShoppingItem(userId: string, createShoppingRequest: CreateShoppingRequest): Promise<ShoppingItem> {
  const shoppingItemId = uuid.v4()

  const newItem: ShoppingItem = {
    userId,
    shoppingItemId,
    createdAt: new Date().toISOString(),
    done: false,
    attachmentUrl: null,
    ...createShoppingRequest
  }

  logger.info(`Creating shopping item ${shoppingItemId} for user ${userId}`, { userId, shoppingItemId, shoppingItem: newItem })

  await shoppingAccess.createShoppingItem(newItem)

  return newItem
}

export async function updateShoppingItem(userId: string, shoppingItemId: string, updateShoppingRequest: UpdateShoppingRequest) {
  logger.info(`Updating shopping item ${shoppingItemId} for user ${userId}`, { userId, shoppingItemId, shoppingUpdate: updateShoppingRequest })

  const item = await shoppingAccess.getShoppingItem(shoppingItemId)

  if (!item)
    throw new Error('Item not found')  // FIXME: 404?

  if (item.userId !== userId) {
    logger.error(`User ${userId} does not have permission to update shopping item ${shoppingItemId}`)
    throw new Error('User is not authorized to update item')  // FIXME: 403?
  }

  shoppingAccess.updateShoppingItem(shoppingItemId, updateShoppingRequest as ShoppingUpdate)
}

export async function deleteShoppingItem(userId: string, shoppingItemId: string) {
  logger.info(`Deleting shopping item ${shoppingItemId} for user ${userId}`, { userId, shoppingItemId })

  const item = await shoppingAccess.getShoppingItem(shoppingItemId)

  if (!item)
    throw new Error('Item not found')  // FIXME: 404?

  if (item.userId !== userId) {
    logger.error(`User ${userId} does not have permission to delete shopping item ${shoppingItemId}`)
    throw new Error('User is not authorized to delete item')  // FIXME: 403?
  }

  shoppingAccess.deleteShoppingItem(shoppingItemId)
}

export async function updateAttachmentUrl(userId: string, shoppingItemId: string, attachmentId: string) {
  logger.info(`Generating attachment URL for attachment ${attachmentId}`)

  const attachmentUrl = await shoppingStorage.getAttachmentUrl(attachmentId)

  logger.info(`Updating shopping item ${shoppingItemId} with attachment URL ${attachmentUrl}`, { userId, shoppingItemId })

  const item = await shoppingAccess.getShoppingItem(shoppingItemId)

  if (!item)
    throw new Error('Item not found')  // FIXME: 404?

  if (item.userId !== userId) {
    logger.error(`User ${userId} does not have permission to update shopping item ${shoppingItemId}`)
    throw new Error('User is not authorized to update item')  // FIXME: 403?
  }

  await shoppingAccess.updateAttachmentUrl(shoppingItemId, attachmentUrl)
}

export async function generateUploadUrl(attachmentId: string): Promise<string> {
  logger.info(`Generating upload URL for attachment ${attachmentId}`)

  const uploadUrl = await shoppingStorage.getUploadUrl(attachmentId)

  return uploadUrl
}