"use client";

import { motion } from "framer-motion";
import { Star, CheckCircle2 } from "lucide-react";

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
                    <p className="text-sm font-bold text-foreground">{name(testimonial)}</p>
                    <p className="text-xs text-muted-foreground">{role(testimonial)}</p>
                  </div>
                </div>

                {/* Certification Badge */}
                {testimonial.certified && (
                  <div className="flex-shrink-0">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-500/15 border border-blue-500/30">
                      <CheckCircle2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                        {lang === "fr" ? "Certifié" : "Verified"}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
