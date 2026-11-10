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
  Sparkles,
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
  { value: '4,218', label: 'active workspaces' },
  { value: '38%', label: 'faster weekly reporting' },
  { value: '12.4M', label: 'orders processed' },
  { value: '99.98%', label: 'uptime over the last year' },
]

const features = [
  {
    icon: BarChart3,
    title: 'Analytics that answer questions',
    description: 'Revenue, traffic, and conversion on one screen. Drill from a headline number down to the order behind it in two clicks.',
  },
  {
    icon: ShoppingBag,
    title: 'Orders without the spreadsheet',
    description: 'Track every order from payment to refund. Status changes surface instantly, so nothing slips past your team.',
  },
  {
    icon: Users,
    title: 'A customer record that keeps itself',
    description: 'Contact details, order history, and notes live together. You stop digging through inboxes to find the last conversation.',
  },
  {
    icon: MessageSquare,
    title: 'Team chat inside the work',
    description: 'Discuss an order without leaving the order. Channels keep each project outside the general noise.',
  },
  {
    icon: FolderOpen,
    title: 'Files where the work happens',
    description: 'Contracts, exports, and screenshots sit next to the record they belong to, searchable in one place.',
  },
  {
    icon: Kanban,
    title: 'Plans the team actually follows',
    description: 'A kanban board tied to real orders and customers. Move a card and the status follows it everywhere.',
  },
]

