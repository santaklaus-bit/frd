from django.contrib import admin
from unfold.admin import ModelAdmin
from .models import Initiative

# @admin.register(Initiative)
# class InitiativeAdmin(ModelAdmin):
#     list_display = ['title', 'category', 'order']
#     list_editable = ['order']
#     prepopulated_fields = {'slug': ('title',)}
