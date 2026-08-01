from django.contrib import admin
from .models import (
    Subscriber,
    UserInterest,
    NewsletterCampaign,
    ProductInteraction,
)


@admin.register(Subscriber)
class SubscriberAdmin(admin.ModelAdmin):
    list_display = (
        "email",
        "user",
        "verified",
        "active",
        "subscribed_at",
    )

    list_filter = (
        "verified",
        "active",
        "subscribed_at",
    )

    search_fields = (
        "email",
        "user__username",
    )

    readonly_fields = (
        "token",
        "token_created_at",
        "subscribed_at",
    )

    ordering = ("-subscribed_at",)


@admin.register(UserInterest)
class UserInterestAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "item",
        "views",
        "clicks",
        "updated_at",
    )

    list_filter = (
        "updated_at",
    )

    search_fields = (
        "user__username",
        "item__name",
    )

    readonly_fields = (
        "updated_at",
    )

    ordering = ("-updated_at",)


@admin.register(NewsletterCampaign)
class NewsletterCampaignAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "subject",
        "created_at",
    )

    search_fields = (
        "title",
        "subject",
    )

    readonly_fields = (
        "created_at",
    )

    ordering = ("-created_at",)


@admin.register(ProductInteraction)
class ProductInteractionAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "item",
        "views",
        "clicks",
        "updated_at",
    )

    list_filter = (
        "updated_at",
    )

    search_fields = (
        "user__username",
        "item__name",
    )

    readonly_fields = (
        "updated_at",
    )

    ordering = ("-updated_at",)