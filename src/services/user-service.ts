import { type User } from '@/lib/data/types'
import { createUser, listUsers, removeUser, updateUser } from '@/lib/data/users'

export interface UserService {
  list(): User[]
  create(input: Omit<User, 'id' | 'lastActive'>): User
  update(id: string, updates: Partial<User>): User | undefined
  remove(id: string): void
}

export const userService: UserService = {
  list: listUsers,
  create: createUser,
  update: updateUser,
  remove: removeUser,
}
