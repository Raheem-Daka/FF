from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .models import Subscriber
from newsletter.models import Subscriber

@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def newsletter(request):

    if request.method == "GET":
        count = Subscriber.objects.filter(active=True).count()

        return Response({
            "subscribers": count
        })

    if request.method == "POST":
        email = request.data.get("email")

        if not email:
            return Response(
                {"error": "Email is required"},
                status=400
            )

        subscriber, created = Subscriber.objects.get_or_create(
            email=email
        )

        if not created:
            return Response({
                "message": "You are already subscribed."
            })


    for subscriber in Subscriber.objects.filter(active=True):
        send_newsletter(subscriber, recommendations=[])

        return Response({
            "success": "Subscription successful."
        }, status=201)