const pricingPlans = [
  {
    name: 'Starter',
    price: '$12',
    period: '/month',
    description: 'For a solo operator getting their numbers in one place.',
    features: ['3 seats', 'Analytics and orders', '10GB file storage', 'Email support'],
    highlighted: false,
  },
  {
    name: 'Growth',
    price: '$29',
    period: '/month',
    description: 'For small teams running orders, customers, and reporting together.',
    features: ['10 seats', 'Everything in Starter', 'Team chat and kanban', 'Priority support'],
    highlighted: true,
  },
  {
    name: 'Scale',
    price: '$79',
    period: '/month',
    description: 'For operations that need roles, exports, and a longer history.',
    features: ['Unlimited seats', 'Everything in Growth', 'Role-based access', 'CSV export for every table'],
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
              Start free trial
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
                <Button className="w-full">Start free trial</Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

function DashboardPreview() {
  const bars = [42, 58, 45, 70, 62, 84, 76, 91, 68, 80, 95, 88]
  return (
    <div className="rounded-xl border bg-background p-4 shadow-sm" role="img" aria-label="Preview of the Atera analytics dashboard">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="size-2.5 rounded-full bg-primary" />
          <span className="text-xs font-medium">Revenue, last 12 months</span>
        </div>
        <span className="text-xs text-muted-foreground">Updated 4 min ago</span>
      </div>
      <div className="mt-4 grid grid-cols-12 items-end gap-1.5" style={{ height: 148 }}>
        {bars.map((height, index) => (
          <div key={index} className="col-span-1 flex items-end">
            <motion.div
              className="w-full rounded-sm bg-primary/80"
              initial={{ height: 0 }}
              whileInView={{ height: `${height}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: EASE, delay: index * 0.04 }}
            />
          </div>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-3 gap-3 border-t pt-4">
        <div>
          <p className="text-xs text-muted-foreground">Revenue</p>
          <p className="text-lg font-semibold tracking-tight">$84,310</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Orders</p>
          <p className="text-lg font-semibold tracking-tight">1,248</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Conversion</p>
          <p className="text-lg font-semibold tracking-tight">3.4%</p>
        </div>
      </div>
    </div>
  )
}

function Hero() {
  const reduceMotion = useReducedMotion()
  return (
    <section className="mx-auto w-full max-w-6xl px-6 pb-20 pt-16 sm:pt-24">
      <div className="mx-auto flex max-w-[680px] flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground"
        >
          <Sparkles className="size-3" />
          New: ask your dashboard questions in plain language
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.08 }}
          className="mt-6 bg-linear-to-r from-black to-[#666666] bg-clip-text text-transparent dark:from-white dark:to-[#9B9B9B] text-4xl font-bold tracking-tight text-balance sm:text-5xl"
        >
          Turn your data into decisions
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.16 }}
          className="mt-5 text-lg text-pretty text-muted-foreground"
        >
          Atera brings analytics, orders, customers, and billing into one workspace, so your team acts on numbers instead of guessing.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.24 }}
          className="mt-8 flex flex-col items-center gap-3 sm:flex-row"
        >
          <Link to="/sign-up">
            <Button size="lg">
              Start free trial
              <ArrowRight className="size-4" />
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="outline" size="lg">View live demo</Button>
          </Link>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mt-4 text-sm text-muted-foreground"
        >
          No credit card required. Cancel anytime.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: reduceMotion ? 0 : 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.3 }}
          className="mt-14 w-full max-w-3xl"
        >
          <DashboardPreview />
        </motion.div>
      </div>
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
          Everything your team runs on, in one place
        </h2>
        <p className="mt-4 text-pretty text-muted-foreground">
          Six workspaces that share one customer record, so data flows between them without copies or exports.
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
            See the whole month in one glance
          </h2>
          <p className="mt-4 max-w-[680px] text-pretty text-muted-foreground">
            The dashboard starts where your attention goes: revenue, orders, and conversion. Everything else is one drill down away.
          </p>
          <ul className="mt-6 space-y-3">
            {['Revenue, profit, and orders on a single screen', 'Traffic sources broken down by channel', 'Monthly goals with live progress bars'].map((item) => (
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
              Open the demo workspace
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
        text="Every number tells a story. Atera makes sure your team never misses one."
        className="text-center text-4xl font-bold tracking-tight text-pretty sm:text-5xl"
      />
    </section>
  )
}

function Testimonial() {
  return (
    <section className="border-y bg-muted/40">
      <div className="mx-auto w-full max-w-3xl px-6 py-20 text-center">
        <Reveal>
          <blockquote>
            <p className="text-xl leading-8 text-pretty sm:text-2xl">
              "We used to spend a full morning pulling last month's numbers for the Monday review. Now it's a link I send before coffee."
            </p>
          </blockquote>
          <figcaption className="mt-6">
            <p className="text-sm font-semibold">Dara Winata</p>
            <p className="text-sm text-muted-foreground">Operations lead, Kirana Logistics</p>
          </figcaption>
        </Reveal>
      </div>
    </section>
  )
}

function Pricing() {
  return (
    <section id="pricing" className="mx-auto w-full max-w-6xl scroll-mt-24 px-6 py-24">
      <Reveal className="mx-auto max-w-[680px] text-center">
        <h2 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">
          Pricing that scales with the team, not against it
        </h2>
        <p className="mt-4 text-pretty text-muted-foreground">
          Start free for 14 days on any plan. Downgrade or cancel whenever the numbers say so.
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
                  Start 14 day trial
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
            Your data is already there. Put it to work.
          </h2>
          <p className="max-w-[520px] text-pretty opacity-80">
            Set up a workspace in under five minutes. Your first dashboard is ready the moment you log in.
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row">
            <Link to="/sign-up">
              <Button size="lg" variant="secondary" className="bg-background text-foreground hover:bg-background/90">
                Start free trial
                <ArrowRight className="size-4" />
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="ghost" className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
                View live demo
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
      title: 'Product',
      links: [
        { label: 'Features', href: '#features' },
        { label: 'Analytics', href: '#analytics' },
        { label: 'Pricing', href: '#pricing' },
        { label: 'Live demo', href: '/login' },
      ],
    },
    {
      title: 'Account',
      links: [
        { label: 'Log in', href: '/login' },
        { label: 'Sign up', href: '/sign-up' },
        { label: 'Create account', href: '/sign-up' },
      ],
    },
  ]
  return (
    <footer className="border-t bg-muted/40">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-14 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <Link to="/" aria-label="Atera home">
            <AppLogo />
          </Link>
          <p className="mt-4 max-w-xs text-sm text-pretty text-muted-foreground">
            The analytics dashboard that turns data into decisions.
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
      <Testimonial />
      <Pricing />
      <FinalCta />
      <Footer />
    </main>
  )
}
