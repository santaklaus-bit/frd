"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Mail } from "lucide-react";

export function Newsletter({ lang, dict }: { lang: string; dict: any }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    // TODO: Integrate with actual newsletter service (e.g., Mailchimp, Loops, etc.)
    setTimeout(() => {
      console.log("Newsletter subscription:", email);
      setStatus("success");
      setEmail("");
      setTimeout(() => setStatus("idle"), 5000);
    }, 1000);
  };

  return (
    <section className="py-24 px-6 relative overflow-hidden bg-black dark:bg-white text-white dark:text-black rounded-[3rem] mx-6 mb-24">
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-white/10 dark:bg-black/10 mb-8 backdrop-blur">
          <Mail className="h-8 w-8" />
        </div>
        <h2 className="text-4xl md:text-5xl font-bold mb-6 uppercase tracking-tighter">
          {dict.newsletter.title}
        </h2>
        <p className="text-xl md:text-2xl text-white/70 dark:text-black/70 mb-12 max-w-2xl mx-auto font-medium">
          {dict.newsletter.description}
        </p>

        <form
          onSubmit={handleSubmit}
          className="relative max-w-lg mx-auto group"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={dict.newsletter.placeholder}
              required
              className="flex-1 px-8 py-5 rounded-full bg-white/10 dark:bg-black/10 border border-white/20 dark:border-black/20 text-white dark:text-black placeholder:text-white/40 dark:placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-white dark:focus:ring-black transition-all"
            />
            <Button
              type="submit"
              disabled={status === "loading"}
              className="px-10 py-5 h-auto rounded-full bg-white text-black dark:bg-black dark:text-white font-bold uppercase tracking-widest hover:scale-105 transition-transform"
            >
              {status === "loading" ? "..." : dict.newsletter.button}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

          {/* Status Messages */}
          {status === "success" && (
            <div className="absolute top-full left-0 right-0 mt-6 animate-in fade-in slide-in-from-top-4">
              <p className="text-sm font-bold uppercase tracking-widest">
                {dict.newsletter.success}
              </p>
            </div>
          )}
          {status === "error" && (
            <div className="absolute top-full left-0 right-0 mt-6 animate-in fade-in slide-in-from-top-4">
              <p className="text-sm font-bold uppercase tracking-widest text-red-500">
                {dict.newsletter.error}
              </p>
            </div>
          )}
        </form>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 dark:bg-black/5 rounded-full -mr-48 -mt-48 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 dark:bg-black/5 rounded-full -ml-48 -mb-48 blur-3xl" />
    </section>
  );
}
