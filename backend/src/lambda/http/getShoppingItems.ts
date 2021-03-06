import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

import { getShoppingItems } from '../../businessLogic/shopping'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'

const logger = createLogger('getShoppingItems')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Processing getShoppingItems event', { event })

  const userId = getUserId(event)

  const items = await getShoppingItems(userId)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      items
    })
  }
}