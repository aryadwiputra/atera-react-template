# Omnichannel Contact Center Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build two contact-center pages — agent live chat (inbox 3-column) and social media comment management (flat reply feed) — on mock data.

**Architecture:** Two new data modules + services (`conversations`, `social-comments`), two page components under `src/pages/contact-center/`, wired into protected routes, a new `contact-center` navigation group, and i18n keys in en/de/fr. UI follows existing `chat.tsx`/`mail.tsx` patterns with the repo's UI primitives.

**Tech Stack:** React 19, TypeScript, Tailwind v4 tokens, Radix-based `src/components/ui/` (badge, button, card, input, select, avatar), lucide-react, `cn()`.

**Spec:** `docs/superpowers/specs/2026-11-22-omnichannel-contact-center-design.md`

## Global Constraints
- Frontend-only mock data; no backend calls.
- Routes registered in `src/App.tsx` (protected layout) + `src/lib/navigation.ts`.
- i18n keys in en/de/fr via `src/i18n/index.ts`.
- Status colors use existing `status-success` / `status-warning` / `status-danger` / muted tokens, not ad-hoc colors.
- Platform icons (no brand icons in lucide): Instagram `Camera`, Facebook `ThumbsUp`, X `AtSign`, TikTok `Music2`, YouTube `Play`.
- Verify each task with `bun run build` (tsc -b && vite build) and `bun run lint` (0 errors; pre-existing warnings acceptable).

---

## File Structure

| File | Responsibility |
|---|---|
| `src/lib/data/conversations.ts` | Conversation + ChatMessage types (re-exported from types.ts), seed data, CRUD (list/get/reply/setStatus) |
| `src/lib/data/social-comments.ts` | SocialComment type, seed data, CRUD (list/reply/toggleHidden) |
| `src/services/conversation-service.ts` | Typed service over conversations data |
| `src/services/social-comment-service.ts` | Typed service over social-comments data |
| `src/pages/contact-center/live-chat.tsx` | Live chat page (default export) |
| `src/pages/contact-center/social-comments.tsx` | Social comments page (default export) |
| `src/lib/data/types.ts` | Add Conversation/ChatMessage/SocialComment types (single source) |
| `src/App.tsx` | Two protected routes + explicitPaths entries |
| `src/lib/navigation.ts` | `contact-center` group + 2 items |
| `src/i18n/index.ts` | New keys, en/de/fr |

---

### Task 1: Data modules and services

**Files:**
- Modify: `src/lib/data/types.ts` (append types)
- Create: `src/lib/data/conversations.ts`
- Create: `src/lib/data/social-comments.ts`
- Create: `src/services/conversation-service.ts`
- Create: `src/services/social-comment-service.ts`

**Interfaces:**
- Consumes: nothing new.
- Produces (used by Tasks 2-3):
  - `Conversation = { id: string; customer: string; initials: string; channel: 'whatsapp' | 'webchat' | 'email' | 'messenger'; status: 'open' | 'pending' | 'resolved'; unread: boolean; messages: ChatMessage[] }`, `ChatMessage = { id: string; sender: 'customer' | 'agent'; body: string; time: string }`
  - `SocialComment = { id: string; platform: 'instagram' | 'facebook' | 'x' | 'tiktok' | 'youtube'; username: string; initials: string; text: string; time: string; likes: number; status: 'new' | 'replied' | 'hidden'; reply?: { username: string; text: string; time: string } }`
  - `conversationService: { list(): Conversation[]; get(id): Conversation | undefined; reply(id, body): void; setStatus(id, status): void }`
  - `socialCommentService: { list(): SocialComment[]; reply(id, text): void; toggleHidden(id): void }`

- [ ] **Step 1: Add types to `src/lib/data/types.ts`** (append at end):

```typescript
export type ConversationChannel = 'whatsapp' | 'webchat' | 'email' | 'messenger'
export type ConversationStatus = 'open' | 'pending' | 'resolved'
export type ChatMessage = {
  id: string
  sender: 'customer' | 'agent'
  body: string
  time: string
}
export type Conversation = {
  id: string
  customer: string
  initials: string
  channel: ConversationChannel
  status: ConversationStatus
  unread: boolean
  messages: ChatMessage[]
}
export type SocialPlatform = 'instagram' | 'facebook' | 'x' | 'tiktok' | 'youtube'
export type CommentStatus = 'new' | 'replied' | 'hidden'
export type SocialComment = {
  id: string
  platform: SocialPlatform
  username: string
  initials: string
  text: string
  time: string
  likes: number
  status: CommentStatus
  reply?: { username: string; text: string; time: string }
}
```

- [ ] **Step 2: Create `src/lib/data/conversations.ts`** with 10 seeded conversations (mix of channels/statuses, 3 unread, each with 2-4 messages ending on the customer side for realistic reply flow). Include `listConversations`, `getConversation`, `replyToConversation(id, body)` (appends agent message `{ id: \`MSG-\${n}\`, sender: 'agent', body, time: '<now HH:MM AM>' }`, sets `unread: false`), `setConversationStatus(id, status)`. Follow the closure/counter pattern of `src/lib/data/finance.ts`.

