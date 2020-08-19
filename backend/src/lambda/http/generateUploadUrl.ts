import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { generateUploadUrl } from '../../businesslayer/todoManager'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

   const uploadUrl = await generateUploadUrl(event);
   return {
       statusCode: 202,
       headers: {
           'Access-Control-Allow-Origin': '*'
       },
       body: JSON.stringify({
           uploadUrl: uploadUrl
       })

   }
}
