import { Testimonial } from "../lib/db/models/testimonial.ts";
import sequelize from "../lib/db/sequelize.ts";

const testimonials = [
  {
    nameFr: "Marie Dupont",
    nameEn: "Marie Dupont",
    roleFr: "Fondatrice, Coopérative de femmes entrepreneures",
    roleEn: "Founder, Women Entrepreneurs Cooperative",
    contentFr: "Farid a transformé notre vision en stratégie concrète. Son accompagnement a permis à notre coopérative de croître de 40% en un an.",
    contentEn: "Farid transformed our vision into concrete strategy. His support enabled our cooperative to grow by 40% in one year.",
    certified: true,
    rating: 5,
    image: null,
    order: 1,
  },
  {
    nameFr: "Jean-Pierre Martin",
    nameEn: "Jean-Pierre Martin",
    roleFr: "Directeur général, ONG environnementale",
    roleEn: "General Director, Environmental NGO",
    contentFr: "L'expertise de Farid en développement organisationnel a révolutionné notre structure interne et notre impact social.",
    contentEn: "Farid's expertise in organizational development revolutionized our internal structure and social impact.",
    certified: true,
    rating: 5,
    image: null,
    order: 2,
  },
  {
    nameFr: "Amara Sow",
    nameEn: "Amara Sow",
    roleFr: "Responsable projet, Initiative d'inclusion socioprofessionnelle",
    roleEn: "Project Manager, Socioprofessional Inclusion Initiative",
    contentFr: "L'approche systémique de Farid et sa connaissance du terrain ont été déterminantes pour le succès de notre programme d'employabilité.",
    contentEn: "Farid's systemic approach and field knowledge were decisive for the success of our employability program.",
    certified: true,
    rating: 5,
    image: null,
    order: 3,
  },
  {
    nameFr: "Sophie Bernard",
    nameEn: "Sophie Bernard",
    roleFr: "Gérante, Startup agritech",
    roleEn: "Manager, Agritech Startup",
    contentFr: "Farid a su nous guider dans les phases critiques de notre développement. Son mentorat nous a permis de sécuriser des financements majeurs.",
    contentEn: "Farid guided us through critical phases of our development. His mentorship helped us secure major funding.",
    certified: true,
    rating: 5,
    image: null,
    order: 4,
  },
  {
    nameFr: "David Okonkwo",
    nameEn: "David Okonkwo",
    roleFr: "Coordinateur régional, Programme de développement économique",
    roleEn: "Regional Coordinator, Economic Development Program",
    contentFr: "La capacité de Farid à créer du consensus et à mobiliser les acteurs autour d'une vision commune est remarquable.",
    contentEn: "Farid's ability to create consensus and mobilize stakeholders around a shared vision is remarkable.",
    certified: false,
    rating: 5,
    image: null,
    order: 5,
  },
  {
    nameFr: "Fatima Traoré",
    nameEn: "Fatima Traoré",
    roleFr: "Présidente, Réseau de femmes entrepreneuses",
    roleEn: "President, Women Entrepreneurs Network",
    contentFr: "Un partenaire fiable qui comprend réellement les enjeux des organisations sociales et la complexité du terrain.",
    contentEn: "A reliable partner who truly understands the challenges of social organizations and field complexity.",
    certified: true,
    rating: 5,
    image: null,
    order: 6,
  },
];

async function seedTestimonials() {
  try {
    await sequelize.authenticate();
    console.log("✓ Database connection established");

    // Clear existing testimonials
    await Testimonial.destroy({ where: {} });
    console.log("✓ Cleared existing testimonials");

    // Create new testimonials
    await Testimonial.bulkCreate(testimonials);
    console.log(`✓ Created ${testimonials.length} testimonials`);

    console.log("\n✅ Seeding complete!");
  } catch (error) {
    console.error("❌ Error seeding testimonials:", error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

seedTestimonials();
