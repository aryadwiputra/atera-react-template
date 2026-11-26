import { useMemo, useReducer, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import {
    Archive,
    ArrowLeft,
    FileText,
    Inbox as InboxIcon,
    Mail,
    MailOpen,
    PenLine,
    Search,
    Send,
    Star,
    StarOff,
    Trash2,
    X,
    type LucideIcon,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { RichTextEditor } from '@/components/shared/rich-text-editor';
import { useCustomizePreferences } from '@/hooks/use-customize-preferences';
import { useTranslations, type Translator } from '@/i18n';
import type { Email, EmailLabel, EmailView } from '@/lib/data/types';
import { cn } from '@/lib/utils';
import { emailService } from '@/services/email-service';
import { PageTransition } from '@/components/shared/page-transition';

const folderViews: {
    value: EmailView;
    label: 'inbox' | 'starred' | 'drafts' | 'sentFolder' | 'archive' | 'trash';
    icon: LucideIcon;
}[] = [
    { value: 'inbox', label: 'inbox', icon: InboxIcon },
    { value: 'starred', label: 'starred', icon: Star },
    { value: 'drafts', label: 'drafts', icon: FileText },
    { value: 'sent', label: 'sentFolder', icon: Send },
    { value: 'archive', label: 'archive', icon: Archive },
    { value: 'trash', label: 'trash', icon: Trash2 },
];

const labelOptions: {
    value: EmailLabel;
    label: 'billing' | 'technical' | 'general' | 'orders';
    dot: string;
}[] = [
    { value: 'billing', label: 'billing', dot: 'bg-chart-1' },
    { value: 'technical', label: 'technical', dot: 'bg-chart-2' },
    { value: 'general', label: 'general', dot: 'bg-chart-3' },
    { value: 'orders', label: 'orders', dot: 'bg-chart-4' },
];

function matchesView(email: Email, view: EmailView) {
    return view === 'starred' ? email.starred && email.folder !== 'trash' : email.folder === view;
}

function folderCount(emails: Email[], view: EmailView) {
    return emails.filter((email) => matchesView(email, view)).length;
}

type FolderRailProps = {
    emails: Email[];
    view: EmailView;
    labelFilter: EmailLabel | 'all';
    unreadCount: number;
    onViewChange: (view: EmailView) => void;
    onLabelChange: (label: EmailLabel | 'all') => void;
    t: Translator;
};

function FolderRail({
    emails,
    view,
    labelFilter,
    unreadCount,
    onViewChange,
    onLabelChange,
    t,
}: FolderRailProps) {
    return (
        <aside className="chat-scroll hidden min-h-0 flex-col overflow-y-auto border-b bg-muted/20 md:flex md:border-r md:border-b-0">
            <div className="flex h-14 shrink-0 items-center justify-between gap-2 border-b px-3">
                <h2 className="text-sm font-semibold">{t('folders')}</h2>
                {unreadCount > 0 && (
                    <Badge variant="secondary" className="px-1.5 py-0 text-xs tabular-nums">
                        {unreadCount}
                    </Badge>
                )}
            </div>
            <nav className="flex flex-col gap-0.5 p-2">
                {folderViews.map((item) => {
                    const Icon = item.icon;
                    const active = view === item.value;
                    return (
                        <button
                            key={item.value}
                            type="button"
                            aria-pressed={active}
                            onClick={() => onViewChange(item.value)}
                            className={cn(
                                'flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-sm',
                                active
                                    ? 'bg-accent text-accent-foreground'
                                    : 'text-muted-foreground hover:bg-accent/60',
                            )}
                        >
                            <Icon className="size-4 shrink-0" />
                            <span className="flex-1 truncate">{t(item.label)}</span>
                            <span className="text-muted-foreground text-xs tabular-nums">
                                {folderCount(emails, item.value)}
                            </span>
                        </button>
                    );
                })}
            </nav>
            <p className="text-muted-foreground px-2.5 pb-1 pt-2 text-xs font-semibold tracking-wide uppercase">
                {t('labels')}
            </p>
            <nav className="flex flex-col gap-0.5 p-2 pb-4">
                {labelOptions.map((item) => {
                    const active = labelFilter === item.value;
                    return (
                        <button
                            key={item.value}
                            type="button"
                            aria-pressed={active}
                            onClick={() => onLabelChange(active ? 'all' : item.value)}
                            className={cn(
                                'flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-left text-sm',
                                active
                                    ? 'bg-accent text-accent-foreground'
                                    : 'text-muted-foreground hover:bg-accent/60',
                            )}
                        >
                            <span className={cn('size-2 shrink-0 rounded-full', item.dot)} />
                            <span className="flex-1 truncate">{t(item.label)}</span>
                        </button>
                    );
                })}
            </nav>
        </aside>
    );
}

type EmailListProps = {
    view: EmailView;
    filtered: Email[];
    total: number;
    search: string;
    selectedId: string | null;
    unreadCount: number;
    hasActiveFilters: boolean;
    className?: string;
    onViewChange: (view: EmailView) => void;
    onSearchChange: (value: string) => void;
    onSelect: (id: string) => void;
    onReset: () => void;
    onCompose: () => void;
    t: Translator;
};

function EmailList({
    view,
    filtered,
    total,
    search,
    selectedId,
    unreadCount,
    hasActiveFilters,
    className,
    onViewChange,
    onSearchChange,
    onSelect,
    onReset,
    onCompose,
    t,
}: EmailListProps) {
    const activeLabel = folderViews.find((item) => item.value === view)?.label ?? 'inbox';

    return (
        <section
            className={cn('flex min-h-0 flex-col border-b md:border-r md:border-b-0', className)}
        >
            <div className="flex h-14 shrink-0 items-center justify-between gap-2 border-b px-3">
                <div className="flex items-center gap-2">
                    <h2 className="text-sm font-semibold">{t(activeLabel)}</h2>
                    <Badge variant="secondary" className="px-1.5 py-0 text-xs tabular-nums">
                        {filtered.length}/{total}
                    </Badge>
                    {view === 'inbox' && unreadCount > 0 && (
                        <Badge
                            variant="outline"
                            className="text-muted-foreground px-1.5 py-0 text-xs tabular-nums"
                        >
                            {unreadCount}
                        </Badge>
                    )}
                </div>
                <div className="flex items-center gap-1">
                    {hasActiveFilters && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="size-7"
                            onClick={onReset}
                            aria-label={t('resetFilters')}
                        >
                            <X className="size-4" />
                        </Button>
                    )}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="size-7"
                        onClick={onCompose}
                        aria-label={t('compose')}
                        title={t('compose')}
                    >
                        <PenLine className="size-4" />
                    </Button>
                </div>
            </div>
            <div className="flex shrink-0 flex-col gap-2 border-b p-3">
                <div className="relative">
                    <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
                    <Input
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder={t('searchEmails')}
                        className="pl-8"
                    />
                </div>
                <div className="flex gap-1 overflow-x-auto pb-1 md:hidden">
                    {folderViews.map((item) => {
                        const active = view === item.value;
                        return (
                            <button
                                key={item.value}
                                type="button"
                                aria-pressed={active}
                                onClick={() => onViewChange(item.value)}
                                className={cn(
                                    'h-7 shrink-0 rounded-full px-2.5 text-xs whitespace-nowrap',
                                    active
                                        ? 'bg-primary text-primary-foreground'
                                        : 'text-muted-foreground hover:bg-accent',
                                )}
                            >
                                {t(item.label)}
                            </button>
                        );
                    })}
                </div>
            </div>
            <div className="chat-scroll no-scrollbar min-h-0 flex-1 overflow-y-auto overscroll-contain">
                {filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-2 p-6 text-center">
                        <Mail className="text-muted-foreground/50 size-8" />
                        <p className="text-muted-foreground text-sm">{t('noEmails')}</p>
                        <Button variant="outline" size="sm" onClick={onReset}>
                            {t('resetFilters')}
                        </Button>
                    </div>
                ) : (
                    filtered.map((email) => (
                        <button
                            key={email.id}
                            type="button"
                            onClick={() => onSelect(email.id)}
                            className={cn(
                                'flex w-full items-start gap-3 border-b px-3 py-3 text-left hover:bg-accent/50',
                                selectedId === email.id && 'bg-accent',
                            )}
                        >
                            <Avatar className="size-9 shrink-0">
                                <AvatarFallback className="text-xs">
                                    {email.from.initials}
                                </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                    <span
                                        className={cn(
                                            'truncate text-sm',
                                            email.unread ? 'font-semibold' : 'font-medium',
                                        )}
                                    >
                                        {email.from.name}
                                    </span>
                                    <span className="text-muted-foreground ml-auto shrink-0 text-xs">
                                        {email.time}
                                    </span>
                                </div>
                                <div
                                    className={cn(
                                        'mt-0.5 truncate text-sm',
                                        email.unread ? 'font-semibold' : 'font-medium',
                                    )}
                                >
                                    {email.subject}
                                </div>
                                <p className="text-muted-foreground mt-0.5 line-clamp-2 text-xs">
                                    {email.preview}
                                </p>
                            </div>
                            {email.starred && (
                                <Star className="text-status-warning size-3.5 shrink-0" />
                            )}
                            {email.unread && (
                                <span className="size-2 shrink-0 rounded-full bg-primary" />
                            )}
                        </button>
                    ))
                )}
            </div>
        </section>
    );
}

