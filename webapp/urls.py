from django.contrib import admin
from django.urls import path, include, re_path
from django.conf.urls.static import static
from django.conf import settings
from api.views import frontend, honeypot_admin_login
from django.views.generic import RedirectView

urlpatterns = [
    path('', frontend, name='frontend'),

    path("admin/", honeypot_admin_login),
    path("control-center-8x7k2q/", admin.site.urls),

    path(
        "robots.txt",
        RedirectView.as_view(url="/static/robots.txt", permanent=True),
    ),
    path(
        "sitemap.xml",
        RedirectView.as_view(url="/static/sitemap.xml", permanent=True),
    ),

    path('api/', include('api.urls')),
    path('api/', include('item.urls')),
    path('api/', include('contact.urls')),
    path('api/', include('authentication.urls')),
    path('api/', include('cart.urls')),
    path('api/', include('orders.urls')),
    path('api/', include('account.urls')),
    path('api/', include('tracking.urls')),
    path('api/', include('settings.urls')),
    path('api/', include('newsletter.urls')),

    re_path(r'^.*$', frontend, name='frontend'),
]

if settings.DEBUG:
    urlpatterns += static(
        settings.STATIC_URL,
        document_root=settings.STATIC_ROOT
    )
    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT
    )