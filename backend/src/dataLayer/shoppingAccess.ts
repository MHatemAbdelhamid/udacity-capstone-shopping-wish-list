import 'source-map-support/register'

import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import * as AWSXRay from 'aws-xray-sdk'

import { ShoppingItem } from '../models/ShoppingItem'
import { ShoppingUpdate } from '../models/ShoppingUpdate'
import { createLogger } from '../utils/logger'

const logger = createLogger('shoppingAccess')

const XAWS = AWSXRay.captureAWS(AWS)

export class ShoppingAccess {

  constructor(
    private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
    private readonly shoppingTable = process.env.SHOPPING_TABLE,
    private readonly shoppingItemsByUserIndex = process.env.SHOPPING_BY_USER_INDEX
  ) {}

  async shoppingItemExists(shoppingItemId: string): Promise<boolean> {
    const item = await this.getShoppingItem(shoppingItemId)
    return !!item
  }

  async getShoppingItems(userId: string): Promise<ShoppingItem[]> {
    logger.info(`Getting all shopping Items for user ${userId} from ${this.shoppingTable}`)

    const result = await this.docClient.query({
      TableName: this.shoppingTable,
      IndexName: this.shoppingItemsByUserIndex,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      }
    }).promise()

    const items = result.Items

    logger.info(`Found ${items.length} shopping items for user ${userId} in ${this.shoppingTable}`)

    return items as ShoppingItem[]
  }

  async getShoppingItem(shoppingItemId: string): Promise<ShoppingItem> {
    logger.info(`Getting shopping item ${shoppingItemId} from ${this.shoppingTable}`)

    const result = await this.docClient.get({
      TableName: this.shoppingTable,
      Key: {
        shoppingItemId
      }
    }).promise()

    const item = result.Item

    return item as ShoppingItem
  }

  async createShoppingItem(shoppingItem: ShoppingItem) {
    logger.info(`Putting shopping item ${shoppingItem.shoppingItemId} into ${this.shoppingTable}`)

    await this.docClient.put({
      TableName: this.shoppingTable,
      Item: shoppingItem,
    }).promise()
  }

  async updateShoppingItem(shoppingItemId: string, shoppingUpdate: ShoppingUpdate) {
    logger.info(`Updating shopping item ${shoppingItemId} in ${this.shoppingTable}`)

    await this.docClient.update({
      TableName: this.shoppingTable,
      Key: {
        shoppingItemId
      },
      UpdateExpression: 'set #name = :name, dueDate = :dueDate, done = :done',
      ExpressionAttributeNames: {
        "#name": "name"
      },
      ExpressionAttributeValues: {
        ":name": shoppingUpdate.name,
        ":dueDate": shoppingUpdate.dueDate,
        ":done": shoppingUpdate.done
      }
    }).promise()   
  }

  async deleteShoppingItem(shoppingItemId: string) {
    logger.info(`Deleting shopping item ${shoppingItemId} from ${this.shoppingTable}`)

    await this.docClient.delete({
      TableName: this.shoppingTable,
      Key: {
        shoppingItemId
      }
    }).promise()    
  }

  async updateAttachmentUrl(shoppingItemId: string, attachmentUrl: string) {
    logger.info(`Updating attachment URL for shopping ${shoppingItemId} in ${this.shoppingTable}`)

    await this.docClient.update({
      TableName: this.shoppingTable,
      Key: {
        shoppingItemId
      },
      UpdateExpression: 'set attachmentUrl = :attachmentUrl',
      ExpressionAttributeValues: {
        ':attachmentUrl': attachmentUrl
      }
    }).promise()
  }

}