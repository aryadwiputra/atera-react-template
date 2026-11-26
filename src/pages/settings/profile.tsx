import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/components/shared/toast';
import { useCustomizePreferences } from '@/hooks/use-customize-preferences';
import { useTranslations } from '@/i18n';

export default function SettingsProfilePage() {
    const { session } = useAuth();
    const { language } = useCustomizePreferences();
    const t = useTranslations(language);
    const { toast } = useToast();
    const [name, setName] = useState(session?.name ?? '');
    const [email, setEmail] = useState(session?.email ?? '');

    return (
        <div className="space-y-4">
            <div className="min-w-0">
                <Link
                    to="/settings"
                    className="mb-1 inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
                >
                    <ArrowLeft className="size-3.5" />
                    {t('back')}
                </Link>
                <h2 className="text-lg font-semibold">{t('profile')}</h2>
                <p className="text-sm text-muted-foreground">{t('profileSettingsDescription')}</p>
            </div>

            <Card className="max-w-xl">
                <CardHeader>
                    <CardTitle>{t('profileInformation')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <label className="grid gap-2 text-sm font-medium">
                        {t('name')}
                        <Input value={name} onChange={(event) => setName(event.target.value)} />
                    </label>
                    <label className="grid gap-2 text-sm font-medium">
                        {t('email')}
                        <Input
                            type="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                        />
                    </label>
                    <Button onClick={() => toast({ title: t('changesSaved'), variant: 'success' })}>
                        {t('saveChanges')}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
