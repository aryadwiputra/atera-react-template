import type { Conversation, ConversationStatus, TicketInput } from './types'

const seed: Conversation[] = [
  {
    id: 'CON-001',
    customer: 'Amelia Hart',
    initials: 'AH',
    channel: 'whatsapp',
    status: 'open',
    unread: true,
    customerId: 'CUS-1042',
    email: 'amelia.hart@example.com',
    phone: '+1 (415) 555-0142',
    location: 'San Francisco, US',
    segment: 'Pro',
    joined: 'Mar 2024',
    totalChats: 12,
    ticketId: 'TKT-4821',
    ticketSubject: 'Order #4821 delivery delay',
    ticketPriority: 'High',
    ticketCreated: 'Today, 09:10 AM',
    ticketDescription: 'Order #4821 was due yesterday and the customer needs it before the weekend.',
    assignee: 'Ayu Pratama',
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
    customerId: 'CUS-1087',
    email: 'noah.patel@example.com',
    phone: '+1 (212) 555-0187',
    location: 'New York, US',
    segment: 'Business',
    joined: 'Jan 2025',
    totalChats: 5,
    assignee: 'Rizky Ananda',
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
    customerId: 'CUS-1023',
    email: 'sofia.reyes@example.com',
    phone: '+34 912 555 023',
    location: 'Madrid, ES',
    segment: 'Pro',
    joined: 'Nov 2023',
    totalChats: 18,
    ticketId: 'TKT-4790',
    ticketSubject: 'Duplicate subscription charge',
    ticketPriority: 'High',
    ticketCreated: 'Today, 08:00 AM',
    ticketDescription: 'Customer was charged twice this month; escalated to billing for a refund.',
    assignee: 'Dana Wijaya',
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
    customerId: 'CUS-1105',
    email: 'liam.chen@example.com',
    phone: '+65 6555 0105',
    location: 'Singapore, SG',
    segment: 'Starter',
    joined: 'Jun 2025',
    totalChats: 3,
    assignee: 'Ayu Pratama',
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
    customerId: 'CUS-1064',
    email: 'maya.okafor@example.com',
    phone: '+44 20 7555 0164',
    location: 'London, UK',
    segment: 'Business',
    joined: 'Aug 2024',
    totalChats: 9,
    ticketId: 'TKT-4815',
    ticketSubject: 'Change account email address',
    ticketPriority: 'Medium',
    ticketCreated: 'Today, 10:00 AM',
    ticketDescription: 'Customer requested an email change; verification link has been sent.',
    assignee: 'Rizky Ananda',
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
    customerId: 'CUS-1092',
    email: 'ethan.brooks@example.com',
    phone: '+1 (312) 555-0192',
    location: 'Chicago, US',
    segment: 'Pro',
    joined: 'Feb 2025',
    totalChats: 6,
    ticketId: 'TKT-4833',
    ticketSubject: 'Analytics dashboard 500 error',
    ticketPriority: 'High',
    ticketCreated: 'Yesterday, 04:20 PM',
    ticketDescription: 'Opening analytics returns a 500 error; engineering is investigating.',
    assignee: 'Dana Wijaya',
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
    customerId: 'CUS-1018',
    email: 'isabella.moreau@example.com',
    phone: '+33 1 55 55 01 18',
    location: 'Paris, FR',
    segment: 'Enterprise',
    joined: 'May 2023',
    totalChats: 24,
    assignee: 'Ayu Pratama',
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
    customerId: 'CUS-1076',
    email: 'omar.haddad@example.com',
    phone: '+971 4 555 0176',
    location: 'Dubai, AE',
    segment: 'Pro',
    joined: 'Sep 2024',
    totalChats: 11,
    assignee: 'Rizky Ananda',
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
    customerId: 'CUS-1039',
    email: 'priya.nair@example.com',
    phone: '+91 22 5555 0139',
    location: 'Mumbai, IN',
    segment: 'Business',
    joined: 'Dec 2023',
    totalChats: 15,
    ticketId: 'TKT-4772',
    ticketSubject: 'Return item from order #4790',
    ticketPriority: 'Low',
    ticketCreated: 'Today, 09:50 AM',
    ticketDescription: 'Customer requested a return; a prepaid return label has been emailed.',
    assignee: 'Dana Wijaya',
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
    customerId: 'CUS-1112',
    email: 'tom.becker@example.com',
    phone: '+49 30 5555 0112',
    location: 'Berlin, DE',
    segment: 'Starter',
    joined: 'Oct 2025',
    totalChats: 2,
    assignee: 'Ayu Pratama',
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
let ticketCounter = seed.reduce((max, conversation) => {
  const value = conversation.ticketId ? Number(conversation.ticketId.replace('TKT-', '')) : 0
  return Math.max(max, value)
}, 0)

export const createConversationTicket = (id: string, input: TicketInput) => {
  conversations = conversations.map((conversation) => {
    if (conversation.id !== id) return conversation
    const isNewTicket = !conversation.ticketId
    if (isNewTicket) ticketCounter += 1
    return {
      ...conversation,
      ticketId: conversation.ticketId ?? `TKT-${ticketCounter}`,
      ticketSubject: input.subject,
      ticketCategory: input.category,
      ticketType: input.type,
      ticketPriority: input.priority,
      ticketDescription: input.description,
      ticketCreated: conversation.ticketId ? conversation.ticketCreated : `Today, ${nowTime()}`,
    }
  })
}

export const setConversationAssignee = (id: string, assignee: string) => {
  conversations = conversations.map((conversation) => conversation.id === id ? { ...conversation, assignee } : conversation)
}
