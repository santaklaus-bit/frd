import "@/app/globals.css";
import { GoogleAnalytics } from "@/components/google-analytics";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body>
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  );
}
