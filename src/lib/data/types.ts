export type OrderStatus = 'Paid' | 'Pending' | 'Refunded';
export type ProductStatus = 'Active' | 'Draft' | 'Archived';
export type UserRole = 'Admin' | 'Editor' | 'Viewer' | 'Moderator';

export type Order = {
    id: string;
    customer: string;
    customerEmail: string;
    product: string;
    status: OrderStatus;
    amount: number;
    date: string;
};

export type Product = {
    id: string;
    name: string;
    category: string;
    price: number;
    stock: number;
    status: ProductStatus;
    sales: number;
};

export type Customer = {
    id: string;
    name: string;
    email: string;
    company: string;
    orders: number;
    spent: number;
    joined: string;
};

export type Invoice = {
    id: string;
    customer: string;
    date: string;
    dueDate: string;
    amount: number;
    status: 'Paid' | 'Pending' | 'Overdue';
};

export type PosItem = {
    id: string;
    name: string;
    category: 'Coffee' | 'Tea' | 'Food';
    price: number;
    stock: number;
};

export type PosCartLine = {
    item: PosItem;
    quantity: number;
};

export type PosPaymentMethod = 'Cash' | 'Card' | 'QRIS';

export type TransactionStatus = 'Cleared' | 'Pending';
export type TransactionType = 'Income' | 'Expense';

export type FinanceTransaction = {
    id: string;
    date: string;
    description: string;
    category: string;
    type: TransactionType;
    amount: number;
    status: TransactionStatus;
};

export type DealStage = 'new' | 'contacted' | 'qualified' | 'won' | 'lost';

export type Deal = {
    id: string;
    company: string;
    contact: string;
    email: string;
    value: number;
    stage: DealStage;
    owner: string;
    createdAt: string;
};

export type User = {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    status: 'Active' | 'Inactive' | 'Invited' | 'Suspended';
    department: string;
    lastActive: string;
};

export type FileItem = {
    id: string;
    name: string;
    type: 'folder' | 'document' | 'image' | 'spreadsheet';
    size?: string;
    updated: string;
    owner: string;
};

export type EditorDocument = {
    id: string;
    title: string;
    content: string;
    updatedAt: string;
};

export type Notification = {
    id: string;
    title: string;
    description: string;
    time: string;
    read: boolean;
    type: 'order' | 'team' | 'report' | 'system';
};

export type AuthSession = {
    email: string;
    name: string;
    authenticatedAt: string;
};

export type AuthResult =
    | { ok: true; session?: AuthSession }
    | { ok: false; message: 'invalidCredentials' | 'accountExists' | 'invalidEmail' };

export type AssetStatus = 'In Use' | 'Available' | 'Maintenance' | 'Retired';
export type Asset = {
    id: string;
    tag: string;
    name: string;
    category: string;
    assignedTo: string;
    location: string;
    purchaseDate: string;
    warrantyEnd: string;
    value: number;
    status: AssetStatus;
};

export type POStatus = 'Draft' | 'Pending' | 'Approved' | 'Received' | 'Cancelled';
export type PurchaseOrder = {
    id: string;
    number: string;
    supplier: string;
    items: { name: string; qty: number; price: number }[];
    date: string;
    expectedDelivery: string;
    status: POStatus;
};

export type InventoryItem = {
    id: string;
    sku: string;
    name: string;
    warehouse: string;
    onHand: number;
    reserved: number;
    reorderPoint: number;
};

export type SupplierStatus = 'Active' | 'On Hold';
export type Supplier = {
    id: string;
    name: string;
    contact: string;
    email: string;
    phone: string;
    country: string;
    rating: number;
    onTimeRate: number;
    status: SupplierStatus;
};

export type EmployeeStatus = 'Active' | 'On Leave' | 'Remote' | 'Offboarded';
export type Employee = {
    id: string;
    name: string;
    position: string;
    department: string;
    email: string;
    startDate: string;
    status: EmployeeStatus;
};

export type OpenPosition = {
    id: string;
    title: string;
    department: string;
    applicants: number;
    postedAt: string;
};

export type Department = {
    id: string;
    name: string;
    description: string;
    head: string;
    memberCount: number;
    createdAt: string;
};
export type ConversationChannel = 'whatsapp' | 'webchat' | 'email' | 'messenger';
export type ConversationStatus = 'open' | 'pending' | 'resolved';
export type ChatMessage = {
    id: string;
    sender: 'customer' | 'agent';
    body: string;
    time: string;
};
export type Conversation = {
    id: string;
    customer: string;
    initials: string;
    channel: ConversationChannel;
    status: ConversationStatus;
    unread: boolean;
    messages: ChatMessage[];
    customerId: string;
    email: string;
    phone: string;
    location: string;
    segment: string;
    joined: string;
    totalChats: number;
    ticketId?: string;
    ticketSubject?: string;
    ticketPriority?: string;
    ticketCreated?: string;
    ticketDescription?: string;
    ticketCategory?: string;
    ticketType?: string;
    assignee: string;
};

export type TicketInput = {
    subject: string;
    category: string;
    type: string;
    priority: string;
    description: string;
    escalated: boolean;
};
export type SocialPlatform = 'instagram' | 'facebook' | 'x' | 'tiktok' | 'youtube';
export type CommentStatus = 'new' | 'replied' | 'hidden';
export type SocialComment = {
    id: string;
    platform: SocialPlatform;
    username: string;
    initials: string;
    text: string;
    time: string;
    likes: number;
    status: CommentStatus;
    reply?: { username: string; text: string; time: string };
    location: string;
    followers: string;
    joined: string;
};

export type EmailFolder = 'inbox' | 'drafts' | 'sent' | 'archive' | 'trash';
export type EmailView = EmailFolder | 'starred';
export type EmailLabel = 'billing' | 'technical' | 'general' | 'orders';
export type EmailAttachment = { name: string; size: string };
export type EmailReply = { id: string; body: string; time: string };
export type Email = {
    id: string;
    from: { name: string; email: string; initials: string };
    to: string;
    cc?: string;
    bcc?: string;
    subject: string;
    preview: string;
    body: string;
    time: string;
    folder: EmailFolder;
    labels: EmailLabel[];
    unread: boolean;
    starred: boolean;
    attachments?: EmailAttachment[];
    replies?: EmailReply[];
};
