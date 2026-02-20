from django.db import models

class Initiative(models.Model):
    title = models.CharField(max_length=200, verbose_name="Titre")
    slug = models.SlugField(max_length=200, unique=True, verbose_name="Slug")
    category = models.CharField(max_length=100, verbose_name="Catégorie", help_text="ex: Employabilité, Développement social")
    description = models.TextField(verbose_name="Description")
    icon = models.CharField(max_length=100, blank=True, verbose_name="Icône (Lucide)", help_text="Nom de l'icône Lucide (ex: target, users)")
    order = models.PositiveIntegerField(default=0, verbose_name="Ordre d'affichage")
    link = models.URLField(verbose_name="Lien externe", blank=True, null=True)

    class Meta:
        verbose_name = "Initiative"
        verbose_name_plural = "Initiatives"
        ordering = ['order']

    def __str__(self):
        return self.title
