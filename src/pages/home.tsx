import { Navbar } from '@/components/landing/home-navbar';
import { FinalCta, Footer, Pricing } from '@/components/landing/home-pricing';
import { Features, Hero, Metrics, Showcase, Tagline } from '@/components/landing/home-sections';
import { usePageMeta } from '@/hooks/use-page-meta';
import { ReducedMotionProvider } from '@/components/reduced-motion-provider';

export default function HomePage() {
    usePageMeta();
    return (
        <ReducedMotionProvider>
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
        </ReducedMotionProvider>
    );
}
