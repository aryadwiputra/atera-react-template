import { type Conversation, type ConversationStatus, type TicketInput } from '@/lib/data/types'
import { createConversationTicket, getConversation, listConversations, replyToConversation, setConversationAssignee, setConversationStatus } from '@/lib/data/conversations'

export interface ConversationService {
  list(): Conversation[]
  get(id: string): Conversation | undefined
  reply(id: string, body: string): void
  setStatus(id: string, status: ConversationStatus): void
  setAssignee(id: string, assignee: string): void
  createTicket(id: string, input: TicketInput): void
}
export const conversationService: ConversationService = {
  list: listConversations,
  get: getConversation,
  reply: replyToConversation,
  setStatus: setConversationStatus,
  setAssignee: setConversationAssignee,
  createTicket: createConversationTicket,
}
