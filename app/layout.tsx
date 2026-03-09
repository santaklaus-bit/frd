import "@/app/globals.css";
import { GoogleAnalytics } from "@/components/google-analytics";
import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body>
        <GoogleAnalytics />
        <Toaster richColors position="bottom-right" />
        {children}
      </body>
    </html>
  );
}
