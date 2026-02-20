from django.db import models

class Page(models.Model):
    title = models.CharField(max_length=200, verbose_name="Titre")
    slug = models.SlugField(max_length=200, unique=True, verbose_name="Slug")
    content = models.TextField(verbose_name="Contenu principal", blank=True, help_text="Contenu au format MDX ou HTML")
    featured_image = models.ImageField(upload_to="pages/", blank=True, null=True, verbose_name="Image à la une")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Page"
        verbose_name_plural = "Pages"

    def __str__(self):
        return self.title

class ContentBlock(models.Model):
    page = models.ForeignKey(Page, on_delete=models.CASCADE, related_name="blocks", verbose_name="Page parente")
    title = models.CharField(max_length=200, verbose_name="Titre du bloc")
    content = models.TextField(verbose_name="Contenu du bloc", help_text="Contenu au format texte ou MDX")
    icon = models.CharField(max_length=100, blank=True, verbose_name="Icône (Lucide)", help_text="Nom de l'icône Lucide (ex: briefcase, graduation-cap)")
    order = models.PositiveIntegerField(default=0, verbose_name="Ordre d'affichage")

    class Meta:
        verbose_name = "Bloc de contenu"
        verbose_name_plural = "Blocs de contenu"
        ordering = ['order']

    def __str__(self):
        return f"{self.title} ({self.page.title})"
