from rest_framework import viewsets, status
from rest_framework.response import Response
from django.core.mail import send_mail
from django.conf import settings
from .models import ContactMessage, ContactSubject
from .serializers import ContactMessageSerializer, ContactSubjectSerializer

class ContactSubjectViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint that allows contact subjects to be viewed.
    """
    queryset = ContactSubject.objects.filter(is_active=True).order_by('order')
    serializer_class = ContactSubjectSerializer
    pagination_class = None

class ContactMessageViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows contact messages to be created.
    """
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer
    http_method_names = ['post']

    def perform_create(self, serializer):
        contact_message = serializer.save()
        
        # Send email notification
        try:
            subject = f"Nouveau message de contact: {contact_message.request_type}"
            message = f"""
Nouveau message de contact reçu:

Nom: {contact_message.full_name}
Email: {contact_message.email}
Type de demande: {contact_message.request_type}

Message:
{contact_message.message}

---
Reçu le: {contact_message.created_at.strftime('%Y-%m-%d %H:%M')}
            """
            
            send_mail(
                subject=subject,
                message=message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[settings.DEFAULT_FROM_EMAIL],
                fail_silently=True,
            )
        except Exception as e:
            # Log the error but don't fail the request
            print(f"Error sending email: {e}")
