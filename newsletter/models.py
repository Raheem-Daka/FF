import uuid
from django.db import models
from django.contrib.auth.models import User
from item.models import Item
from django.utils import timezone

class Subscriber(models.Model):
    email = models.EmailField(unique=True)

    user = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )

    token = models.UUIDField(
        default=uuid.uuid4,
        unique=True,
        editable=False,
    )

    verified = models.BooleanField(default=False)

    token_created_at = models.DateTimeField(
        default=timezone.now
    )

    active = models.BooleanField(default=True)

    subscribed_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return self.email

class UserInterest(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    views = models.PositiveIntegerField(default=0)
    clicks = models.PositiveIntegerField(default=0)

    updated_at = models.DateTimeField(auto_now=True)


class NewsletterCampaign(models.Model):
    title = models.CharField(max_length=255)
    subject = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

class ProductInteraction(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    item = models.ForeignKey(Item, on_delete=models.CASCADE)

    views = models.PositiveIntegerField(default=0)
    clicks = models.PositiveIntegerField(default=0)

    updated_at = models.DateTimeField(auto_now=True)