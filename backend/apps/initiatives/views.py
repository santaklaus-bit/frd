from rest_framework import viewsets
from .models import Initiative
from .serializers import InitiativeSerializer

class InitiativeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Initiative.objects.all().order_by('order')
    serializer_class = InitiativeSerializer
    lookup_field = 'slug'
