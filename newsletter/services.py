from django.template.loader import render_to_string
from django.core.mail import EmailMultiAlternatives
from django.conf import settings

from .models import Subscriber
from item.models import Item

def send_newsletter(
    subscriber,
    new_products,
    discount_products,
    recommended_products,
    popular_products,
):
    html_content = render_to_string(
        "emails/newsletter.html",
        {
            "subscriber": subscriber,
            "new_products": new_products,
            "discount_products": discount_products,
            "recommended_products": recommended_products,
            "popular_products": popular_products,
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

# newsletter/services.py
def send_all_newsletters():

    new_products = Item.objects.order_by("-created_at")[:6]

    discount_products = Item.objects.filter(
        discounts__isnull=False
    ).distinct()[:6]

    popular_products = Item.objects.order_by(
        "-rating_count"
    )[:6]

    subscribers = Subscriber.objects.filter(active=True)

    for subscriber in subscribers:

        send_newsletter(
            subscriber,
            new_products,
            discount_products,
            popular_products,  # temporary
            popular_products,
        )


def send_verification_email(subscriber):

    verify_url = (
        f"https://rwdaka.pythonanywhere.com/"
        f"newsletter/verify/{subscriber.token}/"
    )

    html_content = render_to_string(
        "emails/verify_newsletter.html",
        {
            "subscriber": subscriber,
            "verify_url": verify_url,
        }
    )

    email = EmailMultiAlternatives(
        subject="Confirm Your Footer Furniture Newsletter Subscription",
        body=f"Verify your subscription: {verify_url}",
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[subscriber.email],
    )

    email.attach_alternative(html_content, "text/html")
    email.send()