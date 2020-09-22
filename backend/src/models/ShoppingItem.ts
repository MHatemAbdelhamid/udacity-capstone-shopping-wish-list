export interface ShoppingItem {
  userId: string
  shoppingItemId: string
  createdAt: string
  name: string
  dueDate: string
  done: boolean
  attachmentUrl?: string
}
