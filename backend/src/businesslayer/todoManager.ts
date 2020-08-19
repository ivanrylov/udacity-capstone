import { itemRepository } from "../datalayer/itemRepository";
import * as uuid from 'uuid';
import { ItemUpdate } from "../models/ItemUpdate";
import { CreateItemRequest } from "../requests/CreateItemRequest";
import { UpdateItemRequest } from "../requests/UpdateItemRequest";
import { getUserId } from "../lambda/utils";
import { APIGatewayProxyEvent } from "aws-lambda";
import { Item } from "../models/Item";

const itemRepo = new itemRepository();

export async function getAllTodos(userId: string): Promise<Item[]> {
    return itemRepo.getAllItems(userId);
}

export async function createTodo(
    createGroupRequest: CreateItemRequest,
    userId: string
): Promise<Item> {

    const itemId = uuid.v4();
    return await itemRepo.createItem({
        todoId: itemId,
        userId: userId,
        name: createGroupRequest.name,
        createdAt: new Date().toISOString(),
        dueDate: createGroupRequest.dueDate,
        done: false,
        attachmentUrl: null
    })
}

export async function updateTodoItem(userId: string, todoId: string, todoUpdate: ItemUpdate): Promise<UpdateItemRequest> {
    return await itemRepo.updateItem(userId, todoId, todoUpdate);
}

export async function deleteTodoItem(userId: string, todoId: string) {
    return await itemRepo.deleteItem(userId, todoId)
}

export async function generateUploadUrl( event: APIGatewayProxyEvent ): Promise<string> {
    const todoId = event.pathParameters.todoId;
    const userId = getUserId(event);
    const generatedUrl = await itemRepo.generateUploadUrl(todoId, userId);
    return generatedUrl
}

