from django.urls import path, re_path
from rest_framework.urlpatterns import format_suffix_patterns
from api import views
from rest_framework_swagger.views import get_swagger_view

from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

schema_view = get_schema_view(
    openapi.Info(
        title="Jaseci API",
        default_version='v1',
        description="Welcome to the world of Jaseci",
        terms_of_service="https://www.jaseci.org",
        contact=openapi.Contact(email="jason@jaseci.org"),
        license=openapi.License(name="Awesome IP"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path('tables/', views.TableList.as_view()),
    path('tables/<int:pk>/', views.TableDetail.as_view()),
    path('waiters/', views.WaiterList.as_view()),
    path('waiters/<int:pk>', views.WaiterDetail.as_view()),
    path('orders/', views.OrderList.as_view()),
    path('orders/<int:pk>/', views.OrderDetail.as_view()),
    path('tablepeople/<int:nopeople>/', views.TableNoOfPeople.as_view()),
    path('drinks/', views.DrinksList.as_view()),
    path('drinks/<int:pk>',views.DrinkDetail.as_view()),
    path('drinks/<int:pk>',views.DrinkDetail.as_view()),
    path('orders/by-avg-price',views.orders_by_average_drink_price),
    path('orders/by-waiter-wage/', views.order_list_by_wage, name='orders-by-waiter-wage'),
    path('waiters/<int:pk>/tables/<int:id>', views.WaiterTablesViewDetail.as_view()),
    path('waiters/<int:pk>/tables/', views.WaiterTablesView.as_view()),
    

    re_path(r'^doc(?P<format>\.json|\.yaml)$',
            schema_view.without_ui(cache_timeout=0), name='schema-json'),  #<-- Here
    path('doc/', schema_view.with_ui('swagger', cache_timeout=0),
         name='schema-swagger-ui'),  #<-- Here
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0),
         name='schema-redoc'), 
]

#urlpatterns = format_suffix_patterns(urlpatterns)