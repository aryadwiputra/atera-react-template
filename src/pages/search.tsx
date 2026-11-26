import { useSearchParams, Link } from 'react-router';
import { Search } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { PageTransition } from '@/components/shared/page-transition';
import { NoSearchResultsState } from '@/components/shared/empty-state';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCustomizePreferences } from '@/hooks/use-customize-preferences';
import { useTranslations } from '@/i18n';
import { buildSearchSections } from '@/lib/search';

export default function SearchPage() {
    const { language } = useCustomizePreferences();
    const t = useTranslations(language);
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') ?? '';
    const sections = buildSearchSections(query);
    const total = sections.reduce((sum, section) => sum + section.items.length, 0);
    return (
        <PageTransition>
            <main className="flex min-h-full flex-col gap-6 p-4 md:p-6">
                <PageHeader
                    title={t('searchResults')}
                    description={
                        query
                            ? `${t('searchResultsFor')} "${query}"`
                            : t('searchResultsDescription')
                    }
                    breadcrumbs={[{ title: t('searchResults'), href: '/search' }]}
                />
                {query && total === 0 && <NoSearchResultsState query={query} />}
                {(!query || total > 0) && (
                    <div className="mx-auto w-full max-w-3xl space-y-4">
                        {!query && (
                            <div className="flex flex-col items-center gap-3 py-12 text-center">
                                <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                                    <Search className="size-6 text-muted-foreground" />
                                </div>
                                <p className="text-sm text-muted-foreground">{t('searchPrompt')}</p>
                            </div>
                        )}
                        {sections.map((section) => (
                            <Card key={section.key} className="shadow-none">
                                <CardHeader className="flex-row items-center justify-between">
                                    <CardTitle className="text-sm">{section.label}</CardTitle>
                                    <Badge variant="secondary">{section.items.length}</Badge>
                                </CardHeader>
                                <CardContent className="divide-y">
                                    {section.items.map((item) => (
                                        <Link
                                            key={item.id}
                                            to={item.href}
                                            className="flex items-center justify-between gap-4 py-2.5 text-sm hover:text-foreground"
                                        >
                                            <span className="font-medium">{item.title}</span>
                                            <span className="text-xs text-muted-foreground">
                                                {item.subtitle}
                                            </span>
                                        </Link>
                                    ))}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </main>
        </PageTransition>
    );
}
