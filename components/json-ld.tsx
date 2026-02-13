export default function JsonLd({ lang, dict }: { lang: string; dict: any }) {
  const personData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Farid DANKO",
    url: "https://fariddanko.com",
    image: "https://fariddanko.com/farid-portrait.png",
    jobTitle: lang === "fr" ? "Entrepreneur Social" : "Social Entrepreneur",
    description: dict.seo.home.description,
    sameAs: [
      "https://www.linkedin.com/in/monsieurdanko",
      "https://x.com/monsieurdanko",
      "https://www.facebook.com/monsieurdanko",
      "https://www.instagram.com/monsieurdanko",
    ],
  };

  const websiteData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Farid DANKO",
    url: "https://fariddanko.com",
    description: dict.seo.home.description,
    inLanguage: lang,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteData) }}
      />
    </>
  );
}
