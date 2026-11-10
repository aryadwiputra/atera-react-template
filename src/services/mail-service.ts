import { listMail, markMailRead, sendMail } from '@/lib/data/mail'
import type { MailMessage } from '@/lib/data/mail'

export interface MailService {
  list(): MailMessage[]
  markRead(id: string): void
  send(input: { to: string; subject: string; body: string }): void
}

export const mailService: MailService = {
  list: listMail,
  markRead: markMailRead,
  send: sendMail,
}