type ReadingPaneProps = {
    email: Email;
    replyDraft: string;
    onReplyDraftChange: (value: string) => void;
    onReply: () => void;
    onStar: () => void;
    onToggleUnread: () => void;
    onArchive: () => void;
    onTrash: () => void;
    onBack: () => void;
    t: Translator;
};

function ReadingPane({
    email,
    replyDraft,
    onReplyDraftChange,
    onReply,
    onStar,
    onToggleUnread,
    onArchive,
    onTrash,
    onBack,
    t,
}: ReadingPaneProps) {
    return (
        <section className="flex min-h-0 flex-col">
            <div className="flex h-14 shrink-0 items-center gap-2 border-b px-3">
                <Button
                    variant="ghost"
                    size="icon"
                    className="size-7 md:hidden"
                    onClick={onBack}
                    aria-label={t('back')}
                    title={t('back')}
                >
                    <ArrowLeft className="size-4" />
                </Button>
                <span className="min-w-0 flex-1 truncate text-sm font-semibold">
                    {email.subject}
                </span>
                <Button
                    variant="ghost"
                    size="icon"
                    className="size-7"
                    onClick={onStar}
                    aria-label={t('starred')}
                    title={t('starred')}
                >
                    {email.starred ? (
                        <Star className="text-status-warning fill-current size-4" />
                    ) : (
                        <StarOff className="size-4" />
                    )}
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className="size-7"
                    onClick={onToggleUnread}
                    aria-label={email.unread ? t('markRead') : t('markUnread')}
                    title={email.unread ? t('markRead') : t('markUnread')}
                >
                    <MailOpen className="size-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className="size-7"
                    onClick={onArchive}
                    aria-label={t('archive')}
                    title={t('archive')}
                >
                    <Archive className="size-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className="size-7"
                    onClick={onTrash}
                    aria-label={t('trash')}
                    title={t('trash')}
                >
                    <Trash2 className="size-4" />
                </Button>
            </div>
            <div className="chat-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain p-4">
                <div className="mb-4 flex items-center gap-3">
                    <Avatar className="size-10 shrink-0">
                        <AvatarFallback className="text-sm">{email.from.initials}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">{email.from.name}</p>
                        <p className="text-muted-foreground truncate text-xs">
                            {email.from.email} · {email.time}
                        </p>
                    </div>
                </div>
                <h2 className="text-lg font-semibold">{email.subject}</h2>
                <div
                    className="email-content mt-3 text-foreground/90"
                    dangerouslySetInnerHTML={{ __html: email.body }}
                />
                {email.attachments && email.attachments.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                        {email.attachments.map((attachment) => (
                            <span
                                key={attachment.name}
                                className="rounded-lg border px-2.5 py-1.5 text-xs"
                            >
                                <span className="flex items-center gap-1.5">
                                    <FileText className="text-muted-foreground size-3.5" />
                                    <span className="font-medium">{attachment.name}</span>
                                    <span className="text-muted-foreground">{attachment.size}</span>
                                </span>
                            </span>
                        ))}
                    </div>
                )}
                {email.replies && email.replies.length > 0 && (
                    <div className="mt-4 border-t pt-4">
                        <p className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                            {t('reply')}
                        </p>
                        <div className="mt-2 space-y-3">
                            {email.replies.map((replyItem) => (
                                <div key={replyItem.id}>
                                    <div
                                        className="email-content text-foreground/90"
                                        dangerouslySetInnerHTML={{ __html: replyItem.body }}
                                    />
                                    <p className="text-muted-foreground mt-1 text-xs">
                                        {replyItem.time}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <div className="border-t p-3">
                <div className="flex items-end gap-2">
                    <RichTextEditor
                        compact
                        value={replyDraft}
                        onChange={onReplyDraftChange}
                        placeholder={t('messagePlaceholder')}
                        ariaLabel={t('message')}
                        className="min-w-0 flex-1"
                        contentClassName="chat-scroll max-h-40 overflow-y-auto"
                    />
                    <Button
                        type="button"
                        size="sm"
                        disabled={!replyDraft.trim() || replyDraft === '<p></p>'}
                        onClick={onReply}
                    >
                        <Send className="size-4" />
                        {t('send')}
                    </Button>
                </div>
            </div>
        </section>
    );
}

function EmptyReadingPane({ t }: { t: Translator }) {
    return (
        <section className="flex min-h-0 flex-1 flex-col items-center justify-center gap-2">
            <Mail className="text-muted-foreground/40 size-8" />
            <p className="text-muted-foreground text-sm">{t('selectEmail')}</p>
        </section>
    );
}

export default function EmailsPage() {
    const { language } = useCustomizePreferences();
    const t = useTranslations(language);
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [, force] = useReducer((x) => x + 1, 0);
    const rawView = searchParams.get('view');
    const view: EmailView = folderViews.some((item) => item.value === rawView)
        ? (rawView as EmailView)
        : 'inbox';
    const rawLabel = searchParams.get('label');
    const labelFilter: EmailLabel | 'all' = labelOptions.some((item) => item.value === rawLabel)
        ? (rawLabel as EmailLabel)
        : 'all';
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [replyDraft, setReplyDraft] = useState('');

    const emails = emailService.list();
    const selected = selectedId ? (emailService.get(selectedId) ?? null) : null;
    const query = search.trim().toLowerCase();

    const filtered = useMemo(
        () =>
            emails.filter((email) => {
                const matchesLabel = labelFilter === 'all' || email.labels.includes(labelFilter);
                const matchesQuery =
                    !query ||
                    email.from.name.toLowerCase().includes(query) ||
                    email.from.email.toLowerCase().includes(query) ||
                    email.subject.toLowerCase().includes(query) ||
                    email.preview.toLowerCase().includes(query);
                return matchesView(email, view) && matchesLabel && matchesQuery;
            }),
        [emails, view, labelFilter, query],
    );

    const viewTotal = folderCount(emails, view);
    const unreadCount = emails.filter((email) => email.unread && email.folder === 'inbox').length;
    const hasActiveFilters = query !== '' || labelFilter !== 'all';

    const selectEmail = (id: string) => {
        setSelectedId(id);
        setReplyDraft('');
        emailService.markRead(id, false);
        force();
    };

    const reply = () => {
        if (!selected || replyDraft === '' || replyDraft === '<p></p>') return;
        emailService.reply(selected.id, replyDraft);
        setReplyDraft('');
        force();
    };

    const toggleStar = () => {
        if (!selected) return;
        emailService.toggleStar(selected.id);
        force();
    };

    const toggleUnread = () => {
        if (!selected) return;
        emailService.markRead(selected.id, !selected.unread);
        force();
    };

    const archive = () => {
        if (!selected) return;
        emailService.move(selected.id, 'archive');
        setSelectedId(null);
        force();
    };

    const trash = () => {
        if (!selected) return;
        emailService.move(selected.id, 'trash');
        setSelectedId(null);
        force();
    };

    const changeView = (next: EmailView) => {
        setSelectedId(null);
        setSearchParams(
            (current) => {
                const params = new URLSearchParams(current);
                if (next === 'inbox') params.delete('view');
                else params.set('view', next);
                return params;
            },
            { replace: true },
        );
    };

    const changeLabel = (next: EmailLabel | 'all') => {
        setSelectedId(null);
        setSearchParams(
            (current) => {
                const params = new URLSearchParams(current);
                if (next === 'all') params.delete('label');
                else params.set('label', next);
                return params;
            },
            { replace: true },
        );
    };

    const resetFilters = () => {
        setSearch('');
        setSearchParams(
            (current) => {
                const params = new URLSearchParams(current);
                params.delete('label');
                return params;
            },
            { replace: true },
        );
    };

    return (
        <PageTransition>
            <main className="flex min-h-full flex-col p-4 md:p-6">
                <Card className="overflow-hidden py-0 md:h-[calc(100svh-7rem)] md:min-h-[520px]">
                    <div className="grid min-h-[560px] md:h-full md:min-h-0 md:grid-cols-[200px_340px_minmax(0,1fr)]">
                        <FolderRail
                            emails={emails}
                            view={view}
                            labelFilter={labelFilter}
                            unreadCount={unreadCount}
                            onViewChange={changeView}
                            onLabelChange={changeLabel}
                            t={t}
                        />
                        <EmailList
                            view={view}
                            filtered={filtered}
                            total={viewTotal}
                            search={search}
                            selectedId={selectedId}
                            unreadCount={unreadCount}
                            hasActiveFilters={hasActiveFilters}
                            className={cn(selected && 'hidden md:flex')}
                            onViewChange={changeView}
                            onSearchChange={setSearch}
                            onSelect={selectEmail}
                            onReset={resetFilters}
                            onCompose={() => navigate('/contact-center/emails/compose')}
                            t={t}
                        />
                        {selected ? (
                            <ReadingPane
                                email={selected}
                                replyDraft={replyDraft}
                                onReplyDraftChange={setReplyDraft}
                                onReply={reply}
                                onStar={toggleStar}
                                onToggleUnread={toggleUnread}
                                onArchive={archive}
                                onTrash={trash}
                                onBack={() => setSelectedId(null)}
                                t={t}
                            />
                        ) : (
                            <EmptyReadingPane t={t} />
                        )}
                    </div>
                </Card>
            </main>
        </PageTransition>
    );
}
