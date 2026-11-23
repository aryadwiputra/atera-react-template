import {
  getEmail,
  listEmails,
  moveEmail,
  replyToEmail,
  sendEmail,
  setEmailUnread,
  toggleEmailStar,
} from '@/lib/data/emails'
import type { Email, EmailFolder } from '@/lib/data/types'

export interface EmailService {
  list(): Email[]
  get(id: string): Email | undefined
  markRead(id: string, unread: boolean): void
  toggleStar(id: string): void
  move(id: string, folder: EmailFolder): void
  reply(id: string, body: string): void
  send(input: { to: string; subject: string; body: string }): void
}

export const emailService: EmailService = {
  list: listEmails,
  get: getEmail,
  markRead: setEmailUnread,
  toggleStar: toggleEmailStar,
  move: moveEmail,
  reply: replyToEmail,
  send: sendEmail,
}