- [ ] **Step 3: Create `src/lib/data/social-comments.ts`** with 14 seeded comments (all 5 platforms, statuses: 6 new, 5 replied, 3 hidden; 5 with replies). Include `listSocialComments`, `replyToComment(id, text)` (sets `status: 'replied'`, attaches `reply`), `toggleCommentHidden(id)` (flips `hidden` ↔ previous visible status: `replied` if a reply exists else `new`). Same closure pattern.

- [ ] **Step 4: Create both services** (exact pattern of `src/services/finance-service.ts`):

```typescript
// conversation-service.ts
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
```

```typescript
// social-comment-service.ts
import { type SocialComment } from '@/lib/data/types'
import { listSocialComments, replyToComment, toggleCommentHidden } from '@/lib/data/social-comments'

export interface SocialCommentService {
  list(): SocialComment[]
  reply(id: string, text: string): void
  toggleHidden(id: string): void
}
export const socialCommentService: SocialCommentService = {
  list: listSocialComments,
  reply: replyToComment,
  toggleHidden: toggleCommentHidden,
}
```

- [ ] **Step 5: Verify** — `bun run build` PASS.

- [ ] **Step 6: Commit** — `feat(contact-center): add conversation and social comment data + services`

---

### Task 2: Live Chat page

**Files:**
- Create: `src/pages/contact-center/live-chat.tsx`

**Interfaces:**
- Consumes: `conversationService` (Task 1), UI primitives, `cn()`, `PageTransition`, `PageHeader`, `useCustomizePreferences` + `useTranslations`.
- Produces: default-exported `LiveChatPage` route component.

- [ ] **Step 1: Build the page** following `src/pages/chat.tsx` layout style, 3-region grid `md:grid-cols-[300px_minmax(0,1fr)]`, wrapped in `PageTransition`, `PageHeader title={t('liveChat')}`:

State: `const [selectedId, setSelectedId] = useState<string | null>(null)`, `const [draft, setDraft] = useState('')`, `const [search, setSearch] = useState('')`, `const [statusFilter, setStatusFilter] = useState('all')`, `const [channelFilter, setChannelFilter] = useState('all')`, and a `version` counter bumped on mutations to re-read the store (pattern: `const [, force] = useReducer(x => x + 1, 0)`).

Left list: filter `conversationService.list()` by search (customer name + last message body, case-insensitive) + statusFilter + channelFilter. Render per item: `Avatar` with initials, customer name, channel badge (small, muted), last message preview (truncated `line-clamp-1`), time, unread dot (`size-2 rounded-full bg-primary` when `unread`), status color strip on the left edge: open = `bg-status-warning`, pending = `bg-chart-1`, resolved = `bg-status-success` (2px wide absolute div). Selected item: `bg-accent`.

Right thread: header with customer name, channel badge, `Select` for status bound to `conversationService.setStatus(id, v)` then `force()`. Messages: map `messages`, agent messages right-aligned (`ml-auto bg-primary text-primary-foreground`), customer left (`bg-muted`). Composer at bottom: `Input` + `Send` button; submit calls `conversationService.reply(selectedId, draft)`, clears draft, `force()`. Quick replies row above composer: three `Button variant="outline" size="sm"` with texts "Thanks for reaching out!", "Let me check that for you.", "Is there anything else?" — onClick sets draft.

Empty states: no conversation selected → centered `MessageSquare` icon + muted text; no results in list → `EmptyTableState`-style muted text.

