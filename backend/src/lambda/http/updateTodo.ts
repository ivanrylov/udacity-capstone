import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { UpdateItemRequest } from '../../requests/UpdateItemRequest'
import { updateTodoItem } from '../../businesslayer/todoManager'
import { getUserId } from '../utils'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const updatedTodo: UpdateItemRequest = JSON.parse(event.body)
  const result = await updateTodoItem(getUserId(event), todoId, updatedTodo);
  console.log(result)
  return {
      statusCode: 202,
      headers: {
          'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(updatedTodo)
  }
}
