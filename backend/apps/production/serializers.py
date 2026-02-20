from rest_framework import serializers
from .models import ProductionCategory, ProductionItem

class ProductionItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductionItem
        fields = ['id', 'title', 'slug', 'description', 'video_url', 'image', 'published_at', 'created_at']

class ProductionCategorySerializer(serializers.ModelSerializer):
    items = ProductionItemSerializer(many=True, read_only=True)

    class Meta:
        model = ProductionCategory
        fields = ['id', 'name', 'slug', 'description', 'icon', 'order', 'items']
