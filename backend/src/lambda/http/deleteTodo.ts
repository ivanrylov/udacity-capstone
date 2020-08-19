import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { deleteTodoItem } from '../../businesslayer/todoManager';
import { getUserId } from '../utils';

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    await deleteTodoItem(getUserId(event), todoId);
    
    return {
      statusCode: 202,
      headers:{
        'Access-Control-Allow-Origin': '*'
      },
      body:''
    }
  }

