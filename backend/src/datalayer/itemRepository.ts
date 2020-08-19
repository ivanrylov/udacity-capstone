import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { Item } from '../models/Item'
import { ItemUpdate } from '../models/ItemUpdate'

const XAWS = AWSXRay.captureAWS(AWS)

export class itemRepository {

    constructor(
        private readonly docClient: DocumentClient = createDynamoDBClient(),
        private readonly dbTable = process.env.TODOS_TABLE,
        private S3 = createS3Bucket()) {
      }

      async getAllItems(userId: string): Promise<Item[]> {

        const result = await this.docClient.query({
            TableName: this.dbTable,
            IndexName: "IndexTodos",
            KeyConditionExpression: 'userId=:userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        }).promise();

        const items = result.Items;
        return items as Item[];
      }

      async createItem(item: Item): Promise<Item> {
        await this.docClient.put({
            TableName: this.dbTable,
            Item: item
        }).promise();

        return item;
      }

      async deleteItem(todoId: string, userId: string) {
        await this.docClient.delete({
            TableName: this.dbTable,
            Key: { userId, todoId }
        })
        .promise();
     }

     async generateUploadUrl(todoId: string, userId: string): Promise<string> {
        const uploadUrl = this.S3.getSignedUrl("putObject", {
              Bucket: process.env.S3_BUCKET,
              Key: todoId,
              Expires: 400
          });
          await this.docClient.update({
                TableName: this.dbTable,
                Key: { userId, todoId },
                UpdateExpression: "set attachmentUrl=:URL",
                ExpressionAttributeValues: {
                  ":URL": uploadUrl.split("?")[0]
              },
              ReturnValues: "UPDATED_NEW"
            })
            .promise();

          return uploadUrl;
        }

        async updateItem(userId: string, todoId: string, updatedTodo: ItemUpdate) {
          await this.docClient.update({
                TableName: this.dbTable,
                Key: { userId, todoId },
                ExpressionAttributeNames: { "#N": "name" },
                UpdateExpression: "set #N=:todoName, dueDate=:dueDate, done=:done",
                ExpressionAttributeValues: {
                  ":todoName": updatedTodo.name,
                  ":dueDate": updatedTodo.dueDate,
                  ":done": updatedTodo.done
              },
              ReturnValues: "UPDATED_NEW"
            })
            .promise();
          return updatedTodo;
        }
      }

function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    console.log('Creating a local DynamoDB instance')
    return new XAWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }

  return new XAWS.DynamoDB.DocumentClient()
}

function createS3Bucket() {
  return new XAWS.S3({
        signatureVersion: "v4"
    });
}