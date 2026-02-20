from django.contrib import admin
from django.utils.safestring import mark_safe
from .models import BlogPost, BlogMedia


class BlogMediaInline(admin.TabularInline):
    model = BlogMedia
    extra = 1
    fields = ['file', 'media_type', 'description', 'get_markdown_snippet']
    readonly_fields = ['get_markdown_snippet']

    def get_markdown_snippet(self, obj):
        if not obj.file:
            return "-"
        
        file_url = obj.file.url
        description = obj.description or "Image"
        
        if obj.media_type == 'image':
            code = f"![{description}]({file_url})"
        else:
            code = f'<video controls width="100%"><source src="{file_url}" type="video/mp4"></video>'
            
        return mark_safe(f'''
            <div style="display: flex; gap: 10px; align-items: center;">
                <input type="text" value='{code}' id="media_code_{obj.id}" style="width: 300px;">
                <button type="button" onclick="
                    var copyText = document.getElementById('media_code_{obj.id}');
                    copyText.select();
                    document.execCommand('copy');
                " style="cursor: pointer; padding: 2px 8px;">Copier</button>
            </div>
        ''')
    get_markdown_snippet.short_description = "Snippet Markdown"


@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    """Admin interface for blog posts"""
    
    list_display = ['title', 'slug', 'is_published', 'published_at', 'created_at']
    list_filter = ['is_published', 'published_at', 'created_at']
    search_fields = ['title', 'content']
    prepopulated_fields = {'slug': ('title',)}
    readonly_fields = ['created_at', 'updated_at']
    date_hierarchy = 'published_at'
    inlines = [BlogMediaInline]
    
    fieldsets = (
        ('Contenu', {
            'fields': ('title', 'excerpt', 'content')
        }),
        ('Métadonnées', {
            'fields': ('slug', 'featured_image')
        }),
        ('Publication', {
            'fields': ('is_published', 'published_at')
        }),
        ('Dates', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def publish_posts(self, request, queryset):
        """Action to publish posts"""
        from django.utils import timezone
        queryset.update(is_published=True, published_at=timezone.now())
    publish_posts.short_description = "Publier les articles"
    
    def unpublish_posts(self, request, queryset):
        """Action to unpublish posts"""
        queryset.update(is_published=False)
    unpublish_posts.short_description = "Dépublier les articles"
    
    actions = [publish_posts, unpublish_posts]
