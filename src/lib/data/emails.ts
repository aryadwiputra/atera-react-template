import type { Email, EmailFolder } from './types';

type SeedEmail = Omit<Email, 'body' | 'replies'> & {
    body: string[];
    replies?: { id: string; body: string; time: string }[];
};

export function htmlToText(html: string): string {
    return html
        .replace(/<[^>]*>/g, ' ')
        .replace(/&nbsp;/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

const paragraphsToHtml = (paragraphs: string[]) =>
    paragraphs.map((paragraph) => `<p>${paragraph}</p>`).join('');

const rawSeed: SeedEmail[] = [
    {
        id: 'E-001',
        from: { name: 'Amelia Hart', email: 'amelia.hart@example.com', initials: 'AH' },
        to: 'demo@example.com',
        subject: 'Order #4821 delivery delay',
        preview: 'Order #4821 was due yesterday and the customer needs it before the weekend.',
        body: [
            'Order #4821 was due yesterday and the customer needs it before the weekend.',
            'The tracking page still shows the package sitting in the local depot. Could you confirm whether the courier has an updated delivery window?',
            'If it cannot arrive by Friday we would prefer to switch to an express shipment and sort out the difference afterwards.',
        ],
        time: '09:14 AM',
        folder: 'inbox',
        labels: ['billing', 'orders'],
        unread: true,
        starred: true,
        attachments: [{ name: 'invoice.pdf', size: '214 KB' }],
        replies: [
            {
                id: 'R-001',
                body: 'I checked with the courier and it will arrive tomorrow morning.',
                time: '09:18 AM',
            },
        ],
    },
    {
        id: 'E-002',
        from: { name: 'Noah Patel', email: 'noah.patel@example.com', initials: 'NP' },
        to: 'demo@example.com',
        subject: 'Team billing question',
        preview: 'Do you offer monthly billing on the annual plan?',
        body: [
            'Do you offer monthly billing on the annual plan?',
            'Our finance team prefers smaller monthly payments, but we still want the annual discount if that is possible.',
            'Let me know what options you can offer for a team of twelve seats.',
        ],
        time: '09:41 AM',
        folder: 'inbox',
        labels: ['billing'],
        unread: true,
        starred: false,
    },
    {
        id: 'E-003',
        from: { name: 'Sofia Reyes', email: 'sofia.reyes@example.com', initials: 'SR' },
        to: 'demo@example.com',
        subject: 'Re: Refund confirmation',
        preview: 'The refund has been processed back to your original payment method.',
        body: [
            'The refund has been processed back to your original payment method.',
            'Depending on your bank it can take three to five business days to appear on your statement.',
            'Thanks again for your patience while we looked into the duplicate charge.',
        ],
        time: '08:26 AM',
        folder: 'inbox',
        labels: ['billing'],
        unread: false,
        starred: true,
        replies: [
            {
                id: 'R-002',
                body: 'Received the refund today, thank you for the quick help.',
                time: '08:30 AM',
            },
        ],
    },
    {
        id: 'E-004',
        from: { name: 'Liam Chen', email: 'liam.chen@example.com', initials: 'LC' },
        to: 'demo@example.com',
        subject: 'API rate limit increase',
        preview: 'We would like to raise our API rate limit for the production key.',
        body: [
            'We would like to raise our API rate limit for the production key.',
            'Since the new integration launched we are regularly hitting the current ceiling during peak hours.',
            'Could you let us know what plan or add-on would give us more headroom?',
        ],
        time: '11:02 AM',
        folder: 'inbox',
        labels: ['technical'],
        unread: true,
        starred: false,
    },
    {
        id: 'E-005',
        from: { name: 'Isabella Moreau', email: 'isabella.moreau@example.com', initials: 'IM' },
        to: 'demo@example.com',
        subject: 'Annual plan invoice',
        preview: 'Here is the invoice for the annual plan covering the next twelve months.',
        body: [
            'Here is the invoice for the annual plan covering the next twelve months.',
            'Please forward it to your accounts payable team so the purchase order can be matched.',
            'Let me know if you need any adjustment to the billing address before the next cycle.',
        ],
        time: 'Yesterday',
        folder: 'inbox',
        labels: ['billing'],
        unread: false,
        starred: false,
        attachments: [{ name: 'invoice-2026.pdf', size: '180 KB' }],
    },
    {
        id: 'E-006',
        from: { name: 'Omar Haddad', email: 'omar.haddad@example.com', initials: 'OH' },
        to: 'demo@example.com',
        subject: 'Dashboard 500 error',
        preview: 'The analytics dashboard returns a 500 error for every user.',
        body: [
            'The analytics dashboard returns a 500 error for every user on our account.',
            'It started this morning right after the scheduled maintenance window.',
            'We have attached nothing to this message because the error page is all we get — happy to share a screen recording if that helps.',
        ],
        time: '11:18 AM',
        folder: 'inbox',
        labels: ['technical'],
        unread: true,
        starred: true,
    },
    {
        id: 'E-007',
        from: { name: 'Tom Becker', email: 'tom.becker@example.com', initials: 'TB' },
        to: 'demo@example.com',
        subject: 'Welcome to Atera',
        preview: 'Welcome aboard! Here are a few tips to get started.',
        body: [
            'Welcome aboard! Here are a few tips to get started.',
            'Start by inviting your team and setting up the dashboards you check most often.',
            'If you get stuck, reply to this email and a real person will help you out.',
        ],
        time: 'Monday',
        folder: 'inbox',
        labels: ['general'],
        unread: false,
        starred: false,
    },
    {
        id: 'E-008',
        from: { name: 'Dana Wijaya', email: 'dana.wijaya@example.com', initials: 'DW' },
        to: 'amelia.hart@example.com',
        subject: 'Draft follow-up',
        preview: 'Just following up on the ticket from last week.',
        body: [
            'Just following up on the ticket from last week.',
            'I want to confirm the replacement arrived safely before we close it out.',
        ],
        time: 'Yesterday',
        folder: 'drafts',
        labels: ['general'],
        unread: false,
        starred: false,
    },
    {
        id: 'E-009',
        from: { name: 'Rizky Ananda', email: 'rizky.ananda@example.com', initials: 'RA' },
        to: 'amelia.hart@example.com',
        subject: 'Your order has shipped',
        preview: 'Your order is on its way and should arrive in two days.',
        body: [
            'Your order is on its way and should arrive in two days.',
            'You will receive a tracking link as soon as the courier scans the parcel.',
        ],
        time: 'Mar 12',
        folder: 'sent',
        labels: ['orders'],
        unread: false,
        starred: false,
    },
    {
        id: 'E-010',
        from: { name: 'Ayu Pratama', email: 'ayu.pratama@example.com', initials: 'AP' },
        to: 'maya.okafor@example.com',
        subject: 'Re: Account email change',
        preview: 'The email on your account has been updated successfully.',
        body: [
            'The email on your account has been updated successfully.',
            'Please use the new address the next time you sign in. Your password is unchanged.',
        ],
        time: 'Mar 10',
        folder: 'sent',
        labels: ['general'],
        unread: false,
        starred: false,
    },
    {
        id: 'E-011',
        from: { name: 'Grace Lin', email: 'grace.lin@example.com', initials: 'GL' },
        to: 'demo@example.com',
        subject: 'Old support thread',
        preview: 'Closing out this thread now that the issue is resolved.',
        body: [
            'Closing out this thread now that the issue is resolved.',
            'If anything else comes up feel free to open a new conversation and we will pick it up from there.',
        ],
        time: 'Feb 28',
        folder: 'archive',
        labels: ['technical'],
        unread: false,
        starred: false,
    },
    {
        id: 'E-012',
        from: { name: 'Marcus Reed', email: 'marcus.reed@example.com', initials: 'MR' },
        to: 'demo@example.com',
        subject: 'Spam offer',
        preview: 'Congratulations, you have been selected for an exclusive offer.',
        body: [
            'Congratulations, you have been selected for an exclusive offer.',
            'Click the link below within the next hour to claim your prize.',
        ],
        time: 'Feb 20',
        folder: 'trash',
        labels: ['general'],
        unread: false,
        starred: false,
    },
];

const seed: Email[] = rawSeed.map(({ body, replies, ...rest }) => ({
    ...rest,
    body: paragraphsToHtml(body),
    replies: replies?.map((reply) => ({ ...reply, body: `<p>${reply.body}</p>` })),
}));

let emails: Email[] = [...seed];

export function listEmails(): Email[] {
    return emails;
}

export function getEmail(id: string): Email | undefined {
    return emails.find((email) => email.id === id);
}

export function setEmailUnread(id: string, unread: boolean): void {
    emails = emails.map((email) => (email.id === id ? { ...email, unread } : email));
}

export function toggleEmailStar(id: string): void {
    emails = emails.map((email) =>
        email.id === id ? { ...email, starred: !email.starred } : email,
    );
}

export function moveEmail(id: string, folder: EmailFolder): void {
    emails = emails.map((email) => (email.id === id ? { ...email, folder } : email));
}

export function replyToEmail(id: string, body: string): void {
    const now = new Date();
    const time = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    emails = emails.map((email) =>
        email.id === id
            ? {
                  ...email,
                  replies: [...(email.replies ?? []), { id: `R-${now.getTime()}`, body, time }],
              }
            : email,
    );
}

export function sendEmail(input: {
    to: string;
    cc?: string;
    bcc?: string;
    subject: string;
    body: string;
}): void {
    const now = new Date();
    emails = [
        {
            id: `E-${now.getTime()}`,
            from: { name: 'Test User', email: 'demo@example.com', initials: 'TU' },
            to: input.to,
            cc: input.cc,
            bcc: input.bcc,
            subject: input.subject,
            preview: htmlToText(input.body).slice(0, 90),
            body: input.body,
            time: now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
            folder: 'sent',
            labels: [],
            unread: false,
            starred: false,
        },
        ...emails,
    ];
}
