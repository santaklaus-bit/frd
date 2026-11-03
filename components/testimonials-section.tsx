"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

function VerifiedBadge({ label }: { label: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      role="img"
      aria-label={label}
      className="h-[18px] w-[18px] flex-shrink-0"
    >
      <title>{label}</title>
      <path
        fill="#1D9BF0"
        d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91C2.88 9.33 2 10.57 2 12s.88 2.67 2.19 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.26 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.45 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34z"
      />
      <path
        fill="none"
        stroke="#fff"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7.8 12.4l2.9 2.9 5.5-5.8"
      />
    </svg>
  );
}

interface Testimonial {
  id: number;
  name: { fr: string; en: string };
  role: { fr: string; en: string };
  content: { fr: string; en: string };
  image: string | null;
  certified: boolean;
  rating: number;
}

export function TestimonialsSection({
  testimonials,
  lang,
}: {
  testimonials: Testimonial[];
  lang: "fr" | "en";
}) {
  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  const name = (t: Testimonial) => t.name[lang as keyof typeof t.name] || t.name.fr;
  const role = (t: Testimonial) => t.role[lang as keyof typeof t.role] || t.role.fr;
  const content = (t: Testimonial) => t.content[lang as keyof typeof t.content] || t.content.fr;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section className="py-16 md:py-28 border-t border-border/40">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12 md:mb-16 text-center space-y-4"
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">
            {lang === "fr" ? "Retours de clients" : "Client testimonials"}
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-tight">
            {lang === "fr" ? "Preuves sociales" : "Social proof"}
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {lang === "fr"
              ? "Des professionnels et entrepreneurs qui ont bénéficié de notre accompagnement partagent leur expérience."
              : "Professionals and entrepreneurs who benefited from our support share their experience."}
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {testimonials.map((testimonial) => (
            <motion.div
              key={testimonial.id}
              variants={itemVariants}
              className="group relative p-6 md:p-8 rounded-2xl border border-border/40 bg-card hover:border-primary/40 hover:shadow-lg transition-all duration-300"
            >
              {/* Rating Stars */}
              <div className="flex items-center gap-1.5 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Content */}
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-6">
                "{content(testimonial)}"
              </p>

              {/* Author Info */}
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  {testimonial.image && (
                    <div className="relative h-12 w-12 rounded-full overflow-hidden bg-muted flex-shrink-0">
                      <img
                        src={testimonial.image}
                        alt={name(testimonial)}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="space-y-1">
                    <p className="flex items-center gap-1.5 text-sm font-bold text-foreground">
                      {testimonial.certified && (
                        <VerifiedBadge label={lang === "fr" ? "Certifié" : "Verified"} />
                      )}
                      {name(testimonial)}
                    </p>
                    <p className="text-xs text-muted-foreground">{role(testimonial)}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
