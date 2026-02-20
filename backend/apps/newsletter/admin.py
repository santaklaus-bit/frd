from django.contrib import admin
from .models import NewsletterSubscriber


@admin.register(NewsletterSubscriber)
class NewsletterSubscriberAdmin(admin.ModelAdmin):
    """Admin interface for newsletter subscribers"""
    
    list_display = ['email', 'subscribed_at', 'is_active']
    list_filter = ['is_active', 'subscribed_at']
    search_fields = ['email']
    readonly_fields = ['subscribed_at']
    date_hierarchy = 'subscribed_at'
    
    def activate_subscribers(self, request, queryset):
        """Action to activate subscribers"""
        queryset.update(is_active=True)
    activate_subscribers.short_description = "Activer les abonnés"
    
    def deactivate_subscribers(self, request, queryset):
        """Action to deactivate subscribers"""
        queryset.update(is_active=False)
    deactivate_subscribers.short_description = "Désactiver les abonnés"
    
    actions = [activate_subscribers, deactivate_subscribers]
