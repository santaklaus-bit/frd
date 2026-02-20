from django.db import models



class ContactSubject(models.Model):
    """Model for configurable contact form subjects"""
    label = models.CharField(max_length=200, verbose_name="Libellé")
    value = models.SlugField(max_length=200, unique=True, verbose_name="Valeur (identifiant)")
    order = models.PositiveIntegerField(default=0, verbose_name="Ordre d'affichage")
    is_active = models.BooleanField(default=True, verbose_name="Actif")

    class Meta:
        verbose_name = "Sujet de contact"
        verbose_name_plural = "Sujets de contact"
        ordering = ['order', 'label']

    def __str__(self):
        return self.label


class ContactMessage(models.Model):
    """Model for storing contact form submissions"""
    
    full_name = models.CharField(max_length=200, verbose_name="Nom complet")
    email = models.EmailField(verbose_name="Adresse e-mail")
    request_type = models.CharField(
        max_length=200,
        verbose_name="Type de demande"
    )
    message = models.TextField(verbose_name="Message")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Date de création")
    is_read = models.BooleanField(default=False, verbose_name="Lu")
    
    class Meta:
        verbose_name = "Message de contact"
        verbose_name_plural = "Messages de contact"
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.full_name} - {self.request_type} ({self.created_at.strftime('%Y-%m-%d')})"
