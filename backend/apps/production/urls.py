from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductionCategoryViewSet, ProductionItemViewSet

router = DefaultRouter()
router.register(r'categories', ProductionCategoryViewSet)
router.register(r'items', ProductionItemViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
