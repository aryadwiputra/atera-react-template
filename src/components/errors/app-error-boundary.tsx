import { Component, type ErrorInfo, type ReactNode } from 'react';
import { ErrorPageTemplate } from './error-page';

interface AppErrorBoundaryProps {
    children: ReactNode;
}

interface AppErrorBoundaryState {
    error: Error | null;
}

export class AppErrorBoundary extends Component<AppErrorBoundaryProps, AppErrorBoundaryState> {
    state: AppErrorBoundaryState = { error: null };

    static getDerivedStateFromError(error: Error): AppErrorBoundaryState {
        return { error };
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        if (import.meta.env.DEV) {
            console.error(error, info);
        }
    }

    render() {
        const { error } = this.state;
        if (error) {
            return (
                <ErrorPageTemplate
                    code="500"
                    title="Something went wrong"
                    description={error.message || 'An unexpected error occurred. Please try again.'}
                    homeHref="/"
                    onRetry={() => window.location.reload()}
                />
            );
        }
        return this.props.children;
    }
}
