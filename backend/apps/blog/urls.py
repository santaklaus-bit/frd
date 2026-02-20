from django.urls import path
from . import views

urlpatterns = [
    path('posts/', views.blog_post_list, name='blog_post_list'),
    path('posts/<slug:slug>/', views.blog_post_detail, name='blog_post_detail'),
]
