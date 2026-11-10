import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import {
  ArrowRight,
  BarChart3,
  Check,
  FolderOpen,
  Kanban,
  Menu,
  MessageSquare,
  Moon,
  ShoppingBag,
  Sun,
  Users,
  X,
} from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router'
import AppLogo from '@/components/app-logo'
import { Button } from '@/components/ui/button'
import { Reveal } from '@/components/landing/reveal'
import { TaglineReveal } from '@/components/landing/tagline-reveal'
import { useAppearance } from '@/hooks/use-appearance'
import { cn } from '@/lib/utils'

const EASE = [0.22, 1, 0.36, 1] as const

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'Analytics', href: '#analytics' },
  { label: 'Pricing', href: '#pricing' },
]

const metrics = [
  { value: '15', label: 'shadcn UI components' },
  { value: '55+', label: 'ready app routes' },
  { value: '3', label: 'languages included' },
  { value: '5', label: 'theme color presets' },
]

const features = [
  {
    icon: BarChart3,
    title: 'Pages that are already built',
    description: 'Analytics, orders, customers, kanban, chat, mail, calendar, invoices and more. Open a route and it is ready.',
  },
  {
    icon: ShoppingBag,
    title: 'Real mock data out of the box',
    description: 'In-memory data modules that behave like an API. No backend needed to preview any page before shipping.',
  },
  {
    icon: Users,
    title: 'Dark mode, built in and themeable',
    description: 'Light, dark and system colors switch in one click. Five color presets and text density tokens included.',
  },
  {
    icon: MessageSquare,
    title: 'Type safe from the start',
    description: 'TypeScript throughout the library, 37 typed data modules, route tables that error before they break.',
  },
  {
    icon: FolderOpen,
    title: '15 shadcn style components',
    description: 'Button, dialog, dropdown, sheet, command, tooltip, sidebar and more. Swap one of them into your own design.',
  },
  {
    icon: Kanban,
    title: 'i18n with three languages',
    description: 'English, German and French translations are already wired in. Add a fourth language in minutes, not days.',
  },
]

const pricingPlans = [
  {
    name: 'Personal',
    price: '$29',
    period: 'one-time',
    description: 'For side projects and personal portfolios.',
    features: ['1 project', '6 months of updates', 'Community support', 'Personal use license'],
    highlighted: false,
  },
  {
    name: 'Commercial',
    price: '$59',
    period: 'one-time',
    description: 'For client work and commercial products.',
    features: ['Unlimited projects', '1 year of updates', 'Priority email support', 'Commercial use license'],
    highlighted: true,
  },
  {
    name: 'Extended',
    price: '$149',
    period: 'one-time',
    description: 'For SaaS products and resale rights.',
    features: ['Unlimited projects', 'Lifetime updates', 'Priority email support', 'SaaS and resale license'],
    highlighted: false,
  },
]

function ThemeToggle() {
  const { resolvedAppearance, updateAppearance } = useAppearance()
  const dark = resolvedAppearance === 'dark'
  return (
    <button
      type="button"
      onClick={() => updateAppearance(dark ? 'light' : 'dark')}
      className="inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors duration-300 hover:bg-accent hover:text-foreground"
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </button>
  )
}

function Navbar() {
  const [open, setOpen] = useState(false)
  return (
    <header className="sticky top-4 z-50 mx-auto w-full max-w-4xl px-4">
      <nav
        aria-label="Main"
        className="flex items-center justify-between rounded-xl border bg-background/80 px-4 py-3 shadow-sm backdrop-blur-md"
      >
        <Link to="/" className="flex items-center" aria-label="Atera home">
          <AppLogo />
        </Link>
        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors duration-300 hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </div>
        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          <Link to="/login">
            <Button variant="ghost" size="sm">Log in</Button>
          </Link>
          <Link to="/sign-up">
            <Button size="sm">
              Get the template
            </Button>
          </Link>
        </div>
        <button
          type="button"
          className="inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors duration-300 hover:bg-accent hover:text-foreground md:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-label="Toggle navigation menu"
        >
          {open ? <X className="size-4" /> : <Menu className="size-4" />}
        </button>
      </nav>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: EASE }}
            className="absolute inset-x-4 top-full mt-2 flex flex-col gap-1 rounded-xl border bg-background/95 p-4 shadow-md backdrop-blur-md md:hidden"
          >
            {navLinks.map((link, index) => (
              <motion.a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: EASE, delay: Math.min(index * 0.06, 0.4) }}
                className="rounded-md px-2 py-2 text-sm font-medium text-muted-foreground transition-colors duration-300 hover:bg-accent hover:text-foreground"
              >
                {link.label}
              </motion.a>
            ))}
            <div className="mt-2 flex items-center gap-2 border-t pt-3">
              <ThemeToggle />
              <Link to="/login" className="flex-1">
                <Button variant="outline" className="w-full">Log in</Button>
              </Link>
              <Link to="/sign-up" className="flex-1">
                <Button className="w-full">Get the template</Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

