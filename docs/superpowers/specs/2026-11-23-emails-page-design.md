# Emails Page Design

**Goal:** Add a dedicated Emails page at `/contact-center/emails` — a three-column team inbox with folders, labels, an email list, a reading pane with reply, and a compose dialog.

**Architecture:** One new page under `/contact-center/*`, backed by a new mock data module (`src/lib/data/emails.ts`) and a thin service (`src/services/email-service.ts`). Same layered pattern as `conversations.ts` / `conversation-service.ts`. Frontend-only, in-memory state, no network calls.

**Tech Stack:** React 19, TypeScript, existing UI primitives (`Card`, `Button`, `Badge`, `Input`, `Textarea`, `Select`, `Dialog`, `Avatar`), lucide-react icons, `PageTransition` + `PageHeader`, `useToast`.

**Spec:** `AGENTS.md` (repo conventions), `src/pages/contact-center/live-chat.tsx` for layout and scroll conventions, `src/pages/mail.tsx` for mail UI reference.

## Global Constraints

- Frontend-only mock data; no backend or persistence.
- Route registered in `src/App.tsx` (protected layout) and `src/lib/navigation.ts`.
- i18n keys in en/de/fr via `src/i18n/index.ts`; reuse existing keys where possible.
- Use existing design tokens only; no hardcoded colors.
- `/mail` and `mailService` stay unchanged.
- Verify with `bun run lint` and `bun run build`.

---

## Route & Navigation

- Route: `/contact-center/emails` → default export `EmailsPage` from `src/pages/contact-center/emails.tsx`.
- Add path to the `explicitPaths` set and the protected route table in `src/App.tsx`.
- Nav item in `src/lib/navigation.ts`, group `contact-center`:
  `{ title: 'Emails', href: '/contact-center/emails', icon: Mail, group: 'contact-center', keywords: ['email', 'inbox', 'mail'], translationKey: 'emails' }`
- Existing `/mail` page and nav item are untouched.

## Data Model (`src/lib/data/types.ts`)

```typescript
export type EmailFolder = 'inbox' | 'drafts' | 'sent' | 'archive' | 'trash'
export type EmailView = EmailFolder | 'starred'
export type EmailLabel = 'billing' | 'technical' | 'general' | 'orders'

export type EmailAttachment = {
  name: string
  size: string
}

export type EmailReply = {
  id: string
  body: string
  time: string
}

export type Email = {
  id: string
  from: { name: string; email: string; initials: string }
  to: string
  subject: string
  preview: string
  body: string[]
  time: string
  folder: EmailFolder
  labels: EmailLabel[]
  unread: boolean
  starred: boolean
  attachments?: EmailAttachment[]
  replies?: EmailReply[]
}
```

`starred` is a virtual view: emails with `starred === true` from any folder except `trash`.

## Mock Data (`src/lib/data/emails.ts`)

- Seed 12 emails across `inbox`, `sent`, `drafts`, `archive`; 3 starred; 4 unread; mixed labels; 2 with attachments; 2 with existing replies.
- Mutable module-level array plus exported functions:
  - `listEmails(): Email[]`
  - `getEmail(id: string): Email | undefined`
  - `markEmailRead(id: string, read: boolean): void`
  - `toggleEmailStar(id: string): void`
  - `moveEmail(id: string, folder: EmailFolder): void`
  - `replyToEmail(id: string, body: string): void` — appends to `replies` with a generated id and display time, marks read.
  - `sendEmail(input: { to: string; subject: string; body: string }): void` — prepends a new email to `sent` with sender `Atera Support`, `unread: false`, `starred: false`, `labels: []`.

## Service (`src/services/email-service.ts`)

```typescript
export interface EmailService {
  list(): Email[]
  get(id: string): Email | undefined
  markRead(id: string, read: boolean): void
  toggleStar(id: string): void
  move(id: string, folder: EmailFolder): void
  reply(id: string, body: string): void
  send(input: { to: string; subject: string; body: string }): void
}

export const emailService: EmailService = { /* thin wrappers over data module */ }
```

## Page (`src/pages/contact-center/emails.tsx`)

### State

- `selectedId: string | null`
- `search: string`
- `folderView: EmailView` — default `'inbox'`
- `labelFilter: EmailLabel | 'all'` — default `'all'`
- reply `draft: string`
- compose state: `composeOpen: boolean`, `composeTo`, `composeSubject`, `composeBody`
- `useReducer` counters for mock mutations (`force()`)

### Derived list

`emailService.list()` filtered by:

1. Folder: `folderView === 'starred'` → `starred && folder !== 'trash'`; otherwise `email.folder === folderView`.
2. Label: skip when `labelFilter === 'all'`, else `labels.includes(labelFilter)`.
3. Search: case-insensitive match on `from.name`, `from.email`, `subject`, `preview`.

Unread count per folder comes from the same source (Inbox shows unread count).

### Layout

Desktop (`md+`) three columns inside:

```tsx
<Card className="overflow-hidden py-0 md:h-[calc(100svh-15rem)] md:min-h-[520px]">
  <div className="grid min-h-[560px] md:h-full md:min-h-0 md:grid-cols-[200px_340px_minmax(0,1fr)]">
```

