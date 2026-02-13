import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { getBlogPosts, getData } from "@/lib/content-manager";
import { FileText, Target, Video, Globe } from "lucide-react";

export default async function AdminDashboard() {
  const posts = await getBlogPosts();
  const initiatives = await getData("initiatives");
  const production = await getData("production");

  const stats = [
    {
      label: "Articles de Blog",
      value: posts.length,
      icon: FileText,
      color: "text-blue-500",
    },
    {
      label: "Initiatives",
      value: initiatives.length,
      icon: Target,
      color: "text-green-500",
    },
    {
      label: "Sections Production",
      value: production.length,
      icon: Video,
      color: "text-purple-500",
    },
    { label: "Langues", value: 2, icon: Globe, color: "text-orange-500" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold uppercase tracking-tighter">
          Tableau de bord
        </h1>
        <p className="text-muted-foreground font-medium">
          Bienvenue dans votre espace d'administration.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card
            key={stat.label}
            className="border-border/40 shadow-sm rounded-3xl overflow-hidden"
          >
            <CardHeader className="pb-2">
              <stat.icon className={`h-8 w-8 ${stat.color} mb-2`} />
              <CardTitle className="text-sm font-bold uppercase tracking-widest opacity-60">
                {stat.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold tracking-tighter">
                {stat.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-border/40 shadow-sm rounded-3xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold uppercase tracking-tighter">
            Actions Rapides
          </CardTitle>
          <CardDescription>
            Accédez directement aux sections les plus courantes.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          {/* Quick links could go here */}
        </CardContent>
      </Card>
    </div>
  );
}
