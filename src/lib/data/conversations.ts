import type { Conversation, ConversationStatus } from './types'

const seed: Conversation[] = [
  {
    id: 'CON-001',
    customer: 'Amelia Hart',
    initials: 'AH',
    channel: 'whatsapp',
    status: 'open',
    unread: true,
    messages: [
      { id: 'MSG-001', sender: 'customer', body: 'Hi, my order #4821 hasn\'t arrived yet. It was due yesterday.', time: '09:12 AM' },
      { id: 'MSG-002', sender: 'agent', body: 'Sorry about that! Let me check the delivery status for you.', time: '09:14 AM' },
      { id: 'MSG-003', sender: 'customer', body: 'Thank you. I need it before the weekend.', time: '09:15 AM' },
    ],
  },
  {
    id: 'CON-002',
    customer: 'Noah Patel',
    initials: 'NP',
    channel: 'webchat',
    status: 'open',
    unread: true,
    messages: [
      { id: 'MSG-004', sender: 'customer', body: 'Do you offer the annual plan with a monthly billing option?', time: '09:41 AM' },
      { id: 'MSG-005', sender: 'customer', body: 'Also, is there a discount for teams over 10 seats?', time: '09:42 AM' },
    ],
  },
  {
    id: 'CON-003',
    customer: 'Sofia Reyes',
    initials: 'SR',
    channel: 'email',
    status: 'pending',
    unread: false,
    messages: [
      { id: 'MSG-006', sender: 'customer', body: 'I was charged twice for my subscription this month.', time: '08:05 AM' },
      { id: 'MSG-007', sender: 'agent', body: 'I see the duplicate charge. I\'ve escalated it to billing for a refund.', time: '08:22 AM' },
      { id: 'MSG-008', sender: 'customer', body: 'Thanks, please let me know once it\'s processed.', time: '08:30 AM' },
    ],
  },
  {
    id: 'CON-004',
    customer: 'Liam Chen',
    initials: 'LC',
    channel: 'messenger',
    status: 'resolved',
    unread: false,
    messages: [
      { id: 'MSG-009', sender: 'customer', body: 'The export feature worked after the update. Thanks!', time: 'Yesterday' },
      { id: 'MSG-010', sender: 'agent', body: 'Glad to hear it, Liam. Have a great day!', time: 'Yesterday' },
    ],
  },
  {
    id: 'CON-005',
    customer: 'Maya Okafor',
    initials: 'MO',
    channel: 'whatsapp',
    status: 'open',
    unread: false,
    messages: [
      { id: 'MSG-011', sender: 'customer', body: 'Can I change the email address on my account?', time: '10:02 AM' },
      { id: 'MSG-012', sender: 'agent', body: 'Of course. I\'ll send a verification link to your new address.', time: '10:04 AM' },
      { id: 'MSG-013', sender: 'customer', body: 'Got it, I\'ll click it now.', time: '10:06 AM' },
    ],
  },
  {
    id: 'CON-006',
    customer: 'Ethan Brooks',
    initials: 'EB',
    channel: 'webchat',
    status: 'pending',
    unread: true,
    messages: [
      { id: 'MSG-014', sender: 'customer', body: 'The dashboard shows a 500 error when I open analytics.', time: 'Yesterday' },
      { id: 'MSG-015', sender: 'agent', body: 'Thanks for the report. Our engineers are looking into it now.', time: 'Yesterday' },
    ],
  },
  {
    id: 'CON-007',
    customer: 'Isabella Moreau',
    initials: 'IM',
    channel: 'email',
    status: 'resolved',
    unread: false,
    messages: [
      { id: 'MSG-016', sender: 'customer', body: 'Please send me the invoice for October.', time: 'Monday' },
      { id: 'MSG-017', sender: 'agent', body: 'Invoice INV-2231 has been sent to your billing email.', time: 'Monday' },
    ],
  },
  {
    id: 'CON-008',
    customer: 'Omar Haddad',
    initials: 'OH',
    channel: 'messenger',
    status: 'open',
    unread: false,
    messages: [
      { id: 'MSG-018', sender: 'customer', body: 'Is the API rate limit per key or per account?', time: '11:18 AM' },
      { id: 'MSG-019', sender: 'agent', body: 'It\'s per key, 100 requests per minute on the Pro plan.', time: '11:21 AM' },
      { id: 'MSG-020', sender: 'customer', body: 'Perfect, that answers it.', time: '11:22 AM' },
    ],
  },
  {
    id: 'CON-009',
    customer: 'Priya Nair',
    initials: 'PN',
    channel: 'whatsapp',
    status: 'pending',
    unread: false,
    messages: [
      { id: 'MSG-021', sender: 'customer', body: 'I\'d like to return one item from order #4790.', time: '09:55 AM' },
      { id: 'MSG-022', sender: 'agent', body: 'Sure, I\'ve emailed you a prepaid return label.', time: '10:01 AM' },
      { id: 'MSG-023', sender: 'customer', body: 'Received, thank you!', time: '10:03 AM' },
    ],
  },
  {
    id: 'CON-010',
    customer: 'Tom Becker',
    initials: 'TB',
    channel: 'webchat',
    status: 'open',
    unread: false,
    messages: [
      { id: 'MSG-024', sender: 'customer', body: 'How do I enable two-factor authentication?', time: '12:31 PM' },
      { id: 'MSG-025', sender: 'agent', body: 'Go to Settings > Security and toggle on 2FA. I can walk you through it.', time: '12:33 PM' },
    ],
  },
]

let conversations: Conversation[] = [...seed]
let counter = seed.reduce((max, conversation) => Math.max(max, Number(conversation.id.replace('CON-', ''))), 0)

const nowTime = () => new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })

export const listConversations = () => [...conversations]
export const getConversation = (id: string) => conversations.find((conversation) => conversation.id === id)
export const replyToConversation = (id: string, body: string) => {
  conversations = conversations.map((conversation) => {
    if (conversation.id !== id) return conversation
    counter += 1
    const message = { id: `MSG-${String(counter).padStart(3, '0')}`, sender: 'agent' as const, body, time: nowTime() }
    return { ...conversation, messages: [...conversation.messages, message], unread: false }
  })
}
export const setConversationStatus = (id: string, status: ConversationStatus) => {
  conversations = conversations.map((conversation) => conversation.id === id ? { ...conversation, status } : conversation)
}
