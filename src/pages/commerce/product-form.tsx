import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Save } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useParams } from 'react-router';
import { z } from 'zod';
import { Field } from '@/pages/commerce/form-field';
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
import { productService } from '@/services/product-service';

const productSchema = z.object({
    name: z.string().min(2),
    category: z.string().min(2),
    price: z.coerce.number().positive(),
    stock: z.coerce.number().int().nonnegative(),
    status: z.enum(['Active', 'Draft', 'Archived']),
});
type ProductFormValues = z.input<typeof productSchema>;
type ProductSubmitValues = z.output<typeof productSchema>;

export function ProductFormPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { language } = useCustomizePreferences();
    const t = useTranslations(language);
    const existing = id ? productService.get(id) : undefined;
    const form = useForm<ProductFormValues, unknown, ProductSubmitValues>({
        resolver: zodResolver(productSchema),
        defaultValues: existing ?? { name: '', category: '', price: 0, stock: 0, status: 'Draft' },
    });
    const submit = (values: ProductSubmitValues) => {
        if (id) productService.update(id, values);
        else productService.create(values);
        navigate('/products');
    };
    return (
        <PageTransition>
            <main className="flex min-h-full w-full flex-col gap-6 p-4 md:p-6">
                <PageHeader
                    title={id ? t('editProductTitle') : t('newProductTitle')}
                    description={t('manageCatalogDescription')}
                    actions={
                        <Button variant="outline" asChild>
                            <Link to="/products">
                                <ArrowLeft className="size-4" />
                                {t('back')}
                            </Link>
                        </Button>
                    }
                />
                <Card>
                    <CardHeader>
                        <CardTitle>{t('productDetails')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form
                            className="grid gap-5 sm:grid-cols-2"
                            onSubmit={form.handleSubmit(submit)}
                        >
                            <Field label={t('name')} error={form.formState.errors.name?.message}>
                                <Input {...form.register('name')} />
                            </Field>
                            <Field
                                label={t('category')}
                                error={form.formState.errors.category?.message}
                            >
                                <Input {...form.register('category')} />
                            </Field>
                            <Field label={t('price')} error={form.formState.errors.price?.message}>
                                <Input type="number" step="0.01" {...form.register('price')} />
                            </Field>
                            <Field label={t('stock')}>
                                <Input type="number" {...form.register('stock')} />
                            </Field>
                            <Field label={t('status')}>
                                <Select
                                    value={form.watch('status')}
                                    onValueChange={(value) =>
                                        form.setValue(
                                            'status',
                                            value as ProductFormValues['status'],
                                        )
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Active">{t('active')}</SelectItem>
                                        <SelectItem value="Draft">{t('draft')}</SelectItem>
                                        <SelectItem value="Archived">{t('archived')}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </Field>
                            <div className="flex justify-end sm:col-span-2">
                                <Button type="submit">
                                    <Save className="size-4" />
                                    {t('saveProduct')}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </main>
        </PageTransition>
    );
}
