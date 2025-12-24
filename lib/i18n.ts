export type Language = 'fr' | 'en';

export const translations = {
    fr: {
        // Navigation
        nav: {
            about: 'À propos',
            production: 'Production',
            initiatives: 'Initiatives',
            contact: 'Contact',
        },
        // Homepage
        home: {
            hero: {
                title: 'Farid DANKO',
                subtitle: 'Entrepreneur social • Conseiller en développement organisationnel',
                description: 'Je mets mon expertise au service de celles et ceux qui souhaitent entreprendre autrement — avec clarté, cohérence et impact.',
                cta: 'Découvrir mon parcours',
            },
            about: {
                title: 'À propos',
                readMore: 'En savoir plus',
            },
            production: {
                title: 'Production',
                subtitle: 'Des idées, des voix, des réalités, des visions',
                viewAll: 'Voir toutes les productions',
            },
            initiatives: {
                title: 'Initiatives',
                subtitle: 'Projets à impact social et entrepreneurial',
                viewAll: 'Découvrir les initiatives',
            },
            newsletter: {
                title: 'Restez informé',
                description: 'Inscrivez-vous à ma newsletter pour recevoir mes dernières réflexions et actualités.',
                placeholder: 'Votre adresse e-mail',
                button: "S'inscrire",
                success: 'Merci pour votre inscription !',
                error: 'Une erreur est survenue. Veuillez réessayer.',
            },
            collaborations: {
                title: 'Collaborations & Clients',
                subtitle: 'Accompagnement de projets à impact',
            },
        },
        // About page
        about: {
            title: 'À propos de moi',
            background: 'Parcours',
            education: 'Formation',
            expertise: 'Expertise',
            memberships: 'Affiliations professionnelles',
        },
        // Production page
        production: {
            title: 'Production',
            description: 'Je produis ici du contenu pour transmettre: Des idées, des voix, des réalités, des visions.',
            interviews: {
                title: 'Entrevues',
                description: 'Conversations filmées ou audio avec des personnes inspirantes, expertes ou actrices du changement.',
            },
            podcasts: {
                title: 'Podcasts / Audio',
                description: 'Contenus audio ou discussions plus libres, intimes ou analytiques.',
            },
            capsules: {
                title: 'Capsules & Réflexions',
                description: 'Vidéos ou extraits courts où je partage une idée, une réflexion ou une observation.',
            },
            field: {
                title: 'Sur le terrain',
                description: 'Productions réalisées en contexte : immersion dans une communauté, observation d\'un projet, mission sur le terrain.',
            },
            lifestyle: {
                title: 'Lifestyle & Perspectives',
                description: 'Contenus plus personnels qui montrent l\'envers du décor : mon quotidien, mon parcours, mes inspirations.',
            },
        },
        // Initiatives page
        initiatives: {
            title: 'Initiatives',
            description: 'Depuis toujours, je crois en l\'importance d\'agir et de contribuer à créer des opportunités. Cette page présente quelques initiatives que j\'ai portées ou accompagnées, à la croisée de l\'entrepreneuriat, du développement organisationnel et de l\'engagement social.',
        },
        // Contact page
        contact: {
            title: 'Contact',
            description: 'N\'hésitez pas à me contacter pour toute demande de collaboration, entrevue ou message général.',
            form: {
                fullName: 'Nom complet',
                fullNamePlaceholder: 'Votre nom complet',
                email: 'Adresse e-mail',
                emailPlaceholder: 'votre@email.com',
                requestType: 'Type de demande',
                requestTypes: {
                    general: 'Message général',
                    collaboration: 'Collaboration / événement',
                    media: 'Média / entrevue',
                },
                message: 'Message',
                messagePlaceholder: 'Votre message...',
                submit: 'Envoyer',
                sending: 'Envoi en cours...',
                success: 'Message envoyé avec succès !',
                error: 'Une erreur est survenue. Veuillez réessayer.',
            },
            required: 'obligatoire',
        },
        // Footer
        footer: {
            rights: 'Tous droits réservés.',
            newsletter: 'Inscrivez-vous à ma newsletter',
        },
    },
    en: {
        // Navigation
        nav: {
            about: 'About',
            production: 'Production',
            initiatives: 'Initiatives',
            contact: 'Contact',
        },
        // Homepage
        home: {
            hero: {
                title: 'Farid DANKO',
                subtitle: 'Social Entrepreneur • Organizational Development Consultant',
                description: 'I offer my expertise to those who wish to conduct business differently — with clarity, consistency and impact.',
                cta: 'Discover my journey',
            },
            about: {
                title: 'About',
                readMore: 'Read more',
            },
            production: {
                title: 'Production',
                subtitle: 'Ideas, voices, realities, visions',
                viewAll: 'View all productions',
            },
            initiatives: {
                title: 'Initiatives',
                subtitle: 'Social and entrepreneurial impact projects',
                viewAll: 'Discover initiatives',
            },
            newsletter: {
                title: 'Stay Informed',
                description: 'Subscribe to my newsletter to receive my latest thoughts and updates.',
                placeholder: 'Your email address',
                button: 'Subscribe',
                success: 'Thank you for subscribing!',
                error: 'An error occurred. Please try again.',
            },
            collaborations: {
                title: 'Collaborations & Clients',
                subtitle: 'Supporting impactful projects',
            },
        },
        // About page
        about: {
            title: 'About Me',
            background: 'Background',
            education: 'Education',
            expertise: 'Expertise',
            memberships: 'Professional Memberships',
        },
        // Production page
        production: {
            title: 'Production',
            description: 'Here, I produce content to convey ideas, voices, realities and visions.',
            interviews: {
                title: 'Interviews',
                description: 'Filmed or audio conversations with inspiring individuals, experts or change agents.',
            },
            podcasts: {
                title: 'Podcasts / Audio',
                description: 'Audio content or more informal, intimate or analytical discussions.',
            },
            capsules: {
                title: 'Capsules & Reflections',
                description: 'Short videos or clips where I share an idea, a reflection or an observation.',
            },
            field: {
                title: 'In the Field',
                description: 'Productions made in context: immersion in a community, observation of a project, field mission.',
            },
            lifestyle: {
                title: 'Lifestyle & Perspectives',
                description: 'More personal content that shows what goes on behind the scenes: my daily life, my journey, my inspirations.',
            },
        },
        // Initiatives page
        initiatives: {
            title: 'Initiatives',
            description: 'I have always believed in the importance of taking action and helping to create opportunities. This page presents some of the initiatives I have led or supported, at the crossroads of entrepreneurship, organisational development and social engagement.',
        },
        // Contact page
        contact: {
            title: 'Contact',
            description: 'Feel free to contact me for any collaboration, interview or general message.',
            form: {
                fullName: 'Full Name',
                fullNamePlaceholder: 'Your full name',
                email: 'Email Address',
                emailPlaceholder: 'your@email.com',
                requestType: 'Request Type',
                requestTypes: {
                    general: 'General message',
                    collaboration: 'Collaboration / event',
                    media: 'Media / interview',
                },
                message: 'Message',
                messagePlaceholder: 'Your message...',
                submit: 'Send',
                sending: 'Sending...',
                success: 'Message sent successfully!',
                error: 'An error occurred. Please try again.',
            },
            required: 'required',
        },
        // Footer
        footer: {
            rights: 'All rights reserved.',
            newsletter: 'Subscribe to my newsletter',
        },
    },
} as const;

export function getTranslation(lang: Language) {
    return translations[lang];
}
