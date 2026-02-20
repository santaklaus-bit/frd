from rest_framework import serializers
from .models import ContactSubject, ContactMessage

class ContactSubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactSubject
        fields = ['label', 'value', 'order']

class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ['full_name', 'email', 'request_type', 'message']
