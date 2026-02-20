from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ContactMessageViewSet, ContactSubjectViewSet

router = DefaultRouter()
router.register(r'subjects', ContactSubjectViewSet, basename='subject')
router.register(r'', ContactMessageViewSet, basename='contact')

urlpatterns = [
    path('', include(router.urls)),
]
