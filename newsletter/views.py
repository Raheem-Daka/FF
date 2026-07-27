from django.contrib.auth.models import User

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .models import Subscriber
from .services import send_verification_email


@api_view(["GET", "POST"])
@permission_classes([AllowAny])
def newsletter(request):

    if request.method == "GET":

        count = Subscriber.objects.filter(
            active=True,
            verified=True,
        ).count()

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

            if not subscriber.verified:
                send_verification_email(subscriber)

                return Response({
                    "message": "Verification email resent."
                })

            return Response({
                "message": "You are already subscribed."
            })

        user = User.objects.filter(
            email=email
        ).first()

        if user:
            subscriber.user = user
            subscriber.save()

        return Response(
            {
                "success": "Subscription successful. Please check your email to verify your subscription."
            },
            status=201
        )