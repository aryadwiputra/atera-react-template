export type MailMessage = {
  id: string
  sender: string
  initials: string
  subject: string
  preview: string
  body: string
  time: string
  unread: boolean
  starred: boolean
}

const mailbox: MailMessage[] = [
  { id: 'MSG-001', sender: 'Olivia Martin', initials: 'OM', subject: 'Weekly report is ready', preview: 'Here is the latest update for your workspace.', body: 'Hi there,\n\nThe weekly report is now available. Revenue is up 12.5% and we are ahead of target on all key metrics.\n\nBest,\nOlivia', time: '10:42 AM', unread: true, starred: false },
  { id: 'MSG-002', sender: 'Jackson Lee', initials: 'JL', subject: 'New order received', preview: 'A new order #ORD-7291 was placed.', body: 'Hello,\n\nOrder #ORD-7291 was placed a few minutes ago. The customer chose the Pro subscription plan.\n\nThanks,\nJackson', time: '9:15 AM', unread: true, starred: true },
  { id: 'MSG-003', sender: 'Sofia Chen', initials: 'SC', subject: 'Customer feedback', preview: 'We received great feedback from the design review.', body: 'Hi,\n\nThe design review went well. Customers loved the new dashboard layout.\n\nSofia', time: 'Yesterday', unread: false, starred: false },
]

export const listMail = () => [...mailbox]

export const markMailRead = (id: string) => {
  const message = mailbox.find((mail) => mail.id === id)
  if (message) message.unread = false
}

export const sendMail = (input: { to: string; subject: string; body: string }) => {
  mailbox.unshift({
    id: `MSG-${String(mailbox.length + 1).padStart(3, '0')}`,
    sender: input.to,
    initials: input.to.split(' ').map((part) => part[0]).join(''),
    subject: input.subject,
    preview: input.body.slice(0, 80),
    body: input.body,
    time: 'Just now',
    unread: false,
    starred: false,
  })
}
