# Emails Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a 3-column Emails inbox at `/contact-center/emails` with folders/labels, searchable list, reading pane with reply, and a compose dialog — backed by a new mock data module and service, without touching `/mail`.

**Architecture:** Route page composed of three scroll-isolated columns inside one Card. State lives in the page with `useReducer`-based `force()` refresh (same pattern as `live-chat.tsx`). Data flows page → `emailService` → `src/lib/data/emails.ts` in-memory store.

**Tech Stack:** React 19, TypeScript 7, Vite 8, Tailwind v4, existing shadcn-style `src/components/ui/*`, lucide-react.

**Spec:** `docs/superpowers/specs/2026-11-23-emails-page-design.md`

## Global Constraints

- No new dependencies; use existing UI primitives and lucide icons.
- No hardcoded colors — only design tokens (`bg-muted`, `text-muted-foreground`, `bg-primary`, etc.).
- Imports use the `@/*` alias.
- Package manager is Bun; verify with `bun run lint` and `bun run build`.
- No test framework exists in this repo — do NOT add one. Verification = lint, build, manual browser check.
- Do NOT commit; the repo requires an explicit commit request.
- `/mail` page, `mailService`, and `src/lib/data/mail.ts` stay untouched.
- Do not re-add existing i18n keys (`inbox`, `billing`, `technical`, `general`, `orders`, `compose`, `to`, `reply`, `selectEmail`, `subject`, `send`, `cancel`, `unread`, `resetFilters`, `messagePlaceholder`, `status`).

---

### Task 1: Types, mock store, and service

**Files:**
- Modify: `src/lib/data/types.ts` (append at end of file)
- Create: `src/lib/data/emails.ts`
- Create: `src/services/email-service.ts`

**Interfaces:**
- Produces for later tasks: `Email`, `EmailFolder`, `EmailView`, `EmailLabel`, `EmailAttachment`, `EmailReply` types; `emailService` with `list(): Email[]`, `get(id: string): Email | undefined`, `markRead(id: string, unread: boolean): void`, `toggleStar(id: string): void`, `move(id: string, folder: EmailFolder): void`, `reply(id: string, body: string): void`, `send(input: { to: string; subject: string; body: string }): void`.

- [ ] **Step 1: Append types**

Append to `src/lib/data/types.ts`:

```ts
export type EmailFolder = 'inbox' | 'drafts' | 'sent' | 'archive' | 'trash'
export type EmailView = EmailFolder | 'starred'
export type EmailLabel = 'billing' | 'technical' | 'general' | 'orders'
export type EmailAttachment = { name: string; size: string }
export type EmailReply = { id: string; body: string; time: string }
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

- [ ] **Step 2: Create the mock store**

Create `src/lib/data/emails.ts` with a module-level `let emails: Email[]` seeded with exactly these 12 records (fill `body` with 2–3 short paragraphs and `preview` from the first sentence; times are display strings):

| id | from (name / email / initials) | subject | folder | labels | unread | starred | extras |
|---|---|---|---|---|---|---|---|
| E-001 | Amelia Hart / amelia.hart@example.com / AH | Order #4821 delivery delay | inbox | billing, orders | yes | yes | attachment `invoice.pdf` / 214 KB; 1 reply |
| E-002 | Noah Patel / noah.patel@example.com / NP | Team billing question | inbox | billing | yes | no | — |
| E-003 | Sofia Reyes / sofia.reyes@example.com / SR | Re: Refund confirmation | inbox | billing | no | yes | 1 reply |
| E-004 | Liam Chen / liam.chen@example.com / LC | API rate limit increase | inbox | technical | yes | no | — |
| E-005 | Isabella Moreau / isabella.moreau@example.com / IM | Annual plan invoice | inbox | billing | no | no | attachment `invoice-2026.pdf` / 180 KB |
| E-006 | Omar Haddad / omar.haddad@example.com / OH | Dashboard 500 error | inbox | technical | yes | yes | — |
| E-007 | Tom Becker / tom.becker@example.com / TB | Welcome to Atera | inbox | general | no | no | — |
| E-008 | Dana Wijaya / dana.wijaya@example.com / DW | Draft follow-up | drafts | general | no | no | — |
| E-009 | Rizky Ananda / rizky.ananda@example.com / RA | Your order has shipped | sent | orders | no | no | — |
| E-010 | Ayu Pratama / ayu.pratama@example.com / AP | Re: Account email change | sent | general | no | no | — |
| E-011 | Grace Lin / grace.lin@example.com / GL | Old support thread | archive | technical | no | no | — |
| E-012 | Marcus Reed / marcus.reed@example.com / MR | Spam offer | trash | general | no | no | — |

Add module functions exactly:

```ts
export function listEmails(): Email[] {
  return emails
}

