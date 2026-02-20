from django.db import models

class ProductionCategory(models.Model):
    name = models.CharField(max_length=200, verbose_name="Nom de la catégorie")
    slug = models.SlugField(max_length=200, unique=True, verbose_name="Slug")
    description = models.TextField(verbose_name="Description", blank=True)
    icon = models.CharField(max_length=100, blank=True, verbose_name="Icône (Lucide)", help_text="Nom de l'icône Lucide (ex: video, mic)")
    order = models.PositiveIntegerField(default=0, verbose_name="Ordre d'affichage")

    class Meta:
        verbose_name = "Catégorie de production"
        verbose_name_plural = "Catégories de production"
        ordering = ['order']

    def __str__(self):
        return self.name

class ProductionItem(models.Model):
    category = models.ForeignKey(ProductionCategory, on_delete=models.CASCADE, related_name="items", verbose_name="Catégorie")
    title = models.CharField(max_length=200, verbose_name="Titre")
    slug = models.SlugField(max_length=200, unique=True, verbose_name="Slug")
    description = models.TextField(verbose_name="Description", blank=True)
    video_url = models.URLField(verbose_name="Lien vidéo/audio", blank=True, null=True)
    image = models.ImageField(upload_to="production/", verbose_name="Image de couverture", blank=True, null=True)
    published_at = models.DateTimeField(verbose_name="Date de publication")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Production"
        verbose_name_plural = "Productions"
        ordering = ['-published_at']

    def __str__(self):
        return self.title
