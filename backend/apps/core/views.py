from rest_framework import viewsets, mixins
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Page
from .serializers import PageSerializer

class PageViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Page.objects.all()
    serializer_class = PageSerializer
    lookup_field = 'slug'

    @action(detail=False, methods=['get'])
    def by_slug(self, request):
        slug = request.query_params.get('slug')
        if not slug:
            return Response({"error": "Slug parameter is required"}, status=400)
        try:
            page = self.queryset.get(slug=slug)
            serializer = self.get_serializer(page)
            return Response(serializer.data)
        except Page.DoesNotExist:
            return Response({"error": "Page not found"}, status=404)
