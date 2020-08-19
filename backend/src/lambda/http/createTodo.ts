import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { CreateItemRequest } from '../../requests/CreateItemRequest'
import { createTodo } from '../../businesslayer/todoManager'
import { getUserId } from '../utils'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newTodo: CreateItemRequest = JSON.parse(event.body)

  const item = await createTodo(newTodo, getUserId(event))
  
  return {
    statusCode: 200,
    headers:{
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(item)
  }
  
}
