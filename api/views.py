from rest_framework.decorators import api_view
from item.models import Item, Category
from item.serializers import ItemSerializer, CategorySerializer
from rest_framework.response import Response

from django.shortcuts import render
from django.http import HttpResponse

import logging

def frontend(request):
    return render(request, "index.html")

@api_view(['GET'])
def home(request):
    items = Item.objects.all()[:8]
    categories = Category.objects.all()

    if not items.exists():
        return Response ({"message": "no items available"}, status=404)

    item_serializer = ItemSerializer(items, many=True)
    category_serializer = CategorySerializer(categories, many=True)

    data = {
        'message': 'welcome to the API',
        'items': item_serializer.data,
        'categories':category_serializer.data
        }
    return Response(data)


logger = logging.getLogger(__name__)

def honeypot_admin_login(request):
    if request.method == "POST":
        logger.warning(
            "HONEYPOT LOGIN ATTEMPT | IP=%s | USERNAME=%s",
            request.META.get("REMOTE_ADDR"),
            request.POST.get("username"),
        )

    return HttpResponse("""
    <html>
        <head>
            <title>Django Administration</title>
            <style>
                body{
                    font-family: Arial, sans-serif;
                    margin:50px;
                }
                input{
                    display:block;
                    margin:10px 0;
                    padding:8px;
                    width:250px;
                }
                button{
                    padding:8px 16px;
                }
            </style>
        </head>
        <body>
            <h1>Django Administration</h1>

            <form method="post">
                <input type="text" placeholder="Username">
                <input type="password" placeholder="Password">
                <button type="submit">Log in</button>
            </form>
        </body>
    </html>
    """)