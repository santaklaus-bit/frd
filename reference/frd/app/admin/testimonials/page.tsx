import { getTestimonials } from "@/lib/content-manager";
import TestimonialsList from "@/components/admin/testimonials-list";

export const dynamic = "force-dynamic";

export default async function TestimonialsAdminPage() {
  const testimonials = await getTestimonials();

  return <TestimonialsList initialData={testimonials} />;
}
