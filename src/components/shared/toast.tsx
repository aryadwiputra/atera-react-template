import { createContext, useCallback, useContext, useState } from 'react'
import { cn } from '@/lib/utils'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'

type ToastVariant = 'success' | 'error' | 'info'

export interface ToastItem {
  id: string
  title: string
  description?: string
  variant: ToastVariant
}

interface ToastContextValue {
  toasts: ToastItem[]
  toast: (input: { title: string; description?: string; variant?: ToastVariant }) => void
  dismiss: (id: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

const variantStyles: Record<ToastVariant, string> = {
  success: 'border-chart-2/30 bg-chart-2/10 text-chart-2 dark:bg-chart-2/20',
  error: 'border-destructive/30 bg-destructive/10 text-destructive dark:border-destructive/30 dark:bg-destructive/20',
  info: 'border-primary/30 bg-primary/5 text-primary dark:border-primary/30 dark:bg-primary/10',
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const dismiss = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const toast = useCallback((input: { title: string; description?: string; variant?: ToastVariant }) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`
    const item: ToastItem = {
      id,
      title: input.title,
      description: input.description,
      variant: input.variant ?? 'info',
    }
    setToasts((current) => [...current, item])
    setTimeout(() => dismiss(id), 4000)
  }, [dismiss])

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-[100] flex w-full max-w-sm flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="status"
            className={cn('pointer-events-auto flex items-start gap-3 rounded-lg border px-4 py-3 shadow-lg', variantStyles[toast.variant])}
          >
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">{toast.title}</p>
              {toast.description && <p className="mt-0.5 text-xs opacity-80">{toast.description}</p>}
            </div>
            <Button variant="ghost" size="icon" className="size-7 shrink-0" aria-label="Dismiss" onClick={() => dismiss(toast.id)}>
              <X className="size-4" />
            </Button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be used within ToastProvider')
  return context
}
