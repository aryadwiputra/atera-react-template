import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router';
import { z } from 'zod';
import { AuthError, AuthForm, SubmitButton } from '@/components/auth/auth-form';
import { PasswordInput } from '@/components/shared/auth-controls';
import { Input } from '@/components/ui/input';
import { notifyAuthChanged } from '@/hooks/use-auth';
import { useCustomizePreferences } from '@/hooks/use-customize-preferences';
import { useTranslations } from '@/i18n';
import { signUp } from '@/lib/auth';

const signUpSchema = z.object({
    name: z.string().min(2, 'enterName'),
    email: z.string().email(),
    password: z.string().min(8),
});

export function SignUpForm() {
    const { language } = useCustomizePreferences();
    const t = useTranslations(language);
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const form = useForm<z.infer<typeof signUpSchema>>({ resolver: zodResolver(signUpSchema) });

    const submit = async (values: z.infer<typeof signUpSchema>) => {
        setLoading(true);
        setError('');
        const result = await signUp(values);
        if (!result.ok) {
            setError(t(result.message));
            setLoading(false);
            return;
        }
        notifyAuthChanged();
        navigate('/dashboard', { replace: true });
    };

    return (
        <AuthForm
            title={t('createYourAccount')}
            description={t('createAccountDescription')}
            footer={
                <p className="text-sm text-muted-foreground">
                    {t('haveAccount')}{' '}
                    <Link
                        to="/login"
                        className="font-medium text-foreground underline-offset-4 hover:underline"
                    >
                        {t('logIn')}
                    </Link>
                </p>
            }
        >
            <form className="space-y-5" onSubmit={form.handleSubmit(submit)}>
                <label className="grid gap-2 text-sm font-medium">
                    {t('name')}
                    <Input
                        className="h-11"
                        autoComplete="name"
                        {...form.register('name')}
                        placeholder={t('enterYourName')}
                    />
                    {form.formState.errors.name && (
                        <span className="text-xs text-destructive">{t('enterName')}</span>
                    )}
                </label>
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
                <label className="grid gap-2 text-sm font-medium">
                    {t('password')}
                    <PasswordInput
                        autoComplete="new-password"
                        {...form.register('password')}
                        placeholder={t('atLeast8Chars')}
                    />
                    {form.formState.errors.password && (
                        <span className="text-xs text-destructive">{t('atLeast8Chars')}</span>
                    )}
                </label>
                {error && <AuthError>{error}</AuthError>}
                <SubmitButton loading={loading}>{t('createAccount')}</SubmitButton>
            </form>
        </AuthForm>
    );
}
