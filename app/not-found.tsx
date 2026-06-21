'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft, Home, Search } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-black p-6">
      <div className="max-w-md w-full space-y-8 text-center">
        {/* 404 Illustration */}
        <div className="space-y-4">
          <h1 className="text-8xl md:text-9xl font-bold tracking-tighter text-black/10 dark:text-white/10">
            404
          </h1>
          <div className="space-y-2 -mt-8">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Page Not Found
            </h2>
            <p className="text-lg text-muted-foreground">
              Sorry, the page you are looking for doesn't exist or has been moved.
            </p>
          </div>
        </div>

        {/* Search Suggestion */}
        <div className="bg-muted/50 rounded-lg p-4 border border-border/50 space-y-3">
          <div className="flex justify-center">
            <Search className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="text-sm text-muted-foreground">
            <p className="font-medium mb-2">Here's what you can try:</p>
            <ul className="text-left space-y-1 text-xs">
              <li>• Check the URL for typos</li>
              <li>• Go back to the previous page</li>
              <li>• Return to the home page</li>
              <li>• Use the search function (if available)</li>
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button
            asChild
            variant="default"
            className="flex-1 gap-2 rounded-full"
          >
            <Link href="/fr">
              <Home className="w-4 h-4" />
              Go Home
            </Link>
          </Button>
          <Button
            variant="outline"
            className="flex-1 gap-2 rounded-full"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}