export function getEmail(id: string): Email | undefined {
  return emails.find((email) => email.id === id)
}

export function setEmailUnread(id: string, unread: boolean): void {
  emails = emails.map((email) => (email.id === id ? { ...email, unread } : email))
}

export function toggleEmailStar(id: string): void {
  emails = emails.map((email) => (email.id === id ? { ...email, starred: !email.starred } : email))
}

export function moveEmail(id: string, folder: EmailFolder): void {
  emails = emails.map((email) => (email.id === id ? { ...email, folder } : email))
}

export function replyToEmail(id: string, body: string): void {
  const now = new Date()
  const time = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  emails = emails.map((email) =>
    email.id === id
      ? { ...email, replies: [...(email.replies ?? []), { id: `R-${now.getTime()}`, body, time }] }
      : email,
  )
}

export function sendEmail(input: { to: string; subject: string; body: string }): void {
  const now = new Date()
  emails = [
    {
      id: `E-${now.getTime()}`,
      from: { name: 'Test User', email: 'demo@example.com', initials: 'TU' },
      to: input.to,
      subject: input.subject,
      preview: input.body.slice(0, 90),
      body: input.body.split('\n').filter(Boolean),
      time: now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      folder: 'sent',
      labels: [],
      unread: false,
      starred: false,
    },
    ...emails,
  ]
}
```

Import `type { Email, EmailFolder } from './types'` at the top.

- [ ] **Step 3: Create the service**

Create `src/services/email-service.ts`:

```ts
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
```

- [ ] **Step 4: Verify**

Run: `bun run lint`
Expected: no new warnings in the three files.

Run: `bun run build`
Expected: `✓ built in ...` with only the pre-existing Vite configLoader/chunk-size warnings.

---

### Task 2: Route, navigation, translations

**Files:**
- Modify: `src/App.tsx` (import block near line 60; `explicitPaths` line ~75; route list near line 97)
- Modify: `src/lib/navigation.ts` (contact-center items near lines 49-50)
- Modify: `src/i18n/index.ts` (three locale blocks)

**Interfaces:**
- Consumes: page default export from Task 3 (`EmailsPage`).
- Produces: `/contact-center/emails` route and nav entry; i18n keys used by Tasks 3–5.

- [ ] **Step 1: Add i18n keys**

Insert after the existing `noTicket` key in the `contactCenter` section of each locale (en ~line 814, de ~1627, fr ~2443):

```ts
emails: 'Emails',
emailsDescription: 'Manage your email inbox and replies.',
folders: 'Folders',
labels: 'Labels',
starred: 'Starred',
drafts: 'Drafts',
sentFolder: 'Sent',
archive: 'Archive',
trash: 'Trash',
markRead: 'Mark as read',
markUnread: 'Mark as unread',
composeEmail: 'New email',
emailSent: 'Email sent',
noEmails: 'No emails found',
searchEmails: 'Search emails',
back: 'Back',
```

German values: `E-Mails`, `Verwalte dein E-Mail-Postfach und Antworten.`, `Ordner`, `Labels`, `Markiert`, `Entwürfe`, `Gesendet`, `Archiv`, `Papierkorb`, `Als gelesen markieren`, `Als ungelesen markieren`, `Neue E-Mail`, `E-Mail gesendet`, `Keine E-Mails gefunden`, `E-Mails suchen`, `Zurück`.

French values: `E-mails`, `Gérez votre boîte e-mail et vos réponses.`, `Dossiers`, `Étiquettes`, `Suivis`, `Brouillons`, `Envoyés`, `Archive`, `Corbeille`, `Marquer comme lu`, `Marquer comme non lu`, `Nouvel e-mail`, `E-mail envoyé`, `Aucun e-mail trouvé`, `Rechercher des e-mails`, `Retour`.

- [ ] **Step 2: Add nav item**

In `src/lib/navigation.ts`, after the Social Comments item:

```ts
{ title: 'Emails', href: '/contact-center/emails', icon: Mail, group: 'contact-center', keywords: ['email', 'inbox', 'emails'], translationKey: 'emails' },
```

`Mail` is already imported in that file.

- [ ] **Step 3: Add route**

In `src/App.tsx`:
- import: `import EmailsPage from '@/pages/contact-center/emails'`
- add `'/contact-center/emails'` to `explicitPaths`
- add `{ path: '/contact-center/emails', element: <EmailsPage /> }` after the social-comments route.

- [ ] **Step 4: Verify**

Run: `bun run lint` then `bun run build`.
Expected: no new warnings, build succeeds. (The page import will not compile yet — create a minimal placeholder page in Task 3 Step 1 before running this task's verify if executing strictly in order.)

---

### Task 3: Page shell — folders, list, selection

**Files:**
- Create: `src/pages/contact-center/emails.tsx`

**Interfaces:**
- Consumes: `emailService`, types, `useTranslations`, i18n keys from Task 2.
- Produces: `EmailsPage` default export; state `view`, `labelFilter`, `selectedId`, `search`, and derived `filtered` used by Task 4/5.

- [ ] **Step 1: Create the page with module-scope helpers**

Create `src/pages/contact-center/emails.tsx`. Required imports:

```ts
import { useMemo, useReducer, useState } from 'react'
import { Archive, ArrowLeft, FileText, Inbox as InboxIcon, Mail, Plus, Reply, Search, Send, Star, StarOff, Trash2, MailOpen } from 'lucide-react'
import { PageHeader } from '@/components/shared/page-header'
import { PageTransition } from '@/components/shared/page-transition'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useCustomizePreferences } from '@/hooks/use-customize-preferences'
import { useToast } from '@/components/shared/toast'
import { useTranslations, type Translator } from '@/i18n'
import { emailService } from '@/services/email-service'
import type { Email, EmailLabel, EmailView } from '@/lib/data/types'
import { cn } from '@/lib/utils'
```

On i18n: the email keys live in the `contactCenter` section. The page must read them through the existing `useTranslations` translator. If the translator type does not include the new keys until the i18n object is updated, cast the key at call sites exactly like `live-chat.tsx` does for dynamic status keys: `t('emails' as never)` is NOT acceptable — instead confirm `TranslationKey` is `keyof typeof translations.en`; adding the keys in Task 2 makes them valid keys automatically.

Add module-scope constants:

```ts
const folderViews: { value: EmailView; label: 'inbox' | 'starred' | 'drafts' | 'sentFolder' | 'archive' | 'trash'; icon: typeof InboxIcon }[] = [
  { value: 'inbox', label: 'inbox', icon: InboxIcon },
  { value: 'starred', label: 'starred', icon: Star },
  { value: 'drafts', label: 'drafts', icon: FileText },
  { value: 'sent', label: 'sentFolder', icon: Send },
  { value: 'archive', label: 'archive', icon: Archive },
  { value: 'trash', label: 'trash', icon: Trash2 },
]

