import { PageHero } from "@/components/ui/PageHero";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <>
      <PageHero title="404" subtitle="Cette page n'existe pas ou a été déplacée.">
        <Button href="/" size="sm">Retour à l’accueil</Button>
      </PageHero>
      <div className="pb-32" />
    </>
  );
}
