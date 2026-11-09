import type { ReactNode } from 'react'
import AppLogo from '@/components/app-logo'

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="flex min-h-svh items-center justify-center bg-muted/30 p-4">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-2xl border bg-background shadow-sm lg:grid-cols-[1fr_0.9fr]">
        <div className="hidden flex-col justify-between bg-primary p-10 text-primary-foreground lg:flex">
          <div className="text-primary-foreground"><AppLogo /></div>
          <div>
            <p className="mb-4 text-sm uppercase tracking-[0.2em] opacity-70">Atera workspace</p>
            <h1 className="max-w-md text-4xl font-semibold tracking-tight">One platform for every tool your company runs.</h1>
            <p className="mt-5 max-w-md text-sm leading-6 opacity-75">Bring company profile, HRIS, asset management, CRM, and ERP into one focused workspace.</p>
          </div>
          <p className="text-xs opacity-60">Atera Admin Platform</p>
        </div>
        <div className="flex min-h-[560px] items-center justify-center p-6 sm:p-10">{children}</div>
      </div>
    </main>
  )
}
