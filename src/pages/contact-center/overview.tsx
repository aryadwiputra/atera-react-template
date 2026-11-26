import { Bell, Globe, Inbox, MessageCircle, MessagesSquare } from 'lucide-react';
import { Link } from 'react-router';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/shared/page-header';
import { PageTransition } from '@/components/shared/page-transition';
import { StatCard } from '@/components/shared/stat-card';
import { useCustomizePreferences } from '@/hooks/use-customize-preferences';
import { useTranslations } from '@/i18n';
import type { Conversation, ConversationChannel } from '@/lib/data/types';
import { cn } from '@/lib/utils';
import { conversationService } from '@/services/conversation-service';
import { emailService } from '@/services/email-service';
import { socialCommentService } from '@/services/social-comment-service';

type Priority = 'High' | 'Medium' | 'Low' | 'Normal';

const priorityRank: Record<Priority, number> = {
    High: 0,
    Medium: 1,
    Low: 2,
    Normal: 3,
};

const priorityClasses: Record<Priority, string> = {
    High: 'bg-destructive/10 text-destructive',
    Medium: 'bg-status-warning/15 text-status-warning',
    Low: 'bg-muted text-muted-foreground',
    Normal: 'bg-muted text-muted-foreground',
};

const channelLabels: Record<ConversationChannel, string> = {
    whatsapp: 'WhatsApp',
    webchat: 'Webchat',
    email: 'Email',
    messenger: 'Messenger',
};

const channelClasses: Record<ConversationChannel, string> = {
    whatsapp: 'bg-status-success',
    webchat: 'bg-chart-1',
    email: 'bg-chart-2',
    messenger: 'bg-chart-3',
};

const channels: ConversationChannel[] = ['whatsapp', 'webchat', 'email', 'messenger'];

function priorityOf(conversation: Conversation): Priority {
    return (conversation.ticketPriority as Priority | undefined) ?? 'Normal';
}

