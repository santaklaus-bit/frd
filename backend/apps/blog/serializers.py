from rest_framework import serializers
from .models import BlogPost


class BlogPostListSerializer(serializers.ModelSerializer):
    """Serializer for blog post list view"""
    
    class Meta:
        model = BlogPost
        fields = [
            'id', 'title', 'slug', 'excerpt',
            'featured_image', 'published_at'
        ]


class BlogPostDetailSerializer(serializers.ModelSerializer):
    """Serializer for blog post detail view"""
    
    class Meta:
        model = BlogPost
        fields = [
            'id', 'title', 'slug', 'content',
            'excerpt', 'featured_image', 'published_at',
            'created_at', 'updated_at'
        ]
