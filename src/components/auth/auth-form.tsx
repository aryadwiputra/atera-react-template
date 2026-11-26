import { ArrowLeft, LoaderCircle } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { useCustomizePreferences } from '@/hooks/use-customize-preferences';
import { useTranslations } from '@/i18n';

export function AuthForm({
    title,
    description,
    children,
    footer,
}: {
    title: string;
    description: string;
    children: ReactNode;
    footer?: ReactNode;
}) {
    const { language } = useCustomizePreferences();
    const t = useTranslations(language);

    return (
        <div className="w-full">
            <header>
                <h1 className="text-[26px] leading-tight font-semibold tracking-tight sm:text-3xl">
                    {title}
                </h1>
                <p className="mt-3 text-sm leading-6 text-pretty text-muted-foreground">
                    {description}
                </p>
            </header>
            <div className="mt-8">{children}</div>
            <footer className="mt-8 border-t border-border/70 pt-5">
                {footer ?? (
                    <Link
                        to="/login"
                        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                    >
                        <ArrowLeft className="size-4" />
                        {t('backToSignIn')}
                    </Link>
                )}
            </footer>
        </div>
    );
}

export function AuthError({ children }: { children: ReactNode }) {
    return (
        <p
            role="alert"
            className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive"
        >
            {children}
        </p>
    );
}

export function SubmitButton({ loading, children }: { loading?: boolean; children: ReactNode }) {
    return (
        <Button className="h-11 w-full" disabled={loading}>
            {loading && <LoaderCircle className="size-4 animate-spin" />}
            {children}
        </Button>
    );
}
