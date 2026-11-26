import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2, LockKeyhole, MailCheck } from 'lucide-react';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { z } from 'zod';
import { AuthError, AuthForm, SubmitButton } from '@/components/auth/auth-form';
import { SignUpForm } from '@/components/auth/sign-up-form';
import { PasswordInput } from '@/components/shared/auth-controls';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { notifyAuthChanged, useAuth } from '@/hooks/use-auth';
import { useCustomizePreferences } from '@/hooks/use-customize-preferences';
import { useTranslations } from '@/i18n';
import { signIn } from '@/lib/auth';

export function SignUpPage() {
    return <SignUpForm />;
}

function SuccessState({
    icon,
    title,
    description,
    children,
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
    children?: React.ReactNode;
}) {
    return (
        <div className="space-y-5">
            <div className="flex size-11 items-center justify-center rounded-md border border-border/70 bg-muted/30">
                {icon}
            </div>
            <div>
                <p className="text-base font-medium">{title}</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
            </div>
            {children}
        </div>
    );
}

const emailSchema = z.object({ email: z.string().email() });

export function ForgotPasswordPage() {
    const { language } = useCustomizePreferences();
    const t = useTranslations(language);
    const [sent, setSent] = useState(false);
    const form = useForm<z.infer<typeof emailSchema>>({ resolver: zodResolver(emailSchema) });

    return (
        <AuthForm title={t('forgotPasswordTitle')} description={t('enterEmailResetLink')}>
            {sent ? (
                <SuccessState
                    icon={<MailCheck className="size-5" />}
                    title={t('checkYourInbox')}
                    description={t('resetLinkSent')}
                />
            ) : (
                <form className="space-y-5" onSubmit={form.handleSubmit(() => setSent(true))}>
                    <label className="grid gap-2 text-sm font-medium">
                        {t('email')}
                        <Input
                            type="email"
                            className="h-11"
                            autoComplete="email"
                            {...form.register('email')}
                            placeholder="you@example.com"
                        />
                        {form.formState.errors.email && (
                            <span className="text-xs text-destructive">{t('enterValidEmail')}</span>
                        )}
                    </label>
                    <SubmitButton>{t('sendResetLink')}</SubmitButton>
                </form>
            )}
        </AuthForm>
    );
}

export function ResetPasswordPage() {
    const { language } = useCustomizePreferences();
    const t = useTranslations(language);
    const [saved, setSaved] = useState(false);
    const schema = z
        .object({ password: z.string().min(8), confirm: z.string().min(8) })
        .refine((value) => value.password === value.confirm, { path: ['confirm'] });
    const form = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema) });

    return (
        <AuthForm title={t('resetPassword')} description={t('chooseNewPassword')}>
            {saved ? (
                <SuccessState
                    icon={<CheckCircle2 className="size-5" />}
                    title={t('passwordUpdated')}
                    description={t('passwordResetSuccess')}
                />
            ) : (
                <form className="space-y-5" onSubmit={form.handleSubmit(() => setSaved(true))}>
                    <label className="grid gap-2 text-sm font-medium">
                        {t('newPassword')}
                        <PasswordInput autoComplete="new-password" {...form.register('password')} />
                        {form.formState.errors.password && (
                            <span className="text-xs text-destructive">{t('atLeast8Chars')}</span>
                        )}
                    </label>
                    <label className="grid gap-2 text-sm font-medium">
                        {t('confirmPassword')}
                        <PasswordInput autoComplete="new-password" {...form.register('confirm')} />
                        {form.formState.errors.confirm && (
                            <span className="text-xs text-destructive">
                                {t('passwordsDoNotMatch')}
                            </span>
                        )}
                    </label>
                    <SubmitButton>{t('updatePassword')}</SubmitButton>
                </form>
            )}
        </AuthForm>
    );
}

