from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from frontend import views
from .views import index


urlpatterns = [
    path('', views.index)
]