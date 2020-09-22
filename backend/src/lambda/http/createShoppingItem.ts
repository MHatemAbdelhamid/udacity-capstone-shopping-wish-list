import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { createShoppingItem } from '../../businessLogic/shopping'
import { CreateShoppingRequest } from '../../requests/CreateShoppingRequest'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'

const logger = createLogger('createShoppingItem')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Processing createShoppingItem event', { event })

  const userId = getUserId(event)
  const newShopping: CreateShoppingRequest = JSON.parse(event.body)

  const newItem = await createShoppingItem(userId, newShopping)

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      item: newItem
    })
  }
}