from django.db import models


class NewsletterSubscriber(models.Model):
    """Model for storing newsletter subscribers"""
    
    email = models.EmailField(unique=True, verbose_name="Adresse e-mail")
    subscribed_at = models.DateTimeField(auto_now_add=True, verbose_name="Date d'inscription")
    is_active = models.BooleanField(default=True, verbose_name="Actif")
    
    class Meta:
        verbose_name = "Abonné newsletter"
        verbose_name_plural = "Abonnés newsletter"
        ordering = ['-subscribed_at']
    
    def __str__(self):
        status = "Actif" if self.is_active else "Inactif"
        return f"{self.email} ({status})"