export function TwoFactorPage() {
    const navigate = useNavigate();
    const { language } = useCustomizePreferences();
    const t = useTranslations(language);
    const [digits, setDigits] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const inputs = useRef<Array<HTMLInputElement | null>>([]);

    const setDigit = (index: number, raw: string) => {
        const chars = raw.replace(/\D/g, '').split('');
        if (chars.length === 0) {
            setDigits((current) =>
                current.map((value, position) => (position === index ? '' : value)),
            );
            return;
        }
        setDigits((current) => {
            const next = [...current];
            for (const [offset, char] of chars.entries()) {
                if (index + offset > 5) break;
                next[index + offset] = char;
            }
            return next;
        });
        const target = Math.min(index + chars.length, 5);
        inputs.current[target]?.focus();
    };

    const handleKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Backspace' && !digits[index] && index > 0) {
            inputs.current[index - 1]?.focus();
            return;
        }
        if (event.key === 'ArrowLeft' && index > 0) inputs.current[index - 1]?.focus();
        if (event.key === 'ArrowRight' && index < 5) inputs.current[index + 1]?.focus();
    };

    const submit = () => {
        setLoading(true);
        setTimeout(() => navigate('/dashboard', { replace: true }), 300);
    };

    return (
        <AuthForm title={t('twoFactor')} description={t('enterSixDigitCode')}>
            <form
                className="space-y-5"
                onSubmit={(event) => {
                    event.preventDefault();
                    if (digits.every(Boolean)) submit();
                }}
            >
                <div
                    role="group"
                    aria-label={t('enterSixDigitCode')}
                    className="flex justify-between gap-2"
                    onPaste={(event) => {
                        event.preventDefault();
                        setDigit(0, event.clipboardData.getData('text'));
                    }}
                >
                    {digits.map((digit, index) => (
                        <Input
                            key={index}
                            ref={(element) => {
                                inputs.current[index] = element;
                            }}
                            aria-label={`${index + 1}`}
                            className="h-12 w-full text-center text-lg"
                            inputMode="numeric"
                            autoComplete="one-time-code"
                            maxLength={1}
                            value={digit}
                            onChange={(event) => setDigit(index, event.target.value)}
                            onKeyDown={(event) => handleKeyDown(index, event)}
                            onFocus={(event) => event.target.select()}
                        />
                    ))}
                </div>
                <SubmitButton loading={loading}>{t('verifyCode')}</SubmitButton>
            </form>
        </AuthForm>
    );
}

export function VerifyEmailPage() {
    const { language } = useCustomizePreferences();
    const t = useTranslations(language);
    const [resent, setResent] = useState(false);

    return (
        <AuthForm title={t('verifyYourEmail')} description={t('verifyYourEmailDescription')}>
            <SuccessState
                icon={<MailCheck className="size-5" />}
                title={t('verificationEmailSent')}
                description={t('checkInboxVerification')}
            >
                <Button
                    type="button"
                    variant="outline"
                    className="h-11 w-full"
                    disabled={resent}
                    onClick={() => setResent(true)}
                >
                    {resent ? t('verificationEmailSent') : t('resendEmail')}
                </Button>
            </SuccessState>
        </AuthForm>
    );
}

export function LockScreenPage() {
    const { session } = useAuth();
    const navigate = useNavigate();
    const { language } = useCustomizePreferences();
    const t = useTranslations(language);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const form = useForm<{ password: string }>();

    return (
        <AuthForm title={t('welcomeBack')} description={t('lockScreenDescription')}>
            <form
                className="space-y-5"
                onSubmit={form.handleSubmit(async (values) => {
                    setLoading(true);
                    setError('');
                    const result = await signIn(session?.email ?? '', values.password);
                    if (!result.ok) {
                        setError(t(result.message));
                        setLoading(false);
                        return;
                    }
                    notifyAuthChanged();
                    navigate('/dashboard', { replace: true });
                })}
            >
                <div className="flex items-center gap-3 rounded-md border border-border/70 bg-muted/20 px-3 py-3">
                    <div className="flex size-10 items-center justify-center rounded-full bg-muted">
                        <LockKeyhole className="size-4" />
                    </div>
                    <div className="min-w-0">
                        <p className="truncate text-sm font-medium">
                            {session?.name ?? t('welcomeBack')}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">{session?.email}</p>
                    </div>
                </div>
                <label className="grid gap-2 text-sm font-medium">
                    {t('password')}
                    <PasswordInput
                        autoComplete="current-password"
                        {...form.register('password', { required: true })}
                    />
                </label>
                {error && <AuthError>{error}</AuthError>}
                <SubmitButton loading={loading}>{t('unlock')}</SubmitButton>
            </form>
        </AuthForm>
    );
}
