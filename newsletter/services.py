# newsletter/services.py

from django.template.loader import render_to_string
from django.core.mail import EmailMultiAlternatives
from django.conf import settings


def send_newsletter(subscriber, recommendations):
    html_content = render_to_string(
        "emails/newsletter.html",
        {
            "subscriber": subscriber,
            "recommendations": recommendations,
        }
    )

    email = EmailMultiAlternatives(
        subject="New Furniture & Deals Just For You 🛋️",
        body="Check out our latest furniture and deals.",
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[subscriber.email],
    )

    email.attach_alternative(html_content, "text/html")
    email.send()