from rest_framework import serializers
from .models import NewsletterSubscriber


class NewsletterSubscriberSerializer(serializers.ModelSerializer):
    """Serializer for newsletter subscriptions"""
    
    class Meta:
        model = NewsletterSubscriber
        fields = ['id', 'email', 'subscribed_at', 'is_active']
        read_only_fields = ['id', 'subscribed_at', 'is_active']
    
    def validate_email(self, value):
        """Validate email format and check for duplicates"""
        if not value:
            raise serializers.ValidationError("L'adresse e-mail est obligatoire.")
        
        email = value.lower()
        
        # Check if email already exists
        if NewsletterSubscriber.objects.filter(email=email).exists():
            raise serializers.ValidationError("Cette adresse e-mail est déjà inscrite à la newsletter.")
        
        return email
