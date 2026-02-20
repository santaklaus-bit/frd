from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django.shortcuts import get_object_or_404
from .models import BlogPost
from .serializers import BlogPostListSerializer, BlogPostDetailSerializer


@api_view(['GET'])
def blog_post_list(request):
    """
    API endpoint for listing published blog posts
    GET /api/blog/posts/
    """
    # Only show published posts
    posts = BlogPost.objects.filter(is_published=True)
    
    # Pagination
    paginator = PageNumberPagination()
    paginator.page_size = 10
    result_page = paginator.paginate_queryset(posts, request)
    
    serializer = BlogPostListSerializer(result_page, many=True)
    return paginator.get_paginated_response(serializer.data)


@api_view(['GET'])
def blog_post_detail(request, slug):
    """
    API endpoint for getting a single blog post by slug
    GET /api/blog/posts/{slug}/
    """
    post = get_object_or_404(BlogPost, slug=slug, is_published=True)
    serializer = BlogPostDetailSerializer(post)
    return Response(serializer.data)
