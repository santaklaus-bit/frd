from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import NewsletterSubscriber
from .serializers import NewsletterSubscriberSerializer


@api_view(['POST'])
def newsletter_subscribe(request):
    """
    API endpoint for newsletter subscription
    POST /api/newsletter/subscribe/
    """
    serializer = NewsletterSubscriberSerializer(data=request.data)
    
    if serializer.is_valid():
        serializer.save()
        return Response(
            {
                'success': True,
                'message': 'Merci pour votre inscription à la newsletter !'
            },
            status=status.HTTP_201_CREATED
        )
    
    return Response(
        {
            'success': False,
            'errors': serializer.errors
        },
        status=status.HTTP_400_BAD_REQUEST
    )
