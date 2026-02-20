from rest_framework import serializers
from .models import Page, ContentBlock

class ContentBlockSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContentBlock
        fields = ['id', 'title', 'content', 'icon', 'order']

class PageSerializer(serializers.ModelSerializer):
    blocks = ContentBlockSerializer(many=True, read_only=True)

    class Meta:
        model = Page
        fields = ['id', 'title', 'slug', 'content', 'featured_image', 'blocks', 'updated_at']
