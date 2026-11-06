"use client";
import { useContent } from "@/components/cms/ContentProvider";
import { useState } from "react";
import { TO_CONFIRM } from "@/data/site";
const projectTypes = [
  "Festival / concert",
  "Lancement de produit",
  "Soirée corporate",
  "Activation de marque",
  "Design d'espace / scénographie",
  "Communication & branding",
  "Autre",
];
import { Reveal } from "@/components/ui/Reveal";
import { ChevronIcon } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";

/**
 * "Nous sommes là pour vous aider" (GLO.FOR) : vidéo de fond radius 16 + formulaire 4 champs / 7 options (structure conservée, LIV.REG.08).
 * Envoi : POST /api/contact, conservation dans le panel. Si le service est injoignable,
 * ouverture d'un e-mail pré-rempli vers OPUS.
 * Textes d'état LIV.TEC.02–04.
 */
type Status = "idle" | "sending" | "sent" | "mailto" | "error";
export function HelpForm({ compact = false }: { compact?: boolean }) {
  const { site, pages } = useContent();
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<
      string,
      string
    >;
    setStatus("sending");
    const mailto = () => {
      if (!site.email) return setStatus("error");
      const text = `Nom : ${data.name}\nE-mail : ${data.email}\nTéléphone : ${data.phone || "—"}\nType de projet : ${data.project}`;
      window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(`Demande de projet — ${data.name}`)}&body=${encodeURIComponent(text)}`;
      setStatus("mailto");
    };
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) return setStatus("sent");
      // Service absent → e-mail pré-rempli ; erreur de validation ou de stockage → message d’erreur.
      if (
        [404, 405, 501].includes(res.status) ||
        !res.headers.get("content-type")?.includes("json")
      )
        return mailto();
      setStatus("error");
    } catch {
      mailto();
    }
  }
  return (
    <section
      className={cn(
        "bg-mint-50",
        compact ? "py-16 md:py-24" : "py-24 md:py-32",
      )}
    >
      <div className="wrap grid grid-cols-1 gap-6 md:grid-cols-2">
        <Reveal className="relative min-h-[520px] overflow-hidden rounded-2xl bg-black text-white md:min-h-[760px]">
          <video
            className="absolute inset-0 h-full w-full object-cover opacity-70"
            src={pages.helpVideo}
            poster={pages.helpPoster}
            autoPlay
            muted
            loop
            playsInline
            preload="none"
            aria-hidden
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/70" />
          <div className="relative flex h-full flex-col justify-between p-6 md:p-8 lg:p-10">
            <div>
              <h2 className="h-section-sm text-white">
                Nous sommes là
                <br />
                pour vous aider
              </h2>
              <p className="t-mono-sm mt-6 max-w-[420px] text-white/85">
                Un événement, une activation, un espace de marque ou un besoin
                de communication ? Parlons de votre projet avec l’équipe OPUS
                CORP.
              </p>
            </div>
            <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <h4 className="font-hanken text-[20px] font-semibold uppercase tracking-[-0.04em] leading-none lg:text-[24px]">
                  Bureau
                </h4>
                <p className="t-mono-sm mt-3 text-white/85">
                  {site.address ? (
                    <>
                      {site.address.line1},<br />
                      {site.address.line2}
                    </>
                  ) : (
                    <>
                      {site.city}
                      <br />
                      <span className="text-white/60">
                        Adresse du bureau : {TO_CONFIRM.toLowerCase()}
                      </span>
                    </>
                  )}
                </p>
              </div>
              <div>
                <h4 className="font-hanken text-[20px] font-semibold uppercase tracking-[-0.04em] leading-none lg:text-[24px]">
                  Support
                </h4>
                <p className="t-mono-sm mt-3 text-white/85">
                  {site.email ? (
                    <a
                      href={`mailto:${site.email}`}
                      className="hover:text-brand"
                    >
                      {site.email}
                    </a>
                  ) : (
                    <span className="text-white/60">
                      E-mail : {TO_CONFIRM.toLowerCase()}
                    </span>
                  )}
                  <br />
                  {site.phone ? (
                    <a
                      href={site.phoneHref || undefined}
                      className="hover:text-brand"
                    >
                      {site.phone}
                    </a>
                  ) : (
                    <span className="text-white/60">
                      Téléphone : {TO_CONFIRM.toLowerCase()}
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.3} className="rounded-2xl bg-bg p-6 md:p-8 lg:p-10">
          <h3 className="h-card text-white">Confiez-nous votre projet</h3>
          <p className="t-body mt-3 text-slate">
            Renseignez vos coordonnées et votre type de projet. Notre équipe
            vous recontactera pour préciser votre besoin.
          </p>
          {status === "sent" || status === "mailto" ? (
            <p
              role="status"
              className="t-mono mt-10 rounded-lg bg-mint-100 p-6 text-white"
            >
              {status === "sent" ? (
                "Votre demande a bien été transmise. L'équipe OPUS CORP vous recontactera."
              ) : (
                <>
                  Votre messagerie s’ouvre avec votre demande pré-remplie : il
                  ne reste qu’à l’envoyer. Rien ne s’ouvre ? Écrivez-nous à{" "}
                  <a
                    href={`mailto:${site.email}`}
                    className="text-brand underline-offset-2 hover:underline"
                  >
                    {site.email}
                  </a>
                  .
                </>
              )}
            </p>
          ) : (
            <form
              className="relative mt-10 flex flex-col gap-7"
              onSubmit={onSubmit}
            >
              <input
                type="text"
                name="company"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden
                className="absolute -left-[9999px] h-0 w-0 opacity-0"
              />
              <Field
                label="Nom :"
                name="name"
                placeholder="Votre nom"
                type="text"
                required
              />
              <Field
                label="E-mail :"
                name="email"
                placeholder="Votre e-mail"
                type="email"
                required
              />
              <Field
                label="Téléphone :"
                name="phone"
                placeholder="Numéro de téléphone"
                type="tel"
              />
              <label className="flex flex-col gap-2">
                <span className="font-inter text-[13px] font-medium uppercase tracking-[-0.02em] text-white">
                  Type de projet :
                </span>
                <span className="relative">
                  <select
                    name="project"
                    className="t-mono-sm w-full border-b border-line bg-transparent py-2 pr-8 text-white outline-none focus:border-brand"
                  >
                    {projectTypes.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                  <ChevronIcon className="pointer-events-none absolute right-0 top-1/2 size-4 -translate-y-1/2 text-white" />
                </span>
              </label>
              <button
                type="submit"
                disabled={status === "sending"}
                className="mt-2 h-12 rounded-full bg-brand font-mono text-[15px] font-medium text-black transition-colors hover:bg-lime disabled:opacity-60"
              >
                {status === "sending"
                  ? "Envoi en cours…"
                  : "Envoyer ma demande"}
              </button>
              {status === "error" && (
                <p role="alert" className="t-mono-sm text-event">
                  L’envoi a échoué. Veuillez réessayer ou nous contacter par
                  e-mail
                  {site.email && (
                    <>
                      {" "}
                      :{" "}
                      <a href={`mailto:${site.email}`} className="underline">
                        {site.email}
                      </a>
                    </>
                  )}
                  .
                </p>
              )}
              <p className="t-mono-sm text-muted">
                Les informations transmises permettent à OPUS CORP de traiter
                votre demande. Consultez nos{" "}
                <a
                  href="/mentions-legales"
                  className="text-brand underline-offset-2 hover:underline"
                >
                  informations sur les données personnelles
                </a>
                .
              </p>
            </form>
          )}
          <div className="mt-10 flex flex-col gap-2">
            {site.whatsapp && (
              <a
                href={site.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="t-mono-sm w-fit text-white transition-colors hover:text-brand"
              >
                Plus rapide : écrivez-nous sur WhatsApp →
              </a>
            )}
            <p className="t-mono-sm text-muted">
              Des expériences de marque depuis {site.since}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  placeholder,
  type,
  required,
}: {
  label: string;
  name: string;
  placeholder: string;
  type: string;
  required?: boolean;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="font-inter text-[13px] font-medium uppercase tracking-[-0.02em] text-white">
        {label}
      </span>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        className="t-mono-sm border-b border-line bg-transparent py-2 text-white outline-none placeholder:text-gray focus:border-brand"
      />
    </label>
  );
}
