import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught application error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-[400px] flex flex-col items-center justify-center text-center p-6 bg-gray-50 dark:bg-gray-900">
                    <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-4">
                        Oops, something went wrong.
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
                        {this.state.error?.message || 'An unexpected error caused the application to crash.'}
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-pink-500 text-white px-6 py-2 rounded-md hover:bg-pink-600 transition-colors"
                    >
                        Reload Page
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}