const labelOptions: { value: EmailLabel; label: 'billing' | 'technical' | 'general' | 'orders'; dot: string }[] = [
  { value: 'billing', label: 'billing', dot: 'bg-chart-1' },
  { value: 'technical', label: 'technical', dot: 'bg-chart-2' },
  { value: 'general', label: 'general', dot: 'bg-chart-3' },
  { value: 'orders', label: 'orders', dot: 'bg-chart-4' },
]
```

Add module-scope `FolderRail` and `EmailList` components taking props `{ view, labelFilter, search, onViewChange, onLabelChange, onSearchChange, selectedId, onSelect, onReset, t }`. `FolderRail` renders `<aside className="chat-scroll hidden min-h-0 flex-col overflow-y-auto border-b bg-muted/20 md:flex md:border-r md:border-b-0">` with an `h-14` header (`t('folders')`), folder buttons (active: `bg-accent text-accent-foreground`, inactive: `text-muted-foreground hover:bg-accent/60`), then a `t('labels')` subheader and label buttons with the colored `dot` span. Below `md`, render the same folders as a horizontal chip row inside the list column instead (see Step 2).

`EmailList` renders `<section className="flex min-h-0 flex-col border-b md:border-b-0">` with:
- `h-14` header: `t('inbox')` title, count `Badge variant="secondary"`, reset `Button variant="ghost" size="icon"` with `X` icon (import `X`) and `aria-label={t('resetFilters')}`.
- filter block `border-b p-3`: search `Input` with `Search` icon absolutely positioned left (`pl-8`), placeholder `t('searchEmails')`.
- mobile folder chips: `<div className="flex gap-1 overflow-x-auto pb-1 md:hidden">` mapping `folderViews` to pill buttons (`aria-pressed`).
- list `<div className="chat-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain">`; each email is a `button type="button"` with `className={cn('flex w-full items-start gap-3 border-b px-3 py-3 text-left hover:bg-accent/50', selectedId === email.id && 'bg-accent')}`. Contents: avatar 9x9 initials, sender name + time row, subject (`font-medium`, unread emails `font-semibold`), 2-line preview (`line-clamp-2 text-xs text-muted-foreground`), star icon button rendered as a `<span role="button">` is NOT allowed inside a button — instead put the star action as a sibling absolutely-positioned button or omit per-item star action in the list and keep starring in the reading pane. Keep it simple: show a static `Star` icon when `email.starred` and an unread dot when `email.unread`; starring happens in the reading pane.
- empty state: centered icon + `t('noEmails')` + reset button.

- [ ] **Step 2: Page component state and layout**

```tsx
export default function EmailsPage() {
  const { language } = useCustomizePreferences()
  const t = useTranslations(language)
  const { toast } = useToast()
  const [, force] = useReducer((x) => x + 1, 0)
  const [view, setView] = useState<EmailView>('inbox')
  const [labelFilter, setLabelFilter] = useState<EmailLabel | 'all'>('all')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [replyDraft, setReplyDraft] = useState('')
  const [composeOpen, setComposeOpen] = useState(false)
  const [compose, setCompose] = useState({ to: '', subject: '', body: '' })

  const emails = emailService.list()
  const selected = selectedId ? emailService.get(selectedId) ?? null : null
  const query = search.trim().toLowerCase()

  const filtered = useMemo(
    () =>
      emails.filter((email) => {
        const matchesView = view === 'starred' ? email.starred && email.folder !== 'trash' : email.folder === view
        const matchesLabel = labelFilter === 'all' || email.labels.includes(labelFilter)
        const matchesQuery =
          !query ||
          email.from.name.toLowerCase().includes(query) ||
          email.from.email.toLowerCase().includes(query) ||
          email.subject.toLowerCase().includes(query) ||
          email.preview.toLowerCase().includes(query)
        return matchesView && matchesLabel && matchesQuery
      }),
    [emails, view, labelFilter, query],
  )

  const selectEmail = (id: string) => {
    setSelectedId(id)
    emailService.markRead(id, false)
    force()
  }

  const resetFilters = () => {
    setSearch('')
    setLabelFilter('all')
    setView('inbox')
  }

  return (
    <PageTransition>
      <PageHeader
        title={t('emails')}
        description={t('emailsDescription')}
        breadcrumbs={[{ label: 'Contact Center' }, { label: t('emails') }]}
        actions={
          <Button size="sm" onClick={() => setComposeOpen(true)}>
            <Plus className="size-4" />
            {t('composeEmail')}
          </Button>
        }
      />
      <Card className="overflow-hidden py-0 md:h-[calc(100svh-15rem)] md:min-h-[520px]">
        <div className="grid min-h-[560px] md:h-full md:min-h-0 md:grid-cols-[200px_340px_minmax(0,1fr)]">
          <FolderRail ... />
          <EmailList ... className={cn(selected && 'hidden md:flex')} />
          {selected ? <ReadingPane ... /> : <EmptyReadingPane t={t} />}
        </div>
      </Card>
    </PageTransition>
  )
}
```

`PageHeader` props in this repo: check `src/components/shared/page-header.tsx` before writing and match its actual prop names (`title`, `description`, `breadcrumbs`, `actions` are the established pattern; if `breadcrumbs` expects `{ label, href? }`, use that shape).

- [ ] **Step 3: Verify**

Run: `bun run lint`, `bun run build`.
Expected: build succeeds; page renders list and folders at `/contact-center/emails` (detail pane may be a stub until Task 4).

---

### Task 4: Reading pane, actions, replies

**Files:**
- Modify: `src/pages/contact-center/emails.tsx`

**Interfaces:**
- Consumes: `selected`, `t`, `replyDraft`, `setReplyDraft`, `force`, `toast`.
- Produces: `ReadingPane` module-scope component used by the page.

- [ ] **Step 1: Add `ReadingPane` and `EmptyReadingPane`**

`ReadingPane` is a module-scope component with props `{ email: Email; replyDraft: string; onReplyDraftChange: (value: string) => void; onReply: () => void; onStar: () => void; onToggleUnread: () => void; onArchive: () => void; onTrash: () => void; onBack: () => void; t: Translator }`.

Structure:
- `<section className="flex min-h-0 flex-col">`
- `h-14` header: mobile back `Button variant="ghost" size="icon" className="md:hidden"` with `ArrowLeft` + `aria-label={t('back')}`; subject truncated `font-semibold`; right-side icon buttons with `aria-label` + `title`: star (`Star` filled when starred / `StarOff`), mark read/unread (`MailOpen`), archive (`Archive`), trash (`Trash2`).
- `chat-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain p-4`: sender block (avatar 10x10, name, email, time), subject as `h2 text-lg font-semibold`, body paragraphs `text-sm leading-relaxed text-foreground/90`, attachments as bordered chips with `FileText` + name + size, then a `border-t pt-4` replies list (`t('reply')` header + each reply body/time).
- Reply composer pinned at bottom: `border-t p-3` with `Textarea rows={2} className="min-h-16 resize-none"` placeholder `t('messagePlaceholder')`, `Button size="sm"` `Send` icon + `t('send')` disabled when `trim()` empty; `onKeyDown` Enter (without Shift) calls `onReply` and prevents default.
- `EmptyReadingPane`: `<section className="hidden min-h-0 flex-1 flex-col md:flex">` with centered `Mail` icon and `t('selectEmail')`.

- [ ] **Step 2: Wire handlers**

In `EmailsPage` add:

```ts
const reply = () => {
  if (!selected || !replyDraft.trim()) return
  emailService.reply(selected.id, replyDraft.trim())
  setReplyDraft('')
  force()
}