export default function ContactCenterOverviewPage() {
    const { language } = useCustomizePreferences();
    const t = useTranslations(language);

    const conversations = conversationService.list();
    const emails = emailService.list();
    const comments = socialCommentService.list();

    const openConversations = conversations.filter((item) => item.status === 'open').length;
    const unreadConversations = conversations.filter((item) => item.unread).length;
    const unreadEmails = emails.filter((item) => item.unread && item.folder === 'inbox').length;
    const newComments = comments.filter((item) => item.status === 'new').length;

    const attention = conversations
        .filter(
            (item) =>
                item.status !== 'resolved' &&
                (item.unread || priorityOf(item) === 'High' || priorityOf(item) === 'Medium'),
        )
        .sort((a, b) => priorityRank[priorityOf(a)] - priorityRank[priorityOf(b)])
        .slice(0, 5);

    const channelCounts = channels.map((channel) => ({
        channel,
        count: conversations.filter((item) => item.channel === channel).length,
    }));
    const channelTotal = Math.max(conversations.length, 1);

    const agentMap = new Map<string, { open: number; total: number }>();
    for (const item of conversations) {
        if (!item.assignee) continue;
        const current = agentMap.get(item.assignee) ?? { open: 0, total: 0 };
        current.total += 1;
        if (item.status !== 'resolved') current.open += 1;
        agentMap.set(item.assignee, current);
    }
    const agentRows = [...agentMap.entries()]
        .map(([name, values]) => ({ name, ...values }))
        .sort((a, b) => b.open - a.open)
        .slice(0, 5);
    const maxAgentOpen = Math.max(...agentRows.map((item) => item.open), 1);

    const latestEmails = emails.filter((item) => item.folder === 'inbox').slice(0, 4);
    const socialQueue = comments.filter((item) => item.status === 'new').slice(0, 4);

    return (
        <PageTransition>
            <main className="flex min-h-full flex-col gap-[var(--page-gap,1.5rem)] app-page">
                <PageHeader
                    title={t('contactCenterOverview')}
                    description={t('contactCenterOverviewDescription')}
                    actions={
                        <Button variant="outline" size="sm" asChild>
                            <Link to="/contact-center/live-chat">{t('liveChat')}</Link>
                        </Button>
                    }
                />

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard
                        title={t('openConversations')}
                        value={openConversations}
                        icon={MessagesSquare}
                    />
                    <StatCard
                        title={t('unreadConversations')}
                        value={unreadConversations}
                        icon={Bell}
                    />
                    <StatCard title={t('inboxUnread')} value={unreadEmails} icon={Inbox} />
                    <StatCard title={t('newComments')} value={newComments} icon={MessageCircle} />
                </div>

                <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
                    <div className="flex flex-col gap-4">
                        <Card className="gap-[var(--card-p,1.5rem)] shadow-none">
                            <CardHeader className="flex-row items-center justify-between">
                                <div>
                                    <CardTitle className="text-base">
                                        {t('needsAttention')}
                                    </CardTitle>
                                    <CardDescription>{attention.length} / 5</CardDescription>
                                </div>
                                <Button variant="ghost" size="sm" asChild>
                                    <Link to="/contact-center/live-chat">{t('viewAll')}</Link>
                                </Button>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-1">
                                {attention.length === 0 ? (
                                    <p className="text-muted-foreground py-6 text-center text-sm">
                                        {t('noResults')}
                                    </p>
                                ) : (
                                    attention.map((conversation) => {
                                        const priority = priorityOf(conversation);
                                        return (
                                            <Link
                                                key={conversation.id}
                                                to="/contact-center/live-chat"
                                                className="flex items-center gap-3 rounded-md px-2 py-2 transition-colors hover:bg-accent/50"
                                            >
                                                <Avatar className="size-9 shrink-0">
                                                    <AvatarFallback className="text-xs">
                                                        {conversation.initials}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="truncate text-sm font-medium">
                                                            {conversation.customer}
                                                        </span>
                                                        <Badge
                                                            className={cn(
                                                                'shrink-0 px-1.5 py-0 text-[10px]',
                                                                priorityClasses[priority],
                                                            )}
                                                        >
                                                            {priority === 'Normal'
                                                                ? t('normalPriority')
                                                                : priority === 'High'
                                                                  ? t('highPriority')
                                                                  : priority === 'Medium'
                                                                    ? t('mediumPriority')
                                                                    : t('lowPriority')}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-muted-foreground truncate text-xs">
                                                        {
                                                            conversation.messages[
                                                                conversation.messages.length - 1
                                                            ]?.body
                                                        }
                                                    </p>
                                                </div>
                                                <span className="text-muted-foreground shrink-0 text-xs">
                                                    {
                                                        conversation.messages[
                                                            conversation.messages.length - 1
                                                        ]?.time
                                                    }
                                                </span>
                                            </Link>
                                        );
                                    })
                                )}
                            </CardContent>
                        </Card>

                        <div className="grid gap-4 md:grid-cols-2">
                            <Card className="gap-[var(--card-p,1.5rem)] shadow-none">
                                <CardHeader>
                                    <CardTitle className="text-base">{t('channels')}</CardTitle>
                                    <CardDescription>{t('channelMix')}</CardDescription>
                                </CardHeader>
                                <CardContent className="flex flex-col gap-3">
                                    {channelCounts.map((item) => {
                                        const percentage = Math.round(
                                            (item.count / channelTotal) * 100,
                                        );
                                        return (
                                            <div key={item.channel} className="space-y-1.5">
                                                <div className="flex items-center justify-between text-xs">
                                                    <span className="flex items-center gap-2">
                                                        <Globe
                                                            className={cn(
                                                                'size-3.5',
                                                                item.channel === 'email' &&
                                                                    'text-muted-foreground',
                                                            )}
                                                        />
                                                        {channelLabels[item.channel]}
                                                    </span>
                                                    <span className="text-muted-foreground tabular-nums">
                                                        {item.count}
                                                    </span>
                                                </div>
                                                <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                                                    <div
                                                        className={cn(
                                                            'h-full rounded-full',
                                                            channelClasses[item.channel],
                                                        )}
                                                        style={{ width: `${percentage}%` }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </CardContent>
                            </Card>

                            <Card className="gap-[var(--card-p,1.5rem)] shadow-none">
                                <CardHeader>
                                    <CardTitle className="text-base">
                                        {t('agentWorkload')}
                                    </CardTitle>
                                    <CardDescription>{t('assign')}</CardDescription>
                                </CardHeader>
                                <CardContent className="flex flex-col gap-3">
                                    {agentRows.length === 0 ? (
                                        <p className="text-muted-foreground py-4 text-center text-sm">
                                            {t('noResults')}
                                        </p>
                                    ) : (
                                        agentRows.map((agent) => (
                                            <div key={agent.name} className="space-y-1.5">
                                                <div className="flex items-center justify-between text-xs">
                                                    <span className="truncate font-medium">
                                                        {agent.name}
                                                    </span>
                                                    <span className="text-muted-foreground tabular-nums">
                                                        {agent.open} {t('statusOpen')}
                                                    </span>
                                                </div>
                                                <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                                                    <div
                                                        className="h-full rounded-full bg-primary"
                                                        style={{
                                                            width: `${Math.round((agent.open / maxAgentOpen) * 100)}%`,
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <Card className="gap-[var(--card-p,1.5rem)] shadow-none">
                            <CardHeader className="flex-row items-center justify-between">
                                <CardTitle className="text-base">{t('latestEmails')}</CardTitle>
                                <Button variant="ghost" size="sm" asChild>
                                    <Link to="/contact-center/emails">{t('viewAll')}</Link>
                                </Button>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-3">
                                {latestEmails.map((email) => (
                                    <Link
                                        key={email.id}
                                        to="/contact-center/emails"
                                        className="flex items-start gap-2.5 rounded-md px-1 py-1 transition-colors hover:bg-accent/50"
                                    >
                                        <Avatar className="size-8 shrink-0">
                                            <AvatarFallback className="text-[10px]">
                                                {email.from.initials}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className="truncate text-xs font-medium">
                                                    {email.from.name}
                                                </span>
                                                {email.unread && (
                                                    <span className="size-1.5 rounded-full bg-primary" />
                                                )}
                                                <span className="text-muted-foreground ml-auto shrink-0 text-[10px]">
                                                    {email.time}
                                                </span>
                                            </div>
                                            <p className="text-muted-foreground truncate text-xs">
                                                {email.subject}
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </CardContent>
                        </Card>

                        <Card className="gap-[var(--card-p,1.5rem)] shadow-none">
                            <CardHeader className="flex-row items-center justify-between">
                                <CardTitle className="text-base">{t('socialQueue')}</CardTitle>
                                <Button variant="ghost" size="sm" asChild>
                                    <Link to="/contact-center/social-comments">{t('viewAll')}</Link>
                                </Button>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-3">
                                {socialQueue.map((comment) => (
                                    <Link
                                        key={comment.id}
                                        to="/contact-center/social-comments"
                                        className="flex items-start gap-2.5 rounded-md px-1 py-1 transition-colors hover:bg-accent/50"
                                    >
                                        <Avatar className="size-8 shrink-0">
                                            <AvatarFallback className="text-[10px]">
                                                {comment.initials}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className="truncate text-xs font-medium">
                                                    {comment.username}
                                                </span>
                                                <span className="text-muted-foreground ml-auto shrink-0 text-[10px]">
                                                    {comment.time}
                                                </span>
                                            </div>
                                            <p className="text-muted-foreground line-clamp-2 text-xs">
                                                {comment.text}
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </PageTransition>
    );
}
