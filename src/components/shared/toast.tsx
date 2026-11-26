import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
    type ReactNode,
} from 'react';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

type ToastVariant = 'success' | 'error' | 'info';

export interface ToastItem {
    id: string;
    title: string;
    description?: string;
    variant: ToastVariant;
}

interface ToastContextValue {
    toasts: ToastItem[];
    toast: (input: { title: string; description?: string; variant?: ToastVariant }) => void;
    dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const TOAST_DURATION = 5000;

const toastVariants = {
    success: {
        icon: CheckCircle2,
        iconClass: 'bg-primary/10 text-primary',
        bar: 'bg-primary',
    },
    error: {
        icon: AlertCircle,
        iconClass: 'bg-destructive/10 text-destructive',
        bar: 'bg-destructive',
    },
    info: {
        icon: Info,
        iconClass: 'bg-muted text-muted-foreground',
        bar: 'bg-muted-foreground',
    },
} satisfies Record<ToastVariant, { icon: typeof Info; iconClass: string; bar: string }>;

interface TimerState {
    timeout: ReturnType<typeof setTimeout> | null;
    remaining: number;
    startedAt: number;
}

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<ToastItem[]>([]);
    const timers = useRef(new Map<string, TimerState>());

    const clearTimer = useCallback((id: string) => {
        const timer = timers.current.get(id);
        if (!timer) return;
        if (timer.timeout) clearTimeout(timer.timeout);
        timers.current.delete(id);
    }, []);

    const dismiss = useCallback(
        (id: string) => {
            clearTimer(id);
            setToasts((current) => current.filter((toast) => toast.id !== id));
        },
        [clearTimer],
    );

    const armTimer = useCallback(
        (id: string, delay: number) => {
            const existing = timers.current.get(id);
            if (existing?.timeout) clearTimeout(existing.timeout);
            const timeout = setTimeout(() => dismiss(id), delay);
            timers.current.set(id, {
                timeout,
                remaining: delay,
                startedAt: Date.now(),
            });
        },
        [dismiss],
    );

    const toast = useCallback(
        (input: { title: string; description?: string; variant?: ToastVariant }) => {
            const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
            const item: ToastItem = {
                id,
                title: input.title,
                description: input.description,
                variant: input.variant ?? 'info',
            };
            setToasts((current) => [...current, item]);
            armTimer(id, TOAST_DURATION);
        },
        [armTimer],
    );

    const pauseTimer = useCallback((id: string) => {
        const timer = timers.current.get(id);
        if (!timer?.timeout) return;
        clearTimeout(timer.timeout);
        timer.remaining = Math.max(0, timer.remaining - (Date.now() - timer.startedAt));
        timer.timeout = null;
    }, []);

    const resumeTimer = useCallback(
        (id: string) => {
            const timer = timers.current.get(id);
            if (!timer || timer.timeout) return;
            if (timer.remaining <= 0) {
                dismiss(id);
                return;
            }
            armTimer(id, timer.remaining);
        },
        [armTimer, dismiss],
    );

    useEffect(() => {
        const activeTimers = timers.current;
        return () => {
            activeTimers.forEach((timer) => {
                if (timer.timeout) clearTimeout(timer.timeout);
            });
            activeTimers.clear();
        };
    }, []);

    return (
        <ToastContext.Provider value={{ toasts, toast, dismiss }}>
            {children}
            <div className="pointer-events-none fixed inset-x-4 top-4 z-[100] flex flex-col gap-3 sm:inset-x-auto sm:top-6 sm:right-6 sm:w-[380px]">
                {toasts.map((item) => {
                    const variant = toastVariants[item.variant];
                    const Icon = variant.icon;
                    return (
                        <div
                            key={item.id}
                            role={item.variant === 'error' ? 'alert' : 'status'}
                            className="toast-enter pointer-events-auto relative overflow-hidden rounded-xl border bg-card text-card-foreground shadow-lg shadow-black/5"
                            onMouseEnter={() => pauseTimer(item.id)}
                            onMouseLeave={() => resumeTimer(item.id)}
                            onFocusCapture={() => pauseTimer(item.id)}
                            onBlurCapture={(event) => {
                                if (
                                    !event.currentTarget.contains(
                                        event.relatedTarget as Node | null,
                                    )
                                ) {
                                    resumeTimer(item.id);
                                }
                            }}
                        >
                            <div className="flex items-start gap-3 p-4 pr-3">
                                <span
                                    aria-hidden
                                    className={cn(
                                        'flex size-8 shrink-0 items-center justify-center rounded-full',
                                        variant.iconClass,
                                    )}
                                >
                                    <Icon className="size-4" />
                                </span>
                                <div className="min-w-0 flex-1 pt-0.5">
                                    <p className="text-sm leading-5 font-semibold">{item.title}</p>
                                    {item.description && (
                                        <p className="mt-1 text-sm leading-5 text-muted-foreground">
                                            {item.description}
                                        </p>
                                    )}
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="-mt-1 -mr-1 size-7 shrink-0 text-muted-foreground hover:text-foreground"
                                    aria-label="Dismiss notification"
                                    onClick={() => dismiss(item.id)}
                                >
                                    <X className="size-4" />
                                </Button>
                            </div>
                            <span
                                aria-hidden
                                className={cn(
                                    'toast-progress absolute inset-x-0 bottom-0 h-0.5 origin-left',
                                    variant.bar,
                                )}
                                style={{ animationDuration: `${TOAST_DURATION}ms` }}
                            />
                        </div>
                    );
                })}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) throw new Error('useToast must be used within ToastProvider');
    return context;
}
