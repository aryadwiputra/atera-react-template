import { Check } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { PageTransition } from '@/components/shared/page-transition';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCustomizePreferences } from '@/hooks/use-customize-preferences';
import { useTranslations } from '@/i18n';
import { cn } from '@/lib/utils';

export function BillingPage() {
    const { language } = useCustomizePreferences();
    const t = useTranslations(language);
    const plans = [
        {
            name: 'Starter',
            price: '$49',
            description: 'For growing teams',
            features: ['3 team members', 'Basic analytics', 'Email support'],
        },
        {
            name: 'Pro',
            price: '$129',
            description: 'For scaling businesses',
            features: ['Unlimited members', 'Advanced analytics', 'Priority support'],
        },
        {
            name: 'Enterprise',
            price: '$599',
            description: 'For complex operations',
            features: ['Dedicated success manager', 'Custom reporting', 'SLA and SSO'],
        },
    ];
    return (
        <PageTransition>
            <main className="flex min-h-full flex-col gap-[var(--page-gap,1.5rem)] app-page">
                <PageHeader title={t('billing')} description={t('manageSubscriptionDescription')} />
                <div className="grid gap-4 lg:grid-cols-3">
                    {plans.map((plan, index) => (
                        <Card
                            key={plan.name}
                            className={cn(index === 1 && 'border-primary shadow-sm')}
                        >
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>{plan.name}</CardTitle>
                                    {index === 1 && <Badge>{t('currentPlan')}</Badge>}
                                </div>
                                <p className="text-sm text-muted-foreground">{plan.description}</p>
                                <p className="pt-3 text-3xl font-semibold">
                                    {plan.price}
                                    <span className="text-sm font-normal text-muted-foreground">
                                        {' '}
                                        / {t('month')}
                                    </span>
                                </p>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {plan.features.map((feature) => (
                                    <p key={feature} className="flex items-center gap-2 text-sm">
                                        <Check className="size-4 text-primary" />
                                        {feature}
                                    </p>
                                ))}
                                <Button
                                    variant={index === 1 ? 'default' : 'outline'}
                                    className="mt-3 w-full"
                                >
                                    {index === 1 ? t('managePlan') : t('choosePlan')}
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </main>
        </PageTransition>
    );
}
