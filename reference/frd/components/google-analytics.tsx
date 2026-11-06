"use client";

import Script from "next/script";
import { Suspense, useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { GA_MEASUREMENT_ID, isGaEnabled, pageview } from "@/lib/gtag";

/**
 * Fires a page_view on every App Router navigation.
 * gtag.js only auto-tracks the very first (hard) page load, so client-side
 * navigations would otherwise be invisible in GA4.
 */
function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastUrl = useRef<string | null>(null);

  useEffect(() => {
    if (!isGaEnabled || !pathname) return;

    const query = searchParams?.toString();
    const url = query ? `${pathname}?${query}` : pathname;

    // Avoid duplicate hits when only a hash or a re-render changes
    if (lastUrl.current === url) return;
    lastUrl.current = url;

    pageview(url);
  }, [pathname, searchParams]);

  return null;
}

export function GoogleAnalytics() {
  if (!isGaEnabled) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[Analytics] NEXT_PUBLIC_GA_MEASUREMENT_ID is missing or is still the placeholder (G-XXXXXXXXXX). Client-side tracking is disabled."
      );
    }
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            send_page_view: false,
          });
        `}
      </Script>
      <Suspense fallback={null}>
        <PageViewTracker />
      </Suspense>
    </>
  );
}
