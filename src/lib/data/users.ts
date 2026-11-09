import type { User } from './types'

let users: User[] = [
  { id: 'USR-001', name: 'Avery Morgan', email: 'avery@atera.test', role: 'Admin', status: 'Active', department: 'Engineering', lastActive: '2 hours ago' },
  { id: 'USR-002', name: 'Emma Wilson', email: 'emma@atera.test', role: 'Editor', status: 'Active', department: 'Marketing', lastActive: '5 minutes ago' },
  { id: 'USR-003', name: 'James Chen', email: 'james@atera.test', role: 'Admin', status: 'Active', department: 'Engineering', lastActive: '1 hour ago' },
  { id: 'USR-004', name: 'Sofia Garcia', email: 'sofia@atera.test', role: 'Moderator', status: 'Active', department: 'Support', lastActive: '30 minutes ago' },
  { id: 'USR-005', name: 'Alex Thompson', email: 'alex@atera.test', role: 'Viewer', status: 'Active', department: 'Sales', lastActive: '3 hours ago' },
  { id: 'USR-006', name: 'Maria Santos', email: 'maria@atera.test', role: 'Editor', status: 'Active', department: 'Design', lastActive: '1 day ago' },
  { id: 'USR-007', name: 'David Kim', email: 'david@atera.test', role: 'Viewer', status: 'Inactive', department: 'Finance', lastActive: '2 weeks ago' },
  { id: 'USR-008', name: 'Lisa Park', email: 'lisa@atera.test', role: 'Editor', status: 'Active', department: 'Marketing', lastActive: '10 minutes ago' },
  { id: 'USR-009', name: 'Ryan Mitchell', email: 'ryan@atera.test', role: 'Moderator', status: 'Suspended', department: 'Support', lastActive: '1 month ago' },
  { id: 'USR-010', name: 'Nina Patel', email: 'nina@atera.test', role: 'Admin', status: 'Active', department: 'Engineering', lastActive: '15 minutes ago' },
]

export const listUsers = () => [...users]
export const createUser = (user: Omit<User, 'id' | 'lastActive'>) => {
  const created = { ...user, id: `USR-${String(users.length + 1).padStart(3, '0')}`, lastActive: 'Never' }
  users = [...users, created]
  return created
}
export const updateUser = (id: string, updates: Partial<User>) => {
  users = users.map((user) => user.id === id ? { ...user, ...updates } : user)
  return users.find((user) => user.id === id)
}
export const removeUser = (id: string) => {
  users = users.filter((user) => user.id !== id)
}