- [ ] **Step 2: Verify** — `bun run build` PASS (page not yet routed; that's Task 4).

- [ ] **Step 3: Commit** — `feat(contact-center): add live chat page`

---

### Task 3: Social Comments page

**Files:**
- Create: `src/pages/contact-center/social-comments.tsx`

**Interfaces:**
- Consumes: `socialCommentService` (Task 1), UI primitives, `cn()`, `PageTransition`, `PageHeader`, i18n.
- Produces: default-exported `SocialCommentsPage` route component.

- [ ] **Step 1: Build the page**, layout `md:grid-cols-[240px_minmax(0,1fr)]`:

Left sidebar: search `Input`; channel list (`All` + 5 platforms) each a button row with the platform icon, label, and count of comments matching current search+status (not channel) — active row `bg-accent`; status `Select` (All/New/Replied/Hidden).

Platform config (module-level const):

```typescript
const platformConfig: Record<SocialPlatform, { label: string; icon: LucideIcon; className: string }> = {
  instagram: { label: 'Instagram', icon: Camera, className: 'text-chart-1' },
  facebook: { label: 'Facebook', icon: ThumbsUp, className: 'text-chart-2' },
  x: { label: 'X', icon: AtSign, className: 'text-foreground' },
  tiktok: { label: 'TikTok', icon: Music2, className: 'text-chart-3' },
  youtube: { label: 'YouTube', icon: Play, className: 'text-destructive' },
}
```

Feed: filter by search (username+text), status, channel. Card per comment: `Avatar` initials, username, platform badge (icon + label, `platformConfig[platform].className`), time, text, like count with `Heart` icon, status badge (new = default, replied = `bg-status-success/15 text-status-success`, hidden = `bg-muted text-muted-foreground`). Actions row: `Reply` button toggles an inline reply box (`Input` + `Send`); submitting calls `socialCommentService.reply(id, text)` then `force()`. `Hide`/`Unhide` button calls `toggleHidden(id)` then `force()`. Existing reply renders under the comment: indented block `ml-10 border-l pl-3` with "You" + reply text + time.

- [ ] **Step 2: Verify** — `bun run build` PASS.

- [ ] **Step 3: Commit** — `feat(contact-center): add social comments page`

---

### Task 4: Routes, navigation, i18n

**Files:**
- Modify: `src/App.tsx` (imports, explicitPaths, routes)
- Modify: `src/lib/navigation.ts` (group union + groups array + 2 items)
- Modify: `src/i18n/index.ts` (en/de/fr keys)

**Interfaces:**
- Consumes: `LiveChatPage`, `SocialCommentsPage` (Tasks 2-3), existing nav/i18n structures.
- Produces: working routes `/contact-center/live-chat`, `/contact-center/social-comments`; sidebar group "Contact Center" with 2 items.

- [ ] **Step 1: `src/lib/navigation.ts`** — extend `NavigationGroup` union with `'contact-center'`; add `'contact-center'` to `navigationGroups` array between `'commerce'` and `'apps'`; add two items after the last commerce item:

```typescript
  { title: 'Live Chat', href: '/contact-center/live-chat', icon: MessageCircle, group: 'contact-center', keywords: ['chat', 'inbox', 'agent'], translationKey: 'liveChat' },
  { title: 'Social Comments', href: '/contact-center/social-comments', icon: MessagesSquare, group: 'contact-center', keywords: ['social', 'comments', 'instagram', 'facebook'], translationKey: 'socialComments' },
```

Import `MessageCircle`, `MessagesSquare` from lucide-react.

- [ ] **Step 2: `src/App.tsx`** — import both pages; add both paths to the `explicitPaths` set; add both routes inside the protected children next to the report routes:

```typescript
      { path: '/contact-center/live-chat', element: <LiveChatPage /> },
      { path: '/contact-center/social-comments', element: <SocialCommentsPage /> },
```

- [ ] **Step 3: `src/i18n/index.ts`** — add to each locale block (next to `reports:`): en `contactCenter: 'Contact Center'`, `liveChat: 'Live Chat'`, `socialComments: 'Social Comments'`; de `contactCenter: 'Kontakt-Center'`, `liveChat: 'Live-Chat'`, `socialComments: 'Social-Kommentare'`; fr `contactCenter: 'Centre de contact'`, `liveChat: 'Chat en direct'`, `socialComments: 'Commentaires sociaux'`.

- [ ] **Step 4: Verify** — `bun run lint` (0 errors) + `bun run build` PASS.

- [ ] **Step 5: Commit** — `feat(contact-center): wire routes, navigation, and translations`

---

### Task 5: Browser smoke test

**Files:** none (verification only).

- [ ] **Step 1:** `bun run dev --port 5199`, login `demo@example.com` / `AteraDemo2026!`.
- [ ] **Step 2:** Sidebar shows "Contact Center" group with "Live Chat" and "Social Comments".
- [ ] **Step 3:** `/contact-center/live-chat`: list renders 10 conversations; select one (unread dot clears); send a message (appears as agent bubble right-aligned); change status via Select (color strip updates); quick-reply fills input; filters narrow the list; empty state shows when nothing selected.
- [ ] **Step 4:** `/contact-center/social-comments`: feed renders 14 comments; filter by platform narrows; reply to a new comment (status flips to replied, reply renders indented); hide a comment (disappears unless status filter = Hidden); search works.
- [ ] **Step 5:** No console errors on either page. Fix any findings, re-verify, commit fixes.
- [ ] **Step 6:** Stop dev server.

---

## Self-Review

**Spec coverage:** data+services (Task 1) → live chat page (Task 2) → social comments page (Task 3) → wiring (Task 4) → smoke (Task 5). Filters, quick replies, status selector, inline reply, hide/unhide, platform badges, empty states, i18n — all mapped.

**Placeholder scan:** none; every step has concrete code or exact file references.

**Type consistency:** types defined once in types.ts (Task 1), consumed identically in Tasks 2-3; service method names match between Task 1 definitions and Task 2-3 call sites (`reply`, `setStatus`, `toggleHidden`).
