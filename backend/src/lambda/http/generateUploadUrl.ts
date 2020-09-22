import '../../../node_modules/source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import * as uuid from '../../../node_modules/uuid'

import { generateUploadUrl, updateAttachmentUrl } from '../../businessLogic/shopping'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'

const logger = createLogger('generateUploadUrl')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Processing generateUploadUrl event', { event })

  const userId = getUserId(event)
  const shoppingItemId = event.pathParameters.shoppingItemId
  const attachmentId = uuid.v4()

  const uploadUrl = await generateUploadUrl(attachmentId)

  await updateAttachmentUrl(userId, shoppingItemId, attachmentId)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      uploadUrl
    })
  }
}