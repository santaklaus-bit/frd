'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, Home, RefreshCw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[Global Error Page]', error);
  }, [error]);

  const isDev = process.env.NODE_ENV === 'development';
  const errorCode = error.digest || 'UNKNOWN_ERROR';
  const errorMessage = error.message || 'An unexpected error occurred';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-black p-6">
      <div className="max-w-md w-full space-y-8 text-center">
        {/* Error Icon */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-red-500/20 rounded-full blur-lg"></div>
            <AlertCircle className="relative w-16 h-16 text-red-500" />
          </div>
        </div>

        {/* Error Details */}
        <div className="space-y-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
              Oops!
            </h1>
            <p className="text-lg text-muted-foreground font-medium">
              Something went wrong
            </p>
          </div>

          {/* Error Code */}
          <div className="bg-muted/50 rounded-lg p-4 border border-border/50 text-sm text-muted-foreground font-mono">
            <div className="text-xs opacity-70 mb-1">Error Code:</div>
            <div className="break-all">{errorCode}</div>
          </div>

          {/* Error Message */}
          {isDev && (
            <div className="bg-red-50 dark:bg-red-950/20 rounded-lg p-4 border border-red-200 dark:border-red-900/50 text-left">
              <div className="text-xs font-semibold text-red-700 dark:text-red-400 mb-2">
                Development Only:
              </div>
              <div className="text-sm text-red-600 dark:text-red-300 font-mono break-words">
                {errorMessage}
              </div>
            </div>
          )}

          {/* Help Text */}
          <p className="text-sm text-muted-foreground leading-relaxed">
            Our team has been notified. Try refreshing the page or go back home.
            If the problem persists, please{' '}
            <a
              href="mailto:contact@example.com"
              className="underline text-foreground hover:text-primary transition-colors"
            >
              contact support
            </a>
            .
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button
            onClick={reset}
            variant="default"
            className="flex-1 gap-2 rounded-full"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </Button>
          <Button
            asChild
            variant="outline"
            className="flex-1 gap-2 rounded-full"
          >
            <a href="/">
              <Home className="w-4 h-4" />
              Go Home
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
