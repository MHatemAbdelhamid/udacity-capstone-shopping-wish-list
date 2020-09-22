import { apiEndpoint } from '../config'
import { ShoppingItem } from '../types/ShoppingItem';
import { CreateShoppingItemRequest } from '../types/CreateShoppingItemRequest';
import Axios from 'axios'
import { UpdateShoppingItemRequest } from '../types/UpdateShoppingItemRequest';

export async function getShoppingItems(idToken: string): Promise<ShoppingItem[]> {
  console.log('Fetching shoppingItems')

  const response = await Axios.get(`${apiEndpoint}/shoppingItems`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('ShoppingItems:', response.data)
  return response.data.items
}

export async function createShoppingItem(
  idToken: string,
  newShoppingItem: CreateShoppingItemRequest
): Promise<ShoppingItem> {
  const response = await Axios.post(`${apiEndpoint}/shoppingItems`,  JSON.stringify(newShoppingItem), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.item
}

export async function patchShoppingItem(
  idToken: string,
  shoppingItemId: string,
  updatedShoppingItem: UpdateShoppingItemRequest
): Promise<void> {
  await Axios.patch(`${apiEndpoint}/shoppingItems/${shoppingItemId}`, JSON.stringify(updatedShoppingItem), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function deleteShoppingItem(
  idToken: string,
  shoppingItemId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/shoppingItems/${shoppingItemId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function getUploadUrl(
  idToken: string,
  shoppingItemId: string
): Promise<string> {
  const response = await Axios.post(`${apiEndpoint}/shoppingItems/${shoppingItemId}/attachment`, '', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.uploadUrl
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
  await Axios.put(uploadUrl, file)
}
