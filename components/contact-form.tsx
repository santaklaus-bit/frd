"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function ContactForm({ lang, dict }: { lang: string; dict: any }) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    requestType: "general",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          requestType: formData.requestType,
          message: formData.message,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        console.error("[Contact Form] API error:", data);
        
        if (res.status === 400 && data.errors && Array.isArray(data.errors)) {
          // Zod validation errors
          data.errors.forEach((err: any) => toast.error(err.message));
        } else {
          toast.error(
            lang === "fr"
              ? "Une erreur est survenue. Veuillez réessayer."
              : "An error occurred. Please try again."
          );
        }
        return;
      }

      toast.success(
        lang === "fr"
          ? "Message envoyé avec succès !"
          : "Message sent successfully!"
      );
      setFormData({ fullName: "", email: "", requestType: "general", message: "" });
    } catch (err) {
      console.error("[Contact Form] Network error:", err);
      toast.error(
        lang === "fr"
          ? "Erreur réseau. Vérifiez votre connexion."
          : "Network error. Please check your connection."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Full Name */}
      <div>
        <label
          htmlFor="fullName"
          className="block text-sm font-bold uppercase tracking-widest mb-3"
        >
          {dict.contact.name}{" "}
          <span className="text-muted-foreground opacity-50">
            ({lang === "fr" ? "obligatoire" : "required"})
          </span>
        </label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          placeholder={lang === "fr" ? "Votre nom complet" : "Your full name"}
          required
          className="w-full px-6 py-4 rounded-2xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all shadow-sm"
        />
      </div>

      {/* Email */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-bold uppercase tracking-widest mb-3"
        >
          {dict.contact.email}{" "}
          <span className="text-muted-foreground opacity-50">
            (
            {lang === "fr"
              ? "obligatoire, seul canal de réponse"
              : "required, sole means of response"}
            )
          </span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="votre@email.com"
          required
          className="w-full px-6 py-4 rounded-2xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all shadow-sm"
        />
      </div>

      {/* Request Type */}
      <div>
        <label
          htmlFor="requestType"
          className="block text-sm font-bold uppercase tracking-widest mb-3"
        >
          {dict.contact.type}
        </label>
        <select
          id="requestType"
          name="requestType"
          value={formData.requestType}
          onChange={handleChange}
          className="w-full px-6 py-4 rounded-2xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all shadow-sm appearance-none cursor-pointer"
        >
          <option value="general">{dict.contact.options.general}</option>
          <option value="collaboration">
            {dict.contact.options.collaboration}
          </option>
          <option value="media">{dict.contact.options.media}</option>
        </select>
      </div>

      {/* Message */}
      <div>
        <label
          htmlFor="message"
          className="block text-sm font-bold uppercase tracking-widest mb-3"
        >
          {dict.contact.message}
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder={lang === "fr" ? "Votre message..." : "Your message..."}
          required
          rows={6}
          className="w-full px-6 py-4 rounded-2xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all shadow-sm resize-none"
        />
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        size="lg"
        disabled={isSubmitting}
        className="w-full py-8 rounded-2xl text-lg font-bold uppercase tracking-widest transition-transform hover:scale-[1.02]"
      >
        {isSubmitting
          ? lang === "fr"
            ? "Envoi en cours..."
            : "Sending..."
          : lang === "fr"
            ? "Envoyer"
            : "Send"}
      </Button>
    </form>
  );
}
