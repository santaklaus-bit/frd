from rest_framework import serializers
from .models import Initiative

class InitiativeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Initiative
        fields = ['id', 'title', 'slug', 'category', 'description', 'icon', 'order', 'link']
