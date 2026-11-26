import type { ComponentProps } from 'react';

export function scrollToHash(href: string): boolean {
    if (!href.startsWith('#')) return false;
    const target = document.getElementById(href.slice(1));
    if (!target) return false;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    window.history.replaceState(window.history.state, '', href);
    return true;
}

type HashLinkProps = ComponentProps<'a'> & { href: string };

export function HashLink({ href, onClick, children, ...props }: HashLinkProps) {
    return (
        <a
            href={href}
            onClick={(event) => {
                if (scrollToHash(href)) event.preventDefault();
                onClick?.(event);
            }}
            {...props}
        >
            {children}
        </a>
    );
}
