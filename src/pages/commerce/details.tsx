import { ArrowLeft } from 'lucide-react';
import { Link, Navigate, useParams } from 'react-router';
import { PageHeader } from '@/components/shared/page-header';
import { PageTransition } from '@/components/shared/page-transition';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { useOrder } from '@/features/orders/api';
import { useCustomizePreferences } from '@/hooks/use-customize-preferences';
import { useTranslations } from '@/i18n';
import { customerService } from '@/services/customer-service';
import { productService } from '@/services/product-service';

export function CustomerDetailPage() {
    const { id } = useParams();
    const { language } = useCustomizePreferences();
    const t = useTranslations(language);
    const customer = id ? customerService.list().find((item) => item.id === id) : undefined;
    if (!customer) return <Navigate to="/customers" replace />;
    return (
        <PageTransition>
            <main className="flex min-h-full flex-col gap-[var(--page-gap,1.5rem)] app-page">
                <PageHeader
                    title={customer.name}
                    description={customer.email}
                    actions={
                        <Button variant="outline" asChild>
                            <Link to="/customers">
                                <ArrowLeft className="size-4" />
                                {t('back')}
                            </Link>
                        </Button>
                    }
                />
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('company')}</CardTitle>
                        </CardHeader>
                        <CardContent>{customer.company}</CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('orders')}</CardTitle>
                        </CardHeader>
                        <CardContent className="text-2xl font-semibold">
                            {customer.orders}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('totalSpent')}</CardTitle>
                        </CardHeader>
                        <CardContent className="text-2xl font-semibold">
                            ${customer.spent.toLocaleString()}
                        </CardContent>
                    </Card>
                </div>
            </main>
        </PageTransition>
    );
}

export function OrderDetailPage() {
    const { id } = useParams();
    const { language } = useCustomizePreferences();
    const t = useTranslations(language);
    const orderQuery = useOrder(id);
    if (orderQuery.isLoading) {
        return (
            <PageTransition>
                <main className="flex min-h-[40vh] w-full items-center justify-center p-6">
                    <Spinner className="size-6" />
                </main>
            </PageTransition>
        );
    }
    if (orderQuery.isError) {
        return (
            <PageTransition>
                <main className="flex min-h-[40vh] w-full flex-col items-center justify-center gap-3 p-6 text-center">
                    <p className="text-sm text-muted-foreground">{t('somethingWentWrong')}</p>
                    <Button variant="outline" size="sm" onClick={() => orderQuery.refetch()}>
                        {t('retry')}
                    </Button>
                </main>
            </PageTransition>
        );
    }
    const order = orderQuery.data;
    if (!order) return <Navigate to="/orders" replace />;
    return (
        <PageTransition>
            <main className="flex min-h-full flex-col gap-[var(--page-gap,1.5rem)] app-page">
                <PageHeader
                    title={`Order #${order.id}`}
                    description={`${order.customer} · ${order.date}`}
                    actions={
                        <div className="flex gap-2">
                            <Button variant="outline" asChild>
                                <Link to="/orders">
                                    <ArrowLeft className="size-4" />
                                    {t('back')}
                                </Link>
                            </Button>
                            <Button asChild>
                                <Link to={`/orders/${order.id}/edit`}>{t('edit')}</Link>
                            </Button>
                        </div>
                    }
                />
                <Card>
                    <CardContent className="grid gap-4 p-6 sm:grid-cols-2">
                        <div>
                            <p className="text-sm text-muted-foreground">{t('product')}</p>
                            <p className="font-medium">{order.product}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">{t('status')}</p>
                            <Badge>{order.status}</Badge>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">{t('customerEmail')}</p>
                            <p>{order.customerEmail}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">{t('amount')}</p>
                            <p className="text-xl font-semibold">${order.amount.toFixed(2)}</p>
                        </div>
                    </CardContent>
                </Card>
            </main>
        </PageTransition>
    );
}

export function ProductDetailPage() {
    const { id } = useParams();
    const { language } = useCustomizePreferences();
    const t = useTranslations(language);
    const product = id ? productService.get(id) : undefined;
    if (!product) return <Navigate to="/products" replace />;
    return (
        <PageTransition>
            <main className="flex min-h-full flex-col gap-[var(--page-gap,1.5rem)] app-page">
                <PageHeader
                    title={product.name}
                    description={product.category}
                    actions={
                        <div className="flex gap-2">
                            <Button variant="outline" asChild>
                                <Link to="/products">
                                    <ArrowLeft className="size-4" />
                                    {t('back')}
                                </Link>
                            </Button>
                            <Button asChild>
                                <Link to={`/products/${product.id}/edit`}>{t('edit')}</Link>
                            </Button>
                        </div>
                    }
                />
                <div className="grid gap-4 sm:grid-cols-3">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('price')}</CardTitle>
                        </CardHeader>
                        <CardContent className="text-2xl font-semibold">
                            ${product.price}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('inventory')}</CardTitle>
                        </CardHeader>
                        <CardContent className="text-2xl font-semibold">
                            {product.stock}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('status')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Badge>{product.status}</Badge>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </PageTransition>
    );
}
