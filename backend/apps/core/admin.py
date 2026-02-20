from django.contrib import admin
from unfold.admin import ModelAdmin
from .models import Page, ContentBlock

class ContentBlockInline(admin.TabularInline):
    model = ContentBlock
    extra = 1
    fields = ['title', 'icon', 'order', 'content']

# @admin.register(Page)
# class PageAdmin(ModelAdmin):
#     list_display = ['title', 'slug', 'updated_at']
#     search_fields = ['title', 'slug']
#     prepopulated_fields = {'slug': ('title',)}
#     inlines = [ContentBlockInline]