const toggleStar = () => {
  if (!selected) return
  emailService.toggleStar(selected.id)
  force()
}

const toggleUnread = () => {
  if (!selected) return
  emailService.markRead(selected.id, !selected.unread)
  force()
}

const archive = () => {
  if (!selected) return
  emailService.move(selected.id, 'archive')
  setSelectedId(null)
  force()
}

const trash = () => {
  if (!selected) return
  emailService.move(selected.id, 'trash')
  setSelectedId(null)
  force()
}
```

Pass them to `ReadingPane`. Selecting an email from the list keeps `replyDraft` from the previous email — clear it inside `selectEmail`: `setReplyDraft('')`.

- [ ] **Step 3: Verify**

Run: `bun run lint`, `bun run build`.
Manual: open an inbox email → marked read; toggle star; reply appends under the body; archive/trash removes it from the current list and returns to empty pane; mobile width shows Back button.

---

### Task 5: Compose dialog and final polish

**Files:**
- Modify: `src/pages/contact-center/emails.tsx`

**Interfaces:**
- Consumes: `composeOpen`, `compose`, `setCompose`, `toast`, `t`.
- Produces: working compose flow and final responsive/empty states.

- [ ] **Step 1: Add send handler**

```ts
const canSend = compose.to.trim() !== '' && compose.subject.trim() !== '' && compose.body.trim() !== ''

