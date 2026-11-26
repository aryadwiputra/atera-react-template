import type { ReactNode } from 'react';

type FormProps = { label: string; error?: string; children: ReactNode };

export function Field({ label, error, children }: FormProps) {
    return (
        <label className="grid gap-2 text-sm font-medium">
            {label}
            {children}
            {error && <span className="text-xs text-destructive">{error}</span>}
        </label>
    );
}
