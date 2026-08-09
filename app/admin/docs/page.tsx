"use client";

import { useState } from "react";
import { 
  FileText, 
  Target, 
  Video, 
  Globe, 
  Mail, 
  Users, 
  ArrowLeft, 
  Settings, 
  Image as ImageIcon, 
  Search,
  BookOpen,
  Layout,
  Type,
  ExternalLink,
  Info,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  ShieldCheck,
  MousePointer2,
  ListOrdered,
  RefreshCcw,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

const SECTIONS = [
  { id: "intro", label: "Guide de Démarrage", icon: Zap, category: "Général" },
  { id: "expertise", label: "Gérer l'Expertise", icon: Target, category: "Contenu Dynamique" },
  { id: "projects", label: "Gérer les Projets", icon: Video, category: "Contenu Dynamique" },
  { id: "blog", label: "Gestion du Blog", icon: FileText, category: "Contenu Dynamique" },
  { id: "i18n", label: "Labels & Traductions", icon: Globe, category: "Paramètres" },
  { id: "media", label: "Optimisation Médias", icon: ImageIcon, category: "Technique" },
  { id: "audience", label: "Audience & Contacts", icon: Mail, category: "Relation Client" },
  { id: "faq", label: "FAQ & Dépannage", icon: HelpCircle, category: "Support" },
];

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState("intro");

  const categories = Array.from(new Set(SECTIONS.map(s => s.category)));

  return (
    <div className="flex flex-col lg:flex-row gap-12 max-w-[1700px] mx-auto px-4 md:px-8 pb-32">
      
      {/* Searchable Sidebar Navigation */}
      <aside className="lg:w-80 shrink-0">
        <div className="sticky top-24 space-y-8">
          <div className="space-y-4">
            <Link href="/admin">
              <Button variant="ghost" className="w-full justify-start -ml-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-xl font-bold">
                <ArrowLeft className="mr-2 h-4 w-4" /> Retour au Dashboard
              </Button>
            </Link>
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                placeholder="Rechercher une aide..." 
                className="w-full h-11 pl-10 pr-4 rounded-2xl bg-muted/30 border border-border/40 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
              />
            </div>
          </div>
          
          <nav className="space-y-8">
            {categories.map(category => (
              <div key={category} className="space-y-2">
                <p className="px-4 text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground/40">
                  {category}
                </p>
                <div className="space-y-1">
                  {SECTIONS.filter(s => s.category === category).map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all duration-300",
                        activeSection === section.id
                          ? "bg-foreground text-background shadow-xl shadow-foreground/10 translate-x-1"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <section.icon className="h-4 w-4 shrink-0" />
                      {section.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content Area: Professional Detailed Content */}
      <main className="flex-1 min-w-0">
        <div className="bg-card border border-border/40 rounded-[3rem] p-10 md:p-16 shadow-2xl shadow-foreground/[0.02] min-h-[85vh] relative overflow-hidden backdrop-blur-sm">
          
          {/* Section Headers (Common Style) */}
          <div className="absolute top-0 right-0 p-16 opacity-[0.03] pointer-events-none">
            {SECTIONS.find(s => s.id === activeSection)?.icon && 
              (() => {
                const Icon = SECTIONS.find(s => s.id === activeSection)!.icon;
                return <Icon className="w-64 h-64 rotate-12" />;
              })()
            }
          </div>

          {activeSection === "intro" && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">
                  <ShieldCheck className="h-3 w-3" /> Espace Administrateur Sécurisé
                </div>
                <h1 className="text-5xl md:text-6xl font-black tracking-tighter leading-none">
                  Maîtrisez votre <br/><span className="text-muted-foreground/40">Plateforme Digitale.</span>
                </h1>
                <p className="text-xl text-muted-foreground font-medium leading-relaxed max-w-2xl">
                  Bienvenue dans le manuel d&apos;utilisation officiel. Ce guide est conçu pour vous offrir une autonomie totale sur la gestion de vos contenus, de vos projets et de votre audience.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                 {[
                   { title: "Dynamisme", desc: "Modifiez vos textes et images en temps réel sans code.", color: "text-blue-500", bg: "bg-blue-500/5", icon: RefreshCcw },
                   { title: "Bilingue", desc: "Chaque mot est traduisible pour une audience mondiale.", color: "text-indigo-500", bg: "bg-indigo-500/5", icon: Globe },
                   { title: "Performance", desc: "Le site est optimisé pour charger à la vitesse de l'éclair.", color: "text-emerald-500", bg: "bg-emerald-500/5", icon: Zap },
                 ].map((feat) => (
                   <div key={feat.title} className={cn("p-8 rounded-[2rem] border border-border/40 space-y-4", feat.bg)}>
                      <feat.icon className={cn("h-6 w-6", feat.color)} />
                      <h4 className="font-black text-lg uppercase tracking-tight">{feat.title}</h4>
                      <p className="text-sm text-muted-foreground font-medium leading-relaxed">{feat.desc}</p>
                   </div>
                 ))}
              </div>

              <div className="space-y-6">
                <h3 className="text-2xl font-bold tracking-tight border-b border-border/40 pb-4">Checklist de Publication Rapide</h3>
                <div className="grid gap-4">
                  {[
                    "Vérifiez que vous avez saisi le contenu en Français ET en Anglais.",
                    "Optimisez vos visuels (moins de 200Ko par image).",
                    "Assurez-vous que l'URL (Slug) est explicite et sans caractères spéciaux.",
                    "Enregistrez l'ordre des éléments pour la mise en page (Expertise/Projets)."
                  ].map((item, idx) => (
                    <div key={idx} className="flex gap-4 items-start p-5 rounded-2xl bg-muted/20 border border-border/40 font-medium">
                      <span className="flex-none w-6 h-6 rounded-full bg-foreground text-background flex items-center justify-center text-[10px] font-black">{idx+1}</span>
                      <p className="text-sm text-muted-foreground">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeSection === "expertise" && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
               <div className="space-y-4">
                <h1 className="text-5xl font-black tracking-tighter">Gestion de l&apos;Expertise</h1>
                <p className="text-xl text-muted-foreground font-medium leading-relaxed">
                  L&apos;expertise est le pilier de votre site. Elle permet de détailler vos compétences avec un rendu propre au &quot;Case Study&quot;.
                </p>
              </div>

              <div className="p-10 rounded-[3rem] border border-border/40 bg-muted/20 space-y-8 relative overflow-hidden group">
                 <div className="space-y-2">
                    <h3 className="text-2xl font-bold tracking-tight">Le champ &quot;Content&quot; (Corps de Page)</h3>
                    <p className="text-sm text-muted-foreground font-medium max-w-xl">
                      C&apos;est ici que se joue la différence entre une simple accroche et une page qui convertit.
                    </p>
                 </div>
                 
                 <div className="grid md:grid-cols-2 gap-10 font-medium">
                    <div className="space-y-6">
                       <h5 className="flex items-center gap-2 font-black text-xs uppercase tracking-widest text-primary">
                          <CheckCircle2 className="h-4 w-4" /> Bonnes Pratiques
                       </h5>
                       <ul className="space-y-3 text-sm text-muted-foreground list-none p-0">
                          <li>• Divisez vos textes en paragraphes courts.</li>
                          <li>• Utilisez des listes à puces pour les livrables.</li>
                          <li>• Exprimez clairement la valeur ajoutée apportée.</li>
                       </ul>
                    </div>
                    <div className="space-y-6">
                       <h5 className="flex items-center gap-2 font-black text-xs uppercase tracking-widest text-amber-500">
                          <AlertTriangle className="h-4 w-4" /> À Éviter
                       </h5>
                       <ul className="space-y-3 text-sm text-muted-foreground list-none p-0">
                          <li>• Copier-coller sans mise en forme.</li>
                          <li>• Oublier la traduction d&apos;une des deux langues.</li>
                          <li>• Utiliser des titres trop longs qui cassent le design.</li>
                       </ul>
                    </div>
                 </div>
              </div>

              <div className="space-y-6 font-medium">
                  <h3 className="text-2xl font-bold tracking-tight">Espace d&apos;Édition Pas-à-Pas</h3>
                  <div className="grid gap-6">
                      <div className="flex gap-6 items-start p-8 rounded-[2rem] border border-border/40 bg-card hover:border-primary/20 transition-all group">
                         <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-background transition-all">
                            <Type className="h-6 w-6" />
                         </div>
                         <div className="space-y-1">
                            <h4 className="font-bold underline md:no-underline underline-offset-4">Étape 1 : Titres & Slugs</h4>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              Saisissez un titre percutant. Le &quot;Slug&quot; (URL) se génère seul, mais vous pouvez le personnaliser (ex: `strategie-digitale`).
                            </p>
                         </div>
                      </div>
                      <div className="flex gap-6 items-start p-8 rounded-[2rem] border border-border/40 bg-card hover:border-primary/20 transition-all group">
                         <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-background transition-all">
                            <ListOrdered className="h-6 w-6" />
                         </div>
                         <div className="space-y-1">
                            <h4 className="font-bold underline md:no-underline underline-offset-4">Étape 2 : L&apos;Ordre d&apos;Affichage</h4>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              Une fois vos expertises créées, utilisez les flèche de tri dans la liste et appuyez sur &quot;Enregistrer l&apos;ordre&quot;. C&apos;est crucial pour la home page.
                            </p>
                         </div>
                      </div>
                  </div>
              </div>
            </div>
          )}

          {activeSection === "projects" && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
               <div className="space-y-4">
                <h1 className="text-5xl font-black tracking-tighter">Projets & Réalisations</h1>
                <p className="text-xl text-muted-foreground font-medium leading-relaxed">
                  Gérez votre galerie et vos productions audiovisuelles, audio ou stratégiques.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="p-10 rounded-[3rem] bg-indigo-500/5 border border-indigo-500/10 space-y-6">
                  <h3 className="text-xl font-bold tracking-tight">Configuration d&apos;un Projet</h3>
                  <div className="space-y-4 text-sm font-medium text-muted-foreground">
                    <p>Pour chaque projet, vous devez renseigner :</p>
                    <ul className="space-y-3">
                      <li className="flex items-center gap-3"><CheckCircle2 className="h-4 w-4 text-indigo-500" /> **L&apos;Image** : Une vignette haute définition.</li>
                      <li className="flex items-center gap-3"><CheckCircle2 className="h-4 w-4 text-indigo-500" /> **La Catégorie** : Ex: &quot;Vidéos&quot;, &quot;Audio&quot;, &quot;Podcast&quot;.</li>
                      <li className="flex items-center gap-3"><CheckCircle2 className="h-4 w-4 text-indigo-500" /> **Le Lien (Href)** : URL vers YouTube, SoundCloud, etc.</li>
                    </ul>
                  </div>
                </div>
                <div className="p-10 rounded-[3rem] bg-muted/20 border border-border/40 flex flex-col justify-center space-y-4">
                   <Info className="h-8 w-8 text-muted-foreground/30" />
                   <p className="text-sm font-bold text-muted-foreground leading-relaxed">
                     L&apos;interface publique trie automatiquement vos projets par catégorie. Assurez-vous d&apos;utiliser des noms de catégories cohérents entre les projets (ex: écrivez &quot;Audit&quot; partout, pas &quot;Audits&quot; puis &quot;Audit&quot;).
                   </p>
                </div>
              </div>
            </div>
          )}

          {activeSection === "blog" && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
               <div className="space-y-4">
                <h1 className="text-5xl font-black tracking-tighter">Édition d&apos;Articles (Blog)</h1>
                <p className="text-xl text-muted-foreground font-medium leading-relaxed">
                  Le blog est votre outil pour démontrer votre leadership d&apos;opinion.
                </p>
              </div>

              <div className="space-y-8 font-medium">
                 <div className="bg-card border border-border/40 rounded-[2rem] p-8 space-y-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12 group-hover:scale-110 transition-transform duration-700">
                      <Settings className="w-16 h-16" />
                    </div>
                    <h3 className="text-2xl font-bold tracking-tight">Paramètres d&apos;Article</h3>
                    <div className="grid sm:grid-cols-2 gap-8">
                       <div className="space-y-2">
                          <p className="text-xs font-black uppercase tracking-widest text-primary">Metadata SEO</p>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            Chaque article doit avoir sa propre Description de Blog (Snippet). Elle s&apos;affiche dans les résultats Google.
                          </p>
                       </div>
                       <div className="space-y-2">
                          <p className="text-xs font-black uppercase tracking-widest text-primary">Auteur & Photo</p>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            Par défaut : &quot;Farid DANKO&quot; avec votre portrait. Vous pouvez toutefois attribuer l&apos;article à un autre contributeur si nécessaire.
                          </p>
                       </div>
                    </div>
                 </div>

                 <div className="flex gap-4 p-8 rounded-3xl bg-amber-500/5 border border-amber-500/10 text-amber-600 text-sm italic">
                    <AlertTriangle className="h-5 w-5 shrink-0" />
                    Attention : Une date invalide dans vos données d&apos;article peut empêcher l&apos;article de s&apos;afficher si vous utilisez un tri chronologique strict côté serveur.
                 </div>
              </div>
            </div>
          )}

          {activeSection === "i18n" && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
               <div className="space-y-4">
                <h1 className="text-5xl font-black tracking-tighter leading-none">Labels & <br/><span className="text-muted-foreground/40">Traductions Globales.</span></h1>
                <p className="text-xl text-muted-foreground font-medium leading-relaxed">
                  Gérez les textes &quot;fixes&quot; qui se trouvent dans les menus, le pied de page et les formulaires.
                </p>
              </div>

              <div className="p-10 border border-border border-l-4 border-l-indigo-500 rounded-[2rem] bg-card space-y-8 shadow-sm">
                 <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center shrink-0">
                       <Globe className="h-6 w-6" />
                    </div>
                    <h3 className="text-2xl font-bold tracking-tight">Comprendre le système Clé/Valeur</h3>
                 </div>
                 
                 <div className="space-y-4 text-sm font-medium text-muted-foreground leading-relaxed">
                    <p>Le site utilise des identifiants appelés **Clés** pour savoir quel texte afficher à quel endroit.</p>
                    <div className="grid gap-4 bg-muted/30 p-8 rounded-2xl border border-border/40 font-mono text-xs">
                       <div className="flex flex-col gap-2">
                          <span className="text-primary font-bold">Clé : nav.home</span>
                          <span className="text-foreground">Valeur FR : &quot;Accueil&quot;</span>
                          <span className="text-foreground">Valeur EN : &quot;Home&quot;</span>
                       </div>
                    </div>
                 </div>

                 <div className="bg-primary/5 p-6 rounded-2xl border border-primary/20 flex gap-4 items-center font-bold text-primary italic">
                    <AlertTriangle className="h-5 w-5 shrink-0" />
                    <p className="text-sm m-0">Ne modifiez jamais le nom de la &quot;Clé&quot;, modifiez uniquement sa valeur associée.</p>
                 </div>
              </div>
            </div>
          )}

          {activeSection === "media" && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
               <div className="space-y-4">
                <h1 className="text-5xl font-black tracking-tighter">Optimisation Médias</h1>
                <p className="text-xl text-muted-foreground font-medium leading-relaxed">
                  La vitesse de votre site dépend à 90% de la taille de vos images.
                </p>
              </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-8 font-medium">
                     <h3 className="text-2xl font-bold tracking-tight mb-6">Guide des Formats</h3>
                     <div className="space-y-6">
                        {[
                          { fmt: ".webp", usage: "Le meilleur format actuel. Ultra-léger, idéal pour tout.", icon: CheckCircle2, color: "text-emerald-500" },
                          { fmt: ".jpg / .jpeg", usage: "Pour les photos si le .webp n'est pas possible.", icon: CheckCircle2, color: "text-blue-500" },
                          { fmt: ".png", usage: "Uniquement pour les logos ou images à fond transparent.", icon: Info, color: "text-indigo-500" }
                        ].map(f => (
                          <div key={f.fmt} className="flex gap-4 items-start border-l-2 border-border/40 pl-6 py-2">
                             <f.icon className={cn("h-4 w-4 shrink-0 mt-1", f.color)} />
                             <div className="space-y-1">
                                <p className="text-sm font-black uppercase text-foreground">{f.fmt}</p>
                                <p className="text-sm text-muted-foreground leading-relaxed">{f.usage}</p>
                             </div>
                          </div>
                        ))}
                     </div>
                  </div>

                  <div className="bg-foreground text-background p-12 rounded-[3.5rem] flex flex-col justify-center gap-8 relative overflow-hidden">
                     <ImageIcon className="absolute -top-12 -right-12 w-64 h-64 opacity-5" />
                     <h3 className="text-3xl font-black tracking-tighter leading-none mb-4">Le Chiffre d&apos;Or : <br/><span className="text-primary-foreground">200 Ko.</span></h3>
                     <p className="text-sm font-medium leading-relaxed opacity-80">
                        Essayez de ne jamais dépasser ce poids pour une image. Un site rapide est un site mieux référencé par Google.
                     </p>
                     <div className="pt-4 border-t border-background/20 font-bold italic opacity-60 text-xs uppercase tracking-widest">
                       Astuce : des outils en ligne gratuits comme &quot;Bulk Resize Photos&quot; ou &quot;TinyPNG&quot; sont vos meilleurs amis.
                     </div>
                  </div>
               </div>
            </div>
          )}

          {activeSection === "audience" && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
               <div className="space-y-4">
                <h1 className="text-5xl font-black tracking-tighter">Audience & Contacts</h1>
                <p className="text-xl text-muted-foreground font-medium leading-relaxed">
                  Récupérez vos prospects et gérez vos abonnés newsletter.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 font-medium">
                 <div className="p-10 rounded-[2.5rem] border border-border/40 bg-card space-y-6 flex flex-col shadow-sm">
                    <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-600 flex items-center justify-center">
                       <Mail className="h-6 w-6" />
                    </div>
                    <h4 className="text-2xl font-bold tracking-tight">Boîte de Réception</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                      Les messages de contact sont triés par type (Général, Collaboration, Média). Cliquez sur le cercle pour marquer un message comme &quot;Lu&quot; ou &quot;Non Lu&quot;.
                    </p>
                 </div>
                 <div className="p-10 rounded-[2.5rem] border border-border/40 bg-card space-y-6 flex flex-col shadow-sm">
                    <div className="w-12 h-12 rounded-2xl bg-pink-500/10 text-pink-600 flex items-center justify-center">
                       <Users className="h-6 w-6" />
                    </div>
                    <h4 className="text-2xl font-bold tracking-tight">Base Newsletter</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                      Tous les emails saisis en pied de page se trouvent ici. Ils sont groupés par mois d&apos;inscription pour vous permettre de voir la croissance de votre audience.
                    </p>
                 </div>
              </div>
            </div>
          )}

          {activeSection === "faq" && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
               <div className="space-y-4">
                <h1 className="text-5xl font-black tracking-tighter">FAQ & Dépannage</h1>
                <p className="text-xl text-muted-foreground font-medium leading-relaxed">
                  Questions fréquentes et solutions rapides pour les cas courants.
                </p>
              </div>

              <div className="space-y-6 font-medium">
                 {[
                   { q: "Pourquoi mon image n'apparaît pas sur le site public ?", a: "Vérifiez que vous avez bien enregistré le formulaire. Si l'image est trop lourde (> 5Mo), l'upload peut échouer silencieusement. Réessayez avec une image compressée." },
                   { q: "Comment modifier l'ordre des expertises sur la page d'accueil ?", a: "Allez dans Admin > Expertise, utilisez les boutons de flèche pour réordonner les éléments, puis cliquez sur le bouton vert 'Enregistrer l&apos;ordre' qui apparaîtra en haut de liste." },
                   { q: "J'ai modifié un texte mais il s'affiche encore en Français sur la version Anglaise ?", a: "Vous devez modifier le texte dans les deux onglets ou deux champs correspondants (FR et EN). Le site ne traduit pas automatiquement vos contenus dynamiques." },
                   { q: "Comment supprimer totalement un message de contact ?", a: "Utilisez le bouton de corbeille (Trash) à côté du message dans la console Contacts. Attention, cette action est irréversible." }
                 ].map((faq, idx) => (
                   <div key={idx} className="p-8 rounded-[2rem] border border-border/40 bg-muted/10 space-y-3 hover:bg-card hover:shadow-lg transition-all duration-300">
                      <h4 className="font-black text-foreground flex items-start gap-3">
                         <HelpCircle className="h-5 w-5 shrink-0 text-primary mt-0.5" />
                         {faq.q}
                      </h4>
                      <div className="pl-8 text-sm text-muted-foreground leading-relaxed">
                         {faq.a}
                      </div>
                   </div>
                 ))}
              </div>

               <div className="bg-primary/5 p-10 rounded-[3rem] border border-primary/20 flex flex-col items-center text-center space-y-4 font-black">
                 <MousePointer2 className="h-10 w-10 text-primary mb-2" />
                 <h3 className="text-2xl text-foreground">Une question plus complexe ?</h3>
                 <p className="text-sm text-muted-foreground max-w-sm">
                   Si vous ne trouvez pas la réponse ici, contactez l&apos;équipe technique pour une assistance personnalisée.
                 </p>
                 <Button className="rounded-full px-12 h-12 text-[10px] uppercase font-black tracking-widest mt-4">
                    Contacter le Support
                 </Button>
               </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
