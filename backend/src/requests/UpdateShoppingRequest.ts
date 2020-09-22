/**
 * Fields in a request to update a single TODO item.
 */
export interface UpdateShoppingRequest {
  name: string
  dueDate: string
  done: boolean
}