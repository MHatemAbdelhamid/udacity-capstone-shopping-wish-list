import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { updateShoppingItem } from '../../businessLogic/shopping'
import { UpdateShoppingRequest } from '../../requests/UpdateShoppingRequest'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'

const logger = createLogger('updateShoppingItem')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Processing updateShoppingItem event', { event })

  const userId = getUserId(event)
  const shoppingItemId = event.pathParameters.shoppingItemId
  const updatedShoppingItem: UpdateShoppingRequest = JSON.parse(event.body)

  await updateShoppingItem(userId, shoppingItemId, updatedShoppingItem)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: ''
  }
}