function DashboardPreview() {
  const { resolvedAppearance } = useAppearance()
  const dark = resolvedAppearance === 'dark'

  return (
    <img
      src="/dashboard-preview.png"
      alt="A screenshot of Atera's analytics dashboard"
      className={cn(
        'w-full rounded-xl border object-cover shadow-sm',
        dark && 'brightness-75 contrast-125 saturate-75'
      )}
    />
  )
}

function Hero() {
  const reduceMotion = useReducedMotion()
  return (
    <section className="mx-auto w-full max-w-6xl px-6 pb-20 pt-16 sm:pt-24">
      <div className="mx-auto flex max-w-[680px] flex-col items-center text-center">
        <motion.h1
          initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl"
        >
          A React dashboard template for developers
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.08 }}
          className="mt-5 text-lg text-pretty text-muted-foreground"
        >
          Atera includes typed admin pages, in-memory sample data, and theme controls, ready to explore and adapt to your project.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.16 }}
          className="mt-8 flex flex-col items-center gap-3 sm:flex-row"
        >
          <Link to="/sign-up">
            <Button size="lg">
              Get the template
              <ArrowRight className="size-4" />
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="outline" size="lg">Browse the demo</Button>
          </Link>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.24 }}
          className="mt-4 text-sm text-muted-foreground"
        >
          One-time purchase. Free updates for 6 months.
        </motion.p>
      </div>
      <motion.div
        initial={{ opacity: 0, y: reduceMotion ? 0 : 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: EASE, delay: 0.12 }}
        className="mt-14 w-full"
      >
        <DashboardPreview />
      </motion.div>
    </section>
  )
}

