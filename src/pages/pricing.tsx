import { BadgeCheck } from 'lucide-react'
import { useState } from 'react'
import { PageHeader } from '@/components/shared/page-header'
import { PageTransition } from '@/components/shared/page-transition'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useCustomizePreferences } from '@/hooks/use-customize-preferences'
import { useTranslations } from '@/i18n'

const plans = [
  { name: 'Starter', monthly: 49, yearly: 490, description: 'For growing teams', features: ['3 team members', 'Basic analytics', 'Email support'] },
  { name: 'Pro', monthly: 129, yearly: 1290, description: 'For scaling businesses', features: ['Unlimited members', 'Advanced analytics', 'Priority support'] },
  { name: 'Enterprise', monthly: 599, yearly: 5990, description: 'For complex operations', features: ['Dedicated success manager', 'Custom reporting', 'SLA and SSO'] },
]

export default function PricingPage() {
  const { language } = useCustomizePreferences()
  const t = useTranslations(language)
  const [annual, setAnnual] = useState(true)

  return (
    <PageTransition>
      <main className="flex min-h-full flex-col gap-6 p-4 md:p-6">
        <PageHeader title={t('pricing')} description={t('pricingDescription')} />
        <div className="flex justify-center gap-2">
          <Button variant={annual ? 'default' : 'outline'} onClick={() => setAnnual(true)}>
            {t('yearly')}
          </Button>
          <Button variant={annual ? 'outline' : 'default'} onClick={() => setAnnual(false)}>
            {t('monthly')}
          </Button>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {plans.map((plan) => (
            <Card key={plan.name}>
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  <span className="text-4xl font-bold">${annual ? Math.round(plan.yearly / 12) : plan.monthly}</span>
                  <span className="text-sm text-muted-foreground">/{t('month')}</span>
                </p>
                <div className="space-y-2">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-2">
                      <BadgeCheck className="size-4 text-primary" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant={plan.name === 'Pro' ? 'default' : 'outline'}>
                  Choose {plan.name}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </PageTransition>
  )
}
