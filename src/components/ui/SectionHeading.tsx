import { Button } from "./Button";
import { Reveal } from "./Reveal";
import { cn } from "@/lib/utils";
import { SplitText } from "./SplitText";

/**
 * En-tête de section : libellé espacé (numéro + rubrique, style « C O R P » de la charte), titre 2 tons (1er mot orange),
 * description mono + bouton optionnel alignés à droite.
 */
export function SectionHeading({
  first,
  rest,
  description,
  cta,
  className,
  light = false,
  index,
}: {
  first: string;
  rest: string;
  description?: string;
  cta?: { label: string; href: string };
  className?: string;
  light?: boolean;
  index?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-6 md:flex-row md:items-end md:justify-between", className)}>
      <Reveal>
        {index && <p className={cn("t-eyebrow mb-4 flex items-center gap-3", light ? "text-black/80" : "text-brand")}><span>{index}</span><span aria-hidden className="h-px w-8 bg-current opacity-60" /><span className={light ? undefined : "text-white/70"}>{rest}</span></p>}
        <h2 className={cn("h-section two-tone", light && "text-white")}>
          <span className={light ? "!text-black" : undefined}><SplitText text={first} /></span> <SplitText text={rest} delay={0.1} />
        </h2>
      </Reveal>
      {(description || cta) && (
        <Reveal delay={0.3} className="flex flex-col items-start gap-4 md:items-start md:max-w-[320px]">
          {description && <p className={cn("t-mono", light ? "text-white/80" : "text-muted")}>{description}</p>}
          {cta && <Button href={cta.href} variant="outline" size="sm">{cta.label}</Button>}
        </Reveal>
      )}
    </div>
  );
}
