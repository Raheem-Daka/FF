from django.urls import path
from .views import newsletter, verify_newsletter

urlpatterns = [
    path("newsletter/", newsletter, name="newsletter"),
    path(
        "newsletter/verify/<uuid:token>/",
        verify_newsletter,
        name="verify_newsletter",
    ),
]
