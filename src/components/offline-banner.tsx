import { WifiOff } from 'lucide-react';
import { useCustomizePreferences } from '@/hooks/use-customize-preferences';
import { useOnlineStatus } from '@/hooks/use-online-status';
import { useTranslations } from '@/i18n';

export function OfflineBanner() {
    const isOnline = useOnlineStatus();
    const { language } = useCustomizePreferences();
    const t = useTranslations(language);

    if (isOnline) {
        return null;
    }

    return (
        <div
            role="status"
            aria-live="polite"
            className="flex items-center gap-2 border-b border-destructive/10 bg-destructive/10 px-4 py-2 text-xs"
        >
            <WifiOff className="size-3.5 shrink-0" aria-hidden="true" />
            <span>{t('offlineMessage')}</span>
        </div>
    );
}
