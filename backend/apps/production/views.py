from rest_framework import viewsets
from .models import ProductionCategory, ProductionItem
from .serializers import ProductionCategorySerializer, ProductionItemSerializer

class ProductionCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ProductionCategory.objects.prefetch_related('items').order_by('order')
    serializer_class = ProductionCategorySerializer
    lookup_field = 'slug'

class ProductionItemViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ProductionItem.objects.all().order_by('-published_at')
    serializer_class = ProductionItemSerializer
    lookup_field = 'slug'
