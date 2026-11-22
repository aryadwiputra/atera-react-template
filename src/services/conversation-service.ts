import { type Conversation, type ConversationStatus } from '@/lib/data/types'
import { getConversation, listConversations, replyToConversation, setConversationStatus } from '@/lib/data/conversations'

export interface ConversationService {
  list(): Conversation[]
  get(id: string): Conversation | undefined
  reply(id: string, body: string): void
  setStatus(id: string, status: ConversationStatus): void
}
export const conversationService: ConversationService = {
  list: listConversations,
  get: getConversation,
  reply: replyToConversation,
  setStatus: setConversationStatus,
}
