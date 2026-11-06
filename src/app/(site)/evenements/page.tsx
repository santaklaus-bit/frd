import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { EventsGrid } from "@/components/sections/EventsGrid";
import { publicContent } from "@/lib/cms/content";

export const metadata: Metadata = { title: "Événements — OPUS CORP" };

export default async function EventsPage() {
  const { events } = await publicContent();
  return (
    <>
      <PageHero
        title="Événements"
        subtitle="Découvrez les événements et expériences de marque auxquels OPUS CORP contribue, ainsi que le périmètre de nos interventions."
      >
        {/* EVL.HER.03 : nombre exact à fournir — en attendant, le nombre réel de fiches publiées */}
        <span className="inline-grid h-12 min-w-12 place-items-center rounded-md bg-brand px-3 font-inter text-[18px] font-semibold text-black">
          {String(events.length).padStart(2, "0")}
        </span>
      </PageHero>
      <EventsGrid />
    </>
  );
}