function Metrics() {
  return (
    <section className="border-y bg-muted/40" aria-label="Key numbers">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-8 px-6 py-12 md:grid-cols-4">
        {metrics.map((metric, index) => (
          <Reveal key={metric.label} delay={index * 0.08} className="text-center">
            <p className="text-3xl font-bold tracking-tight">{metric.value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{metric.label}</p>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function Features() {
  return (
    <section id="features" className="mx-auto w-full max-w-6xl scroll-mt-24 px-6 py-24">
      <Reveal className="mx-auto max-w-[680px] text-center">
        <h2 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">
          Every page your admin panel needs, already built
        </h2>
        <p className="mt-4 text-pretty text-muted-foreground">
          Login flows, dashboard, analytics, commerce, kanban, chat, calendar, settings — each one wired to typed mock data so you can see it working before you write a line.
        </p>
      </Reveal>
      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => (
          <Reveal key={feature.title} delay={(index % 3) * 0.08}>
            <div className="flex h-full flex-col gap-3 rounded-xl border bg-background p-6 transition-colors duration-300 hover:bg-accent/40">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <feature.icon className="size-5" />
              </div>
              <h3 className="text-lg font-semibold tracking-tight">{feature.title}</h3>
              <p className="text-sm leading-6 text-pretty text-muted-foreground">{feature.description}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function Showcase() {
  return (
    <section id="analytics" className="scroll-mt-24 bg-muted/40">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-6 py-24 lg:grid-cols-2">
        <Reveal>
          <h2 className="max-w-[680px] text-3xl font-bold tracking-tight text-balance sm:text-4xl">
            Open any page and it already works
          </h2>
          <p className="mt-4 max-w-[680px] text-pretty text-muted-foreground">
            Each route comes with its own mock data module and typed API. Click around the demo and see how it is put together.
          </p>
          <ul className="mt-6 space-y-3">
            {['Full auth flow: login, signup, 2FA, reset, lock screen', 'Dashboard with charts, metrics, and recent activity', 'Commerce pages with tables, forms, and invoicing'].map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Check className="size-3" />
                </span>
                {item}
              </li>
            ))}
          </ul>
          <Link to="/login" className="mt-8 inline-block">
            <Button variant="link" className="px-0">
              Open the live preview
              <ArrowRight className="size-4" />
            </Button>
          </Link>
        </Reveal>
        <Reveal delay={0.1}>
          <DashboardPreview />
        </Reveal>
      </div>
    </section>
  )
}

function Tagline() {
  return (
    <section className="mx-auto w-full max-w-4xl px-6 py-28">
      <TaglineReveal
        text="Skip three weeks of setup. Start from pages that already work."
        className="text-center text-4xl font-bold tracking-tight text-pretty sm:text-5xl"
      />
    </section>
  )
}

function Pricing() {
  return (
    <section id="pricing" className="mx-auto w-full max-w-6xl scroll-mt-24 px-6 py-24">
      <Reveal className="mx-auto max-w-[680px] text-center">
        <h2 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">
          One purchase, every page included
        </h2>
        <p className="mt-4 text-pretty text-muted-foreground">
          Pay once and use Atera in as many projects as your license allows. No subscriptions, no per-seat pricing.
        </p>
      </Reveal>
      <div className="mt-14 grid gap-5 lg:grid-cols-3">
        {pricingPlans.map((plan, index) => (
          <Reveal key={plan.name} delay={index * 0.08} className="h-full">
            <div
              className={cn(
                'flex h-full flex-col rounded-xl border bg-background p-6',
                plan.highlighted && 'border-primary shadow-sm'
              )}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold tracking-tight">{plan.name}</h3>
                {plan.highlighted && (
                  <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                    Most popular
                  </span>
                )}
              </div>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-bold tracking-tight">{plan.price}</span>
                <span className="text-sm text-muted-foreground">{plan.period}</span>
              </div>
              <p className="mt-3 text-sm text-pretty text-muted-foreground">{plan.description}</p>
              <ul className="mt-6 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm">
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link to="/sign-up" className="mt-8">
                <Button variant={plan.highlighted ? 'default' : 'outline'} className="w-full">
                  Buy {plan.name} license
                </Button>
              </Link>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function FinalCta() {
  return (
    <section className="mx-auto w-full max-w-6xl px-6 pb-24">
      <Reveal>
        <div className="flex flex-col items-center gap-6 rounded-xl border bg-primary px-8 py-16 text-center text-primary-foreground">
          <h2 className="max-w-[680px] text-3xl font-bold tracking-tight text-balance sm:text-4xl">
            Your next admin panel starts here
          </h2>
          <p className="max-w-[520px] text-pretty opacity-80">
            Start with prebuilt admin pages, typed sample data, and theme controls in one React project.
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row">
            <Link to="/sign-up">
              <Button size="lg" variant="secondary" className="bg-background text-foreground hover:bg-background/90">
                Get the template
                <ArrowRight className="size-4" />
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="ghost" className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
                Browse the demo
              </Button>
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  )
}

function Footer() {
  const columns = [
    {
      title: 'Template',
      links: [
        { label: 'Features', href: '#features' },
        { label: 'Pages', href: '#analytics' },
        { label: 'Pricing', href: '#pricing' },
        { label: 'Live preview', href: '/login' },
      ],
    },
    {
      title: 'Account',
      links: [
        { label: 'Log in', href: '/login' },
        { label: 'Sign up', href: '/sign-up' },
      ],
    },
  ]
  return (
    <footer className="border-t bg-muted/40">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-14 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <Link to="/" aria-label="Atera home" className="inline-flex items-center">
            <AppLogo />
          </Link>
          <p className="mt-4 max-w-xs text-sm text-pretty text-muted-foreground">
            A React admin dashboard template with every page already built.
          </p>
        </div>
        {columns.map((column) => (
          <nav key={column.title} aria-label={column.title}>
            <p className="text-sm font-semibold">{column.title}</p>
            <ul className="mt-4 space-y-2">
              {column.links.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-sm text-muted-foreground transition-colors duration-300 hover:text-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t">
        <p className="mx-auto w-full max-w-6xl px-6 py-6 text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Atera. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default function HomePage() {
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
  )
}
