# Omnichannel Contact Center Design

**Goal:** Add two contact-center pages — agent live chat and social media comment management — to the Atera admin dashboard, following the existing mock-data SPA conventions.

**Architecture:** Two new pages under `/contact-center/*`, backed by two new mock data modules and services (same pattern as `mail.ts`/`mail-service.ts`). Shared filter toolbar pattern from the reports suite. No real integration, no realtime — all in-memory mock state.

**Tech Stack:** React 19, TypeScript, existing UI primitives (`src/components/ui/`), lucide-react icons, `cn()`, `PageTransition` + `PageHeader`, `Badge`, `Input`, `Button`, `Card`.

**Spec:** AGENTS.md (repo conventions) + existing `src/pages/chat.tsx`, `src/pages/mail.tsx` as UI pattern references.

## Global Constraints
- Frontend-only mock data; no backend calls.
- Routes registered in `src/App.tsx` (protected layout) + `src/lib/navigation.ts`.
- i18n keys in en/de/fr via `src/i18n/index.ts`.
- Status colors use existing `status-success` / `status-warning` / `status-danger` / muted tokens, not ad-hoc colors.
- Verify with `bun run lint` + `bun run build`.

---

## Page 1: Live Chat (`/contact-center/live-chat`)

Inbox-style, 3 columns.

### Layout

```
+------------------+-----------------------------+
| Conversation list| Thread                      |
| (search + filters| - header: name, channel,    |
|  on top)         |   status selector           |
|                  | - messages (bubbles)        |
|  per item:       | - composer: input + send +  |
|  avatar, name,   |   quick replies             |
|  channel badge,  |                             |
|  last msg, time, |                             |
|  unread dot,     |                             |
|  status color    |                             |
+------------------+-----------------------------+
```

### Data

`src/lib/data/conversations.ts`:

```typescript
export type ConversationChannel = 'whatsapp' | 'webchat' | 'email' | 'messenger'
export type ConversationStatus = 'open' | 'pending' | 'resolved'

export type ChatMessage = {
  id: string
  sender: 'customer' | 'agent'
  body: string
  time: string // display time, e.g. '10:42 AM'
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
```

Seed 8–10 conversations across channels, mixed statuses, some unread. Last message becomes the preview in the list.

`src/services/conversation-service.ts`:

```typescript
export interface ConversationService {
  list(): Conversation[]
  get(id: string): Conversation | undefined
  reply(id: string, body: string): void
  setStatus(id: string, status: ConversationStatus): void
}
```

State mutation in the data module (same pattern as `mail.ts`).

### UI behavior

- Selecting a conversation marks it read (`unread: false`).
- Composer: `Input` + `Send` button; Enter sends. Disabled when input empty.
- Quick replies: 3 canned responses as small buttons above input (e.g. "Thanks for reaching out!", "Let me check that for you.", "Is there anything else?"). Clicking fills the input.
- Status selector: `Select` in thread header; changing it updates the conversation.
- Filters above list: search input (name + message text), status `Select` (All/Open/Pending/Resolved), channel `Select` (All/WhatsApp/Web chat/Email/Messenger).
- Empty state when no conversation selected: centered muted text + icon.

### Icons

- WhatsApp/Web chat/Email/Messenger: `MessageCircle`, `Globe`, `Mail`, `MessageSquare` from lucide-react (no brand icons in lucide).

---

## Page 2: Social Comments (`/contact-center/social-comments`)

### Layout

```
+------------------+--------------------------------------+
| Filter sidebar   | Comment feed                         |
| - search         | per comment card:                    |
| - channel list   |   avatar, username, platform badge,  |
|   (with counts)  |   time, text, like count,            |
| - status filter  |   actions: Reply, Hide/Unhide        |
|                  |   (replies shown flat below)         |
+------------------+--------------------------------------+
```

### Data

`src/lib/data/social-comments.ts`:

```typescript
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

Seed 12–15 comments across the 5 platforms, mixed statuses, some with replies, some hidden.

`src/services/social-comment-service.ts`:

```typescript
export interface SocialCommentService {
  list(): SocialComment[]
  reply(id: string, text: string): void
  toggleHidden(id: string): void
}
```

`reply` sets status to `replied` and attaches the reply. `toggleHidden` flips between `hidden` and previous visible status (`new` if it was never replied).

### UI behavior

- Channel filter: list of 5 platforms with icon + count of visible comments; click to filter (All + each platform).
- Status filter: `Select` (All/New/Replied/Hidden).
- Search matches username + text.
- Reply: inline `Input` + `Send` appears under the comment when Reply is clicked; submitting attaches reply and sets status `replied`.
- Hide: toggles comment visibility in the feed (hidden comments visible only when status filter = Hidden); button label switches Hide/Unhide.
- Platform badges: colored dot + label, using distinct chart tokens (`--chart-1`..`--chart-5`) per platform so they stay within the design system.

### Platform icons

Lucide no longer ships brand icons. Use neutral icons instead: Instagram `Camera`, Facebook `ThumbsUp`, X `AtSign`, TikTok `Music2`, YouTube `Play`. All verified present in the installed lucide-react.

---

## Wiring

- `src/App.tsx`: two protected routes `/contact-center/live-chat`, `/contact-center/social-comments`, added to `explicitPaths` so placeholderRoutes doesn't shadow them.
- `src/lib/navigation.ts`: new group `'contact-center'` added to `NavigationGroup` union and `navigationGroups` (between `commerce` and `apps`), with 2 items:
  - `{ title: 'Live Chat', href: '/contact-center/live-chat', icon: MessageCircle, group: 'contact-center', keywords: ['chat', 'inbox', 'agent'], translationKey: 'liveChat' }`
  - `{ title: 'Social Comments', href: '/contact-center/social-comments', icon: MessagesSquare, group: 'contact-center', keywords: ['social', 'comments', 'instagram', 'facebook'], translationKey: 'socialComments' }`

## Out of scope

- Real platform integrations, OAuth, webhooks.
- Realtime (WebSocket/polling).
- Attachments, media preview, voice notes.
- Agent assignment / team inbox features.
