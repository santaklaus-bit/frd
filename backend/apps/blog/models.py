from django.db import models
from django.utils.text import slugify


class BlogPost(models.Model):
    """Model for blog posts with bilingual support"""
    
    # Content
    title = models.CharField(max_length=200, verbose_name="Titre")
    content = models.TextField(verbose_name="Contenu", help_text="Contenu en format MDX")
    excerpt = models.TextField(verbose_name="Extrait", blank=True)
    
    # Common fields
    slug = models.SlugField(unique=True, max_length=200, verbose_name="Slug")
    featured_image = models.ImageField(
        upload_to='blog/',
        blank=True,
        null=True,
        verbose_name="Image à la une"
    )
    
    # Publishing
    is_published = models.BooleanField(default=False, verbose_name="Publié")
    published_at = models.DateTimeField(blank=True, null=True, verbose_name="Date de publication")
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Date de création")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Date de modification")
    
    class Meta:
        verbose_name = "Article de blog"
        verbose_name_plural = "Articles de blog"
        ordering = ['-published_at', '-created_at']
    
    def __str__(self):
        return self.title
    
    def save(self, *args, **kwargs):
        # Auto-generate slug from title if not provided
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)


class BlogMedia(models.Model):
    """Model for blog post media (images/videos)"""
    
    MEDIA_TYPES = (
        ('image', 'Image'),
        ('video', 'Vidéo'),
    )
    
    blog_post = models.ForeignKey(
        BlogPost, 
        on_delete=models.CASCADE, 
        related_name='media',
        verbose_name="Article"
    )
    file = models.FileField(upload_to='blog/media/', verbose_name="Fichier")
    media_type = models.CharField(
        max_length=10, 
        choices=MEDIA_TYPES, 
        default='image',
        verbose_name="Type de média"
    )
    description = models.CharField(
        max_length=255, 
        blank=True, 
        verbose_name="Description (Alt text)"
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Date de création")
    
    class Meta:
        verbose_name = "Média de blog"
        verbose_name_plural = "Médias de blog"
        
    def __str__(self):
        return f"{self.media_type} for {self.blog_post.title}"
