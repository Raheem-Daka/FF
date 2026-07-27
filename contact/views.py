from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny

from django.utils import timezone

from .models import ContactMessage
from django.conf import settings

from django.template.loader import render_to_string
from django.core.mail import EmailMultiAlternatives

import logging
logger = logging.getLogger(__name__)

@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def contact(request):

    if request.method == 'GET':
        return Response({'email': 'footerfurniture@gmail.com'})

    if request.method == 'POST':
        name = request.data.get("name")
        email = request.data.get("email")
        message = request.data.get("message")

        # Validate Inputs
        if not name or not email or not message:
            return Response(
                {"error": "Name, email and message are required"},
                status=400
            )

        # ✅ Save to DB
        ContactMessage.objects.create(
            name=name,
            email=email,
            message=message
        )

        # ✅ Send emails (admin + user)
        try:
            # 📧 Email to admin

            admin_html = render_to_string(
                "emails/contact_admin.html",
                {
                    "name": name,
                    "email": email,
                    "message": message,
                    "date": timezone.now().strftime("%d %B %Y %H:%M"),
                }
            )

            admin_email = EmailMultiAlternatives(
                subject=f"New Contact Message from {name}",
                body=(
                    f"Name: {name}\n"
                    f"Email: {email}\n\n"
                    f"{message}"
                ),
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=[settings.ADMIN_EMAIL],
            )

            admin_email.attach_alternative(admin_html, "text/html")
            admin_email.send()

            # ✅ Auto-reply to user
            html_content = render_to_string(
                "emails/contact_reply.html",
                {
                    "name": name,
                    "message": message,
                }
            )

            email_message = EmailMultiAlternatives(
                subject="Thank You for Contacting Footer Furniture.",
                body=f"Hi {name}, Thank you for contacting us.",
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=[email],
            )

            email_message.attach_alternative(html_content, "text/html")
            email_message.send()


        except Exception as e:
            logger.exception("Contact email failed")

        return Response({"success": "Message sent and saved"}, status=201)