const sendCompose = () => {
  if (!canSend) return
  emailService.send({ to: compose.to.trim(), subject: compose.subject.trim(), body: compose.body.trim() })
  setCompose({ to: '', subject: '', body: '' })
  setComposeOpen(false)
  setView('sent')
  setSelectedId(null)
  force()
  toast({ title: t('emailSent'), variant: 'success' })
}
```

- [ ] **Step 2: Add the Dialog**

Render after the Card:

```tsx
<Dialog open={composeOpen} onOpenChange={setComposeOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>{t('composeEmail')}</DialogTitle>
    </DialogHeader>
    <div className="grid gap-3">
      <label className="grid gap-2 text-sm font-medium">
        {t('to')}
        <Input value={compose.to} onChange={(e) => setCompose({ ...compose, to: e.target.value })} placeholder="name@example.com" />
      </label>
      <label className="grid gap-2 text-sm font-medium">
        {t('subject')}
        <Input value={compose.subject} onChange={(e) => setCompose({ ...compose, subject: e.target.value })} />
      </label>
      <label className="grid gap-2 text-sm font-medium">
        {t('messagePlaceholder')}
        <Textarea rows={5} className="resize-none" value={compose.body} onChange={(e) => setCompose({ ...compose, body: e.target.value })} />
      </label>
    </div>
    <DialogFooter>
      <Button variant="outline" onClick={() => setComposeOpen(false)}>{t('cancel')}</Button>
      <Button onClick={sendCompose} disabled={!canSend}>
        <Send className="size-4" />
        {t('send')}
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

- [ ] **Step 3: Mobile polish**

- List column: `className={cn('flex min-h-0 flex-col border-b md:border-b-0', selected && 'hidden md:flex')}`.
- Reading pane effectively replaces the list below `md` because the list is hidden when `selected` is set; Back clears `selectedId`.
- Ensure folder chips (mobile) still set `view` and clear `selectedId`.

- [ ] **Step 4: Final verification**

Run: `bun run lint` → only pre-existing warnings.
Run: `bun run build` → success.
Manual with `bun run dev`:
1. `/contact-center/emails` → 7 inbox emails, folders show counts.
2. Select E-001 → unread dot disappears; star toggles; reply adds a reply; archive moves it and the list count drops.
3. Compose → fill all three fields → Send → switches to Sent, new email is first, toast `Email sent`.
4. Resize below `md` → folder chips, list, detail swap with Back; no horizontal overflow.
5. `git status --short` → only intended files changed; no commit.

---

## Self-Review Notes

- Spec coverage: types/store/service (Task 1), route/nav/i18n (Task 2), 3-column shell + folders + list (Task 3), reading pane + actions + replies (Task 4), compose + mobile + verification (Task 5). Out-of-scope items from the spec are absent.
- Type names are consistent across tasks: `EmailView`, `EmailFolder`, `EmailLabel`, `Email`, `EmailService`.
- No commit steps by design (repo rule).
- If `PageHeader` or `Dialog` prop names differ, adjust to the component's actual API instead of inventing props.
