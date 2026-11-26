import { Navbar } from '@/components/landing/home-navbar';
import { FinalCta, Footer, Pricing } from '@/components/landing/home-pricing';
import { Features, Hero, Metrics, Showcase, Tagline } from '@/components/landing/home-sections';
import { usePageMeta } from '@/hooks/use-page-meta';

export default function HomePage() {
    usePageMeta();
    return (
        <main className="min-h-svh bg-background text-foreground">
            <Navbar />
            <Hero />
            <Metrics />
            <Features />
            <Showcase />
            <Tagline />
            <Pricing />
            <FinalCta />
            <Footer />
        </main>
    );
}
