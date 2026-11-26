import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { RichTextEditor } from '@/components/shared/rich-text-editor';
import { useCustomizePreferences } from '@/hooks/use-customize-preferences';
import { useTranslations } from '@/i18n';
import { emailService } from '@/services/email-service';
import { PageTransition } from '@/components/shared/page-transition';
import { useToast } from '@/components/shared/toast';

const plainText = (html: string) =>
    html
        .replace(/<[^>]*>/g, ' ')
        .replace(/&nbsp;/g, ' ')
        .trim();

export default function EmailsComposePage() {
    const { language } = useCustomizePreferences();
    const t = useTranslations(language);
    const navigate = useNavigate();
    const { toast } = useToast();
    const [to, setTo] = useState('');
    const [cc, setCc] = useState('');
    const [bcc, setBcc] = useState('');
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [showCcBcc, setShowCcBcc] = useState(false);

    const canSend = to.trim() !== '' && subject.trim() !== '' && plainText(body) !== '';

    const send = () => {
        if (!canSend) return;
        emailService.send({
            to: to.trim(),
            cc: cc.trim() || undefined,
            bcc: bcc.trim() || undefined,
            subject: subject.trim(),
            body: body.trim(),
        });
        toast({ title: t('emailSent'), variant: 'success' });
        navigate('/contact-center/emails?view=sent');
    };

    return (
        <PageTransition>
            <main className="flex min-h-full flex-col p-4 md:p-6">
                <Card className="overflow-hidden py-0 md:h-[calc(100svh-7rem)] md:min-h-[520px]">
                    <div className="flex h-full min-h-0 flex-col">
                        <div className="flex h-14 shrink-0 items-center gap-2 border-b px-3">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="size-7"
                                onClick={() => navigate('/contact-center/emails')}
                                aria-label={t('back')}
                                title={t('back')}
                            >
                                <ArrowLeft className="size-4" />
                            </Button>
                            <h2 className="min-w-0 flex-1 truncate text-sm font-semibold">
                                {t('composeEmail')}
                            </h2>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => navigate('/contact-center/emails')}
                            >
                                {t('discard')}
                            </Button>
                        </div>

                        <div className="chat-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain">
                            <div className="grid gap-3 border-b p-4">
                                <div className="grid gap-1.5">
                                    <label className="text-sm font-medium" htmlFor="compose-to">
                                        {t('to')}
                                    </label>
                                    <Input
                                        id="compose-to"
                                        value={to}
                                        onChange={(event) => setTo(event.target.value)}
                                        placeholder="name@example.com"
                                    />
                                </div>

                                {showCcBcc ? (
                                    <div className="grid gap-3 sm:grid-cols-2">
                                        <div className="grid gap-1.5">
                                            <label
                                                className="text-sm font-medium"
                                                htmlFor="compose-cc"
                                            >
                                                {t('cc')}
                                            </label>
                                            <Input
                                                id="compose-cc"
                                                value={cc}
                                                onChange={(event) => setCc(event.target.value)}
                                                placeholder="name@example.com"
                                            />
                                        </div>
                                        <div className="grid gap-1.5">
                                            <label
                                                className="text-sm font-medium"
                                                htmlFor="compose-bcc"
                                            >
                                                {t('bcc')}
                                            </label>
                                            <Input
                                                id="compose-bcc"
                                                value={bcc}
                                                onChange={(event) => setBcc(event.target.value)}
                                                placeholder="name@example.com"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        className="w-fit text-xs font-medium text-muted-foreground hover:text-foreground"
                                        onClick={() => setShowCcBcc(true)}
                                    >
                                        {t('cc')} / {t('bcc')}
                                    </button>
                                )}

                                <div className="grid gap-1.5">
                                    <label
                                        className="text-sm font-medium"
                                        htmlFor="compose-subject"
                                    >
                                        {t('subject')}
                                    </label>
                                    <Input
                                        id="compose-subject"
                                        value={subject}
                                        onChange={(event) => setSubject(event.target.value)}
                                        placeholder={t('subjectPlaceholder')}
                                    />
                                </div>
                            </div>

                            <div className="p-4">
                                <RichTextEditor
                                    value={body}
                                    onChange={setBody}
                                    placeholder={t('messagePlaceholder')}
                                    ariaLabel={t('message')}
                                    className="min-h-[320px] border-0"
                                    contentClassName="chat-scroll max-h-[320px] overflow-y-auto"
                                />
                            </div>
                        </div>

                        <div className="flex shrink-0 items-center justify-end gap-2 border-t p-3">
                            <Button
                                variant="outline"
                                onClick={() => navigate('/contact-center/emails')}
                            >
                                {t('cancel')}
                            </Button>
                            <Button disabled={!canSend} onClick={send}>
                                <Send className="size-4" />
                                {t('send')}
                            </Button>
                        </div>
                    </div>
                </Card>
            </main>
        </PageTransition>
    );
}
