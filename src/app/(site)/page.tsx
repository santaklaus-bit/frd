import { Hero } from "@/components/sections/Hero";
import { EventsTicker } from "@/components/sections/EventsTicker";
import { Mission } from "@/components/sections/Mission";
import { FeaturedEvent } from "@/components/sections/FeaturedEvent";
import { MainEvents } from "@/components/sections/MainEvents";
import { RecentEvents } from "@/components/sections/RecentEvents";
import { Services } from "@/components/sections/Services";
import { Team } from "@/components/sections/Team";
import { BookFaq } from "@/components/sections/BookFaq";
import { HelpForm } from "@/components/sections/HelpForm";
import { Articles } from "@/components/sections/Articles";

/**
 * Accueil. Retirés le 25 sept. 2026 (contenus non OPUS) : Confiance / logos partenaires (1 seul client validé : Canal+,
 * déjà visible dans les projets) et Avis des participants (citations Wall Africa, aucun avis OPUS fourni).
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <EventsTicker />
      <Mission />
      <FeaturedEvent />
      <MainEvents />
      <RecentEvents />
      <Services />
      <Team />
      <BookFaq />
      <HelpForm />
      <Articles />
    </>
  );
}
