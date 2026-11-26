import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router';
import { AuthError, AuthForm, SubmitButton } from '@/components/auth/auth-form';
import { PasswordInput } from '@/components/shared/auth-controls';
import { Input } from '@/components/ui/input';
import { notifyAuthChanged, useAuth } from '@/hooks/use-auth';
import { useCustomizePreferences } from '@/hooks/use-customize-preferences';
import { useTranslations } from '@/i18n';
import { getDemoCredentials, signIn } from '@/lib/auth';

export function SignInForm() {
    const { language } = useCustomizePreferences();
    const t = useTranslations(language);
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const demo = getDemoCredentials();
    const [email, setEmail] = useState(demo.email);
    const [password, setPassword] = useState(demo.password);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    if (isAuthenticated) return <Navigate to="/dashboard" replace />;

    const destination = (location.state as { from?: string } | null)?.from ?? '/dashboard';

    const submit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        setError('');
        const result = await signIn(email, password);
        if (!result.ok) {
            setError(t(result.message));
            setLoading(false);
            return;
        }
        notifyAuthChanged();
        navigate(destination, { replace: true });
    };

    return (
        <AuthForm
            title={t('loginTitle')}
            description={t('loginDescription')}
            footer={
                <p className="text-sm text-muted-foreground">
                    {t('noAccount')}{' '}
                    <Link
                        to="/sign-up"
                        className="font-medium text-foreground underline-offset-4 hover:underline"
                    >
                        {t('signUp')}
                    </Link>
                </p>
            }
        >
            <form className="space-y-5" onSubmit={submit}>
                <label className="grid gap-2 text-sm font-medium">
                    {t('emailAddress')}
                    <Input
                        type="email"
                        autoComplete="email"
                        className="h-11"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        required
                    />
                </label>
                <label className="grid gap-2 text-sm font-medium">
                    {t('password')}
                    <PasswordInput
                        autoComplete="current-password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        required
                    />
                </label>
                <div className="flex justify-end">
                    <Link
                        to="/forgot-password"
                        className="text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                    >
                        {t('forgotPassword')}
                    </Link>
                </div>
                {error && <AuthError>{error}</AuthError>}
                <SubmitButton loading={loading}>{t('logIn')}</SubmitButton>
            </form>

            <div className="mt-6 border-t border-border/70 pt-4 lg:hidden">
                <p className="text-xs leading-5 text-muted-foreground">{t('signInDemo')}</p>
            </div>
        </AuthForm>
    );
}
