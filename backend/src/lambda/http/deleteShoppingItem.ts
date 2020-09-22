import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

import { deleteShoppingItem } from '../../businessLogic/shopping'

import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'

const logger = createLogger('deleteShoppingItem')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Processing deleteShoppingItem event', { event })

  const userId = getUserId(event)
  const shoppingItemId = event.pathParameters.shoppingItemId

  await deleteShoppingItem(userId, shoppingItemId)

  return {
    statusCode: 204,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: ''
  }
}