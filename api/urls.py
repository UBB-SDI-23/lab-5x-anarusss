from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from api import views

urlpatterns = [
    path('tables/', views.TableList.as_view()),
    path('tables/<int:pk>/', views.TableDetail.as_view()),
    path('waiters/', views.WaiterList.as_view()),
    path('waiters/<int:pk>/', views.WaiterDetail.as_view()),
    path('orders/', views.OrderList.as_view()),
    path('orders/<int:pk>/', views.OrderDetail.as_view()),
    path('tablepeople/<int:nopeople>/', views.TableNoOfPeople.as_view()),
    path('drinks/', views.DrinksList.as_view()),
    path('drinks/<int:pk>',views.DrinkDetail.as_view()),
    path('drinks/<int:pk>',views.DrinkDetail.as_view()),
    path('orders/by-avg-price',views.orders_by_average_drink_price, name='orders-by-average-drink-price'),
    path('orders/by-waiter-wage/', views.order_list_by_wage, name='orders-by-waiter-wage'),
    path('waiters/<int:pk>/tables/<int:id>', views.WaiterTablesViewDetail.as_view()),
    path('waiters/<int:pk>/tables/', views.WaiterTablesView.as_view()),
]

#urlpatterns = format_suffix_patterns(urlpatterns)