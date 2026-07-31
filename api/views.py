from rest_framework.decorators import api_view
from item.models import Item, Category
from item.serializers import ItemSerializer, CategorySerializer
from rest_framework.response import Response

from django.shortcuts import render
from django.http import HttpResponse

from django.middleware.csrf import get_token

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
    csrf_token = get_token(request)

    error_message = ""

    if request.method == "POST":
        logger.warning(
            "HONEYPOT LOGIN ATTEMPT | IP=%s | USERNAME=%s | BOT_FIELD=%s",
            request.META.get("REMOTE_ADDR"),
            request.POST.get("username"),
            request.POST.get("website"),
        )

        error_message = """
        <div class="error">
            Please enter the correct username and password.
            Note that both fields may be case-sensitive.
        </div>
        """

    return HttpResponse(f"""
    <html>
        <head>
            <title>Footer Furniture Administration</title>

            <style>
                body {{
                    font-family: Arial, sans-serif;
                    background:#f8fafc;
                    display:flex;
                    justify-content:center;
                    align-items:center;
                    min-height:100vh;
                    margin:0;
                }}

                .card {{
                    width:400px;
                    background:white;
                    padding:40px;
                    border-radius:16px;
                    box-shadow:0 10px 25px rgba(0,0,0,.08);
                }}

                h1 {{
                    color:#ea580c;
                    text-align:center;
                    margin-bottom:5px;
                }}

                p {{
                    text-align:center;
                    color:#64748b;
                    margin-bottom:25px;
                }}

                input {{
                    width:100%;
                    padding:12px;
                    margin-bottom:12px;
                    border:1px solid #d1d5db;
                    border-radius:8px;
                    box-sizing:border-box;
                }}

                button {{
                    width:100%;
                    padding:12px;
                    border:none;
                    border-radius:8px;
                    background:#ea580c;
                    color:white;
                    font-weight:bold;
                    cursor:pointer;
                }}

                button:hover {{
                    background:#c2410c;
                }}

                .error {{
                    background:#fee2e2;
                    color:#b91c1c;
                    padding:10px;
                    border-radius:8px;
                    margin-bottom:15px;
                    font-size:14px;
                }}

                .honeypot {{
                    display:none;
                }}
            </style>
        </head>

        <body>

            <div class="card">
                <h1>FOOTER FURNITURE</h1>
                <p>Administration Portal</p>

                {error_message}

                <form method="post">
                    <input
                        type="hidden"
                        name="csrfmiddlewaretoken"
                        value="{csrf_token}"
                    >

                    <div class="honeypot">
                        <input
                            type="text"
                            name="website"
                            autocomplete="off"
                            tabindex="-1"
                        >
                    </div>

                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                    >

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                    >

                    <button type="submit">
                        Log in
                    </button>
                </form>
            </div>
        </body>
    </html>
    """)