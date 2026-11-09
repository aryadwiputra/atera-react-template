import type { Notification } from './types'

let notifications: Notification[] = [
  { id: 'NOT-001', title: 'New order received', description: 'Order #ORD-7291 was placed by Olivia Martin.', time: '2m ago', read: false, type: 'order' },
  { id: 'NOT-002', title: 'Weekly report is ready', description: 'Your business summary is available.', time: '1h ago', read: false, type: 'report' },
  { id: 'NOT-003', title: 'New team member', description: 'Marcus Reed joined your workspace.', time: '3h ago', read: true, type: 'team' },
]

export const listNotifications = () => [...notifications]
export const markNotificationRead = (id: string) => {
  notifications = notifications.map((notification) => notification.id === id ? { ...notification, read: true } : notification)
}
export const markAllNotificationsRead = () => {
  notifications = notifications.map((notification) => ({ ...notification, read: true }))
}
