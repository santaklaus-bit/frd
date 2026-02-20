from django.contrib import admin
from unfold.admin import ModelAdmin
from .models import ContactMessage, ContactSubject

# @admin.register(ContactSubject)
# class ContactSubjectAdmin(ModelAdmin):
#     list_display = ['label', 'value', 'order', 'is_active']
#     list_editable = ['order', 'is_active']
#     prepopulated_fields = {'value': ('label',)}
#     search_fields = ['label', 'value']


# @admin.register(ContactMessage)
# class ContactMessageAdmin(ModelAdmin):
#     """Admin interface for contact messages"""
#     
#     list_display = ['full_name', 'email', 'request_type', 'created_at', 'is_read']
#     list_filter = ['request_type', 'is_read', 'created_at']
#     search_fields = ['full_name', 'email', 'message']
#     readonly_fields = ['created_at']
#     date_hierarchy = 'created_at'
#     
#     fieldsets = (
#         ('Informations de contact', {
#             'fields': ('full_name', 'email', 'request_type')
#         }),
#         ('Message', {
#             'fields': ('message',)
#         }),
#         ('Statut', {
#             'fields': ('is_read', 'created_at')
#         }),
#     )
#     
#     def mark_as_read(self, request, queryset):
#         """Action to mark messages as read"""
#         queryset.update(is_read=True)
#     mark_as_read.short_description = "Marquer comme lu"
#     
#     def mark_as_unread(self, request, queryset):
#         """Action to mark messages as unread"""
#         queryset.update(is_read=False)
#     mark_as_unread.short_description = "Marquer comme non lu"
#     
#     actions = [mark_as_read, mark_as_unread]
