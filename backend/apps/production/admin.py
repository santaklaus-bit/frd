from django.contrib import admin
from unfold.admin import ModelAdmin
from .models import ProductionCategory, ProductionItem

# @admin.register(ProductionCategory)
# class ProductionCategoryAdmin(ModelAdmin):
#     list_display = ['name', 'slug', 'order']
#     prepopulated_fields = {'slug': ('name',)}
#     list_editable = ['order']

# @admin.register(ProductionItem)
# class ProductionItemAdmin(ModelAdmin):
#     list_display = ['title', 'category', 'published_at']
#     search_fields = ['title', 'description']
#     list_filter = ['category', 'published_at']
#     prepopulated_fields = {'slug': ('title',)}
