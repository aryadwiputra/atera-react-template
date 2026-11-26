import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import type { ComponentProps } from 'react';
import { Input } from '@/components/ui/input';
import { useCustomizePreferences } from '@/hooks/use-customize-preferences';
import { useTranslations } from '@/i18n';
import { cn } from '@/lib/utils';

export function PasswordInput({ className, ...props }: Omit<ComponentProps<typeof Input>, 'type'>) {
    const { language } = useCustomizePreferences();
    const t = useTranslations(language);
    const [show, setShow] = useState(false);
    return (
        <div className="relative">
            <Input
                className={cn('pr-10', className)}
                type={show ? 'text' : 'password'}
                {...props}
            />
            <button
                type="button"
                aria-label={show ? t('hidePassword') : t('showPassword')}
                className="absolute top-1/2 right-2 inline-flex size-6 -translate-y-1/2 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
                onClick={() => setShow((value) => !value)}
            >
                {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
        </div>
    );
}
