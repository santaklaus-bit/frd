import { Metadata } from "next";
import { siteConfig } from "@/lib/site";

export const metadataKeywords = [
    "Blog",
    "Entrepreneur social",
    "Développement durable",
    "Impact",
    "Leadership",
    "Gestion de projet",
    "Conseil",
    "Organisations",
    "Innovation sociale",
]

export const metadata: Metadata = {
    title: siteConfig.name,
    description: siteConfig.description,
    keywords: metadataKeywords,
    authors: [
        {
            name: "Farid Danko",
            url: siteConfig.url,
        },
    ],
    creator: "Farid Danko",
    openGraph: {
        type: "website",
        locale: "fr_FR",
        url: siteConfig.url,
        title: siteConfig.name,
        description: siteConfig.description,
        siteName: siteConfig.name,
    },
    twitter: {
        card: "summary_large_image",
        title: siteConfig.name,
        description: siteConfig.description,
        creator: "@FaridDanko",
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
};