- **Column 1 — folders/labels** (`hidden md:flex min-h-0 flex-col border-r bg-muted/20`):
  - `h-14` header `t('folders')`.
  - Folder buttons: Inbox, Starred, Drafts, Sent, Archive, Trash with icon, label, optional unread count Badge; active `bg-accent text-accent-foreground`.
  - Divider, then `t('labels')` heading and label rows with a `bg-chart-*` dot, label name, count.
  - Content scrolls with `chat-scroll`.
- **Column 2 — list** (`flex min-h-0 flex-col border-r`):
  - `h-14` header with `t('inbox')`-style title/count and `md:hidden` back-free layout.
  - Mobile folder chip row (`md:hidden`) horizontally scrollable using the same folder buttons.
  - Search `Input` with `Search` icon, placeholder `t('searchEmails')`.
  - List scroller: `chat-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain`.
  - Item (`button`, full width): Avatar initials, sender name, time, subject, 2-line preview, star icon button (stops propagation), unread dot. Selected → `bg-accent`; unread → `font-semibold`.
  - Empty state with icon, `t('noEmails')`, and `t('resetFilters')` button clearing search/label/folder.
- **Column 3 — reading pane** (`flex min-h-0 flex-col`):
  - Empty: centered `t('selectEmail')`.
  - Header `h-14`: mobile Back button (`md:hidden`, clears `selectedId`), subject, action icon buttons with `aria-label`: star/unstar, mark read/unread, archive, trash.
  - Body scroller: `chat-scroll min-h-0 flex-1 overflow-y-auto p-4` — sender block (avatar, name, email), timestamp, `body` paragraphs, attachment chips, replies separated by `Separator`.
  - Reply composer pinned at bottom: `Textarea` + Send `Button`; Enter sends, Shift+Enter newline; disabled when draft is empty.

Mobile: `grid-cols-1`; when an email is selected, hide the list and show the reading pane (Back returns to list). Folder chips live in the list column.

### Interactions

- Select email → `markEmailRead(id, true)` + `force()`.
- Star / unread / archive / trash → service call + `force()`; archive/trash also move the email and clear `selectedId` if it was selected.
- Reply → `emailService.reply(id, draft)` + `force()` + clear draft + toast `t('emailSent')`.
- Compose Dialog (`Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogFooter`): To, Subject, Message (`Textarea`, `messagePlaceholder`), Cancel + Send. Send requires non-empty to/subject/body; calls `emailService.send(...)`, closes, resets fields, switches `folderView` to `'sent'`, toasts `t('emailSent')`.

## i18n

Reuse existing keys: `inbox`, `billing`, `technical`, `general`, `orders`, `compose`, `to`, `reply`, `selectEmail`, `subject`, `send`, `cancel`, `unread`, `resetFilters`, `messagePlaceholder`, `status`.

Add new keys (en / de / fr):

| Key | en | de | fr |
|---|---|---|---|
| `emails` | Emails | E-Mails | E-mails |
| `emailsDescription` | Manage your team inbox and email threads. | Verwalte dein Team-Postfach und E-Mail-Threads. | Gérez votre boîte de réception d’équipe et vos fils d’e-mails. |
| `folders` | Folders | Ordner | Dossiers |
| `labels` | Labels | Labels | Libellés |
| `starred` | Starred | Markiert | Suivis |
| `drafts` | Drafts | Entwürfe | Brouillons |
| `sentFolder` | Sent | Gesendet | Envoyés |
| `archive` | Archive | Archiv | Archives |
| `trash` | Trash | Papierkorb | Corbeille |
| `markRead` | Mark as read | Als gelesen markieren | Marquer comme lu |
| `markUnread` | Mark as unread | Als ungelesen markieren | Marquer comme non lu |
| `composeEmail` | New email | Neue E-Mail | Nouvel e-mail |
| `emailSent` | Email sent successfully. | E-Mail erfolgreich gesendet. | E-mail envoyé avec succès. |
| `noEmails` | No emails found. | Keine E-Mails gefunden. | Aucun e-mail trouvé. |
| `searchEmails` | Search emails... | E-Mails durchsuchen... | Rechercher des e-mails... |
| `back` | Back | Zurück | Retour |

Do not re-add `unread` or `resetFilters` — both already exist.

## Files Changed

- `src/lib/data/types.ts` — email types.
- `src/lib/data/emails.ts` — new mock module.
- `src/services/email-service.ts` — new service.
- `src/pages/contact-center/emails.tsx` — new page.
- `src/App.tsx` — import, `explicitPaths`, route.
- `src/lib/navigation.ts` — nav item.
- `src/i18n/index.ts` — new keys in all three locales.

## Out of Scope

- No changes to `/mail`, `mailService`, or `mail.ts`.
- No bulk selection / bulk actions.
- No email templates, scheduled send, or multi-route email suite.
- No drafts autosave or persistence.

## Verification

1. `bun run lint` — no new warnings.
2. `bun run build` — succeeds.
3. Manual check at `/contact-center/emails` with demo login:
   - Folder switching, label filter, search, empty state + reset.
   - Select email marks it read; star/unread/archive/trash work.
   - Reply appends and clears composer; toast shows.
   - Compose dialog sends, switches to Sent, new email present.
   - Mobile width: list/detail swap and Back button.
