from django.contrib import admin
from .models import UserSession, User2FA


@admin.register(UserSession)
class UserSessionAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "device",
        "ip_address",
        "last_active",
        "created_at",
    )

    list_filter = (
        "created_at",
        "last_active",
    )

    search_fields = (
        "user__username",
        "user__email",
        "device",
        "ip_address",
    )

    readonly_fields = (
        "user",
        "session_key",
        "device",
        "ip_address",
        "user_agent",
        "last_active",
        "created_at",
    )

    ordering = ("-last_active",)

    def has_add_permission(self, request):
        return False


@admin.register(User2FA)
class User2FAAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "is_enabled",
    )

    list_filter = (
        "is_enabled",
    )

    search_fields = (
        "user__username",
        "user__email",
    )

    readonly_fields = (
        "user",
        "secret",
    )

    ordering = ("user",)
