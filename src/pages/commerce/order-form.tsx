import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Save } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useParams } from 'react-router';
import { z } from 'zod';
import { Field } from '@/pages/commerce/form-field';
import { DatePicker } from '@/components/shared/date-picker';
import { PageHeader } from '@/components/shared/page-header';
import { PageTransition } from '@/components/shared/page-transition';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useCustomizePreferences } from '@/hooks/use-customize-preferences';
import { useTranslations } from '@/i18n';
import { orderService } from '@/services/order-service';

const orderSchema = z.object({
    customer: z.string().min(2),
    customerEmail: z.string().email(),
    product: z.string().min(2),
    status: z.enum(['Paid', 'Pending', 'Refunded']),
    amount: z.coerce.number().positive(),
    date: z.string().min(1),
});
type OrderFormValues = z.input<typeof orderSchema>;
type OrderSubmitValues = z.output<typeof orderSchema>;

export function OrderFormPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { language } = useCustomizePreferences();
    const t = useTranslations(language);
    const existing = id ? orderService.get(id) : undefined;
    const form = useForm<OrderFormValues, unknown, OrderSubmitValues>({
        resolver: zodResolver(orderSchema),
        defaultValues: existing ?? {
            customer: '',
            customerEmail: '',
            product: '',
            status: 'Pending',
            amount: 0,
            date: new Date().toISOString().slice(0, 10),
        },
    });
    const submit = (values: OrderSubmitValues) => {
        if (id) orderService.update(id, values);
        else orderService.create(values);
        navigate('/orders');
    };
    return (
        <PageTransition>
            <main className="flex min-h-full w-full flex-col gap-6 p-4 md:p-6">
                <PageHeader
                    breadcrumbs={[
                        { title: t('orders'), href: '/orders' },
                        {
                            title: id ? t('editOrder') : t('newOrder'),
                            href: id ? `/orders/${id}/edit` : '/orders/new',
                        },
                    ]}
                    title={id ? t('editOrder') : t('newOrder')}
                    description={t('createOrderDescription')}
                    actions={
                        <Button variant="outline" asChild>
                            <Link to="/orders">
                                <ArrowLeft className="size-4" />
                                {t('backToOrders')}
                            </Link>
                        </Button>
                    }
                />
                <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_280px]">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('orderDetails')}</CardTitle>
                            <p className="text-sm text-muted-foreground">
                                {t('orderDetailsDescription')}
                            </p>
                        </CardHeader>
                        <CardContent>
                            <form
                                className="grid gap-5 sm:grid-cols-2"
                                onSubmit={form.handleSubmit(submit)}
                            >
                                <Field
                                    label={t('customer')}
                                    error={form.formState.errors.customer?.message}
                                >
                                    <Input
                                        {...form.register('customer')}
                                        placeholder={t('customerName')}
                                    />
                                </Field>
                                <Field
                                    label={t('email')}
                                    error={form.formState.errors.customerEmail?.message}
                                >
                                    <Input
                                        type="email"
                                        {...form.register('customerEmail')}
                                        placeholder="customer@example.com"
                                    />
                                </Field>
                                <Field
                                    label={t('product')}
                                    error={form.formState.errors.product?.message}
                                >
                                    <Input
                                        {...form.register('product')}
                                        placeholder={t('productOrPlan')}
                                    />
                                </Field>
                                <Field
                                    label={t('amount')}
                                    error={form.formState.errors.amount?.message}
                                >
                                    <Input type="number" step="0.01" {...form.register('amount')} />
                                </Field>
                                <Field label={t('status')}>
                                    <Select
                                        value={form.watch('status')}
                                        onValueChange={(value) =>
                                            form.setValue(
                                                'status',
                                                value as OrderFormValues['status'],
                                            )
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Paid">{t('paid')}</SelectItem>
                                            <SelectItem value="Pending">{t('pending')}</SelectItem>
                                            <SelectItem value="Refunded">
                                                {t('refunded')}
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </Field>
                                <Field label={t('date')}>
                                    <DatePicker
                                        value={form.watch('date')}
                                        onChange={(value) => form.setValue('date', value)}
                                    />
                                </Field>
                                <div className="flex justify-end gap-2 sm:col-span-2">
                                    <Button type="button" variant="outline" asChild>
                                        <Link to="/orders">{t('cancel')}</Link>
                                    </Button>
                                    <Button type="submit">
                                        <Save className="size-4" />
                                        {t('saveOrder')}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                    <Card className="h-fit">
                        <CardHeader>
                            <CardTitle>{t('orderSummary')}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <div className="flex justify-between gap-3">
                                <span className="text-muted-foreground">{t('customer')}</span>
                                <span className="text-right font-medium">
                                    {form.watch('customer') || t('notSelected')}
                                </span>
                            </div>
                            <div className="flex justify-between gap-3">
                                <span className="text-muted-foreground">{t('product')}</span>
                                <span className="text-right font-medium">
                                    {form.watch('product') || t('notSelected')}
                                </span>
                            </div>
                            <div className="flex justify-between gap-3 border-t pt-3">
                                <span className="text-muted-foreground">{t('total')}</span>
                                <span className="font-semibold">
                                    ${Number(form.watch('amount') || 0).toFixed(2)}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </PageTransition>
    );
}
