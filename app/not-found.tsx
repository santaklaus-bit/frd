import { redirect } from "next/navigation";

export default function RootNotFound() {
  return (
    <html lang="fr">
      <body>
        <meta httpEquiv="refresh" content="0; url=/fr" />
        <script dangerouslySetInnerHTML={{ __html: `window.location.href = "/fr"` }} />
      </body>
    </html>
  );
}
