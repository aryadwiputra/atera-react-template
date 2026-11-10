import { Link } from 'react-router'
import AppLogo from '@/components/app-logo'
import { Button } from '@/components/ui/button'

function LegalShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <main className="min-h-svh bg-background text-foreground">
      <header className="border-b">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between px-6 py-4">
          <Link to="/" aria-label="Atera home">
            <AppLogo />
          </Link>
          <Button asChild variant="ghost" size="sm">
            <Link to="/">Back to home</Link>
          </Button>
        </div>
      </header>
      <article className="mx-auto w-full max-w-3xl px-6 py-14">
        <h1 className="text-3xl font-medium tracking-tight">{title}</h1>
        <div className="mt-8 flex flex-col gap-6 text-sm leading-6 text-muted-foreground [&_h2]:text-base [&_h2]:font-medium [&_h2]:text-foreground">
          {children}
        </div>
      </article>
    </main>
  )
}

export function TermsPage() {
  return (
    <LegalShell title="License terms">
      <p>
        Atera is a demo template distributed as source code. Nothing on this site processes a payment, and no
        purchase is completed here.
      </p>
      <h2>What the license covers</h2>
      <p>
        A license grants the right to use the source code in your own projects. The Personal tier covers one
        project, the Commercial tier covers client and commercial work, and the Extended tier adds SaaS and
        resale rights. Each tier states its update window on the pricing section.
      </p>
      <h2>What it does not cover</h2>
      <p>
        Redistribution of the source code as a competing template or starter kit is not permitted, except under
        the Extended tier. Third-party assets keep their own licenses.
      </p>
      <h2>Demo data</h2>
      <p>
        Every record in this project is mock data generated for demonstration. It does not describe real people,
        companies, invoices or transactions.
      </p>
    </LegalShell>
  )
}

export function PrivacyPage() {
  return (
    <LegalShell title="Privacy">
      <p>
        This demo stores nothing on a server. There is no backend, no analytics script and no tracking pixel in
        this project.
      </p>
      <h2>What is stored in your browser</h2>
      <p>
        A session key, your appearance choice and your customization preferences are written to localStorage and
        cookies so the demo keeps its state between page loads. You can clear them at any time from your browser
        settings.
      </p>
      <h2>Third parties</h2>
      <p>
        The demo does not send data to third parties. Social sign-in buttons are placeholders and are not
        connected to any provider.
      </p>
    </LegalShell>
  )
}
