from django.http import Http404, HttpResponseBadRequest
from urllib import request
from django.shortcuts import get_object_or_404, render
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Avg, F, Sum
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.pagination import PageNumberPagination
from rest_framework.pagination import LimitOffsetPagination


from api.models import Waiter, Order, Drink, Table
from api.serializers import TableSerializer, WaiterSerializer, OrderSerializer, DynamicTableSerializer, \
    DynamicWaiterSerializer, DrinkSerializer, OrdersByAvfPriceSerializer


class Pagination(PageNumberPagination):
    page_size = 6  # Number of items to display per page
    page_size_query_param = 'items_per_page'  # Query parameter to customize page size
    max_page_size = 100  # Maximum page size allowed

class WaiterList(generics.ListCreateAPIView):
    queryset = Waiter.objects.all()
    serializer_class = WaiterSerializer

    pagination_class = Pagination


class WaiterDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Waiter.objects.all()
    serializer_class = DynamicWaiterSerializer


class OrderList(generics.ListCreateAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    pagination_class = Pagination


class OrderDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer


class TableList(generics.ListCreateAPIView):
    queryset = Table.objects.all()
    serializer_class = DynamicTableSerializer

    pagination_class = Pagination


class TableDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Table.objects.all()
    serializer_class = TableSerializer


class TableNoOfPeople(generics.ListAPIView):
    serializer_class = TableSerializer
    lookup_url_kwarg = "nopeople"

    def get_queryset(self):
        queryset = Table.objects.all()
        nopeople = self.kwargs.get(self.lookup_url_kwarg)
        if nopeople is not None:
            queryset = queryset.filter(nopeople__gt=nopeople)
        return queryset
    
    
def order_list(request):
    orders=Order.objects.annotate(avg_drinks_price=Avg('drinks__price')).order_by('-avg_drinks_price')
    return render(request, 'order_list.html', {'orders': orders})




class DrinksList(generics.ListCreateAPIView):
    queryset = Drink.objects.all()
    serializer_class = DrinkSerializer
    
    pagination_class = Pagination 


class DrinkDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Drink.objects.all()
    serializer_class = DrinkSerializer

# class OrdersByAvfPrice(APIView):
#     def get(self,request):
#         orders=Order.objects.annotate(avg_drinks_price=Avg('drinks__price')).order_by('-avg_drinks_price')
#         serializer=OrderSerializer(orders,many=True)
#         #return JsonResponse(serializer.data, safe=False)
#         return Response(serializer.data)


@api_view(['GET'])
def orders_by_average_drink_price(request):
    waiter_id = request.GET.get('waiter_id')
    orders = Order.objects.all()

    if waiter_id:
         orders = orders.filter(waiter_id=waiter_id)

    orders = orders.annotate(average_price=Avg('drinks__price')).order_by('-average_price')


    # Manual Pagination
    offset = int(request.GET.get('offset', 0))
    limit = int(request.GET.get('limit', 10))

    # Perform pagination
    total_count = orders.count()
    paginated_orders = orders[offset:offset + limit]

    # Serialize the paginated queryset
    res = []
    for order in paginated_orders:
        # Check if average_price is None, if so, set it to 0
        average_price = order.average_price or 0
        print(average_price)
        res.append({
            'id': order.id,
            'waiter': order.waiter.firstName,
            'table': order.table.name,
            'average_price': round(average_price, 2)
        })

    # Create response data
    data = {
        'total_count': total_count,
        'offset': offset,
        'limit': limit,
        'results': res
    }

    # Add links for next and previous pages
    if offset + limit < total_count:
        next_offset = offset + limit
        data['next'] = request.build_absolute_uri(f'?offset={next_offset}&limit={limit}')
    if offset > 0:
        prev_offset = max(offset - limit, 0)
        data['previous'] = request.build_absolute_uri(f'?offset={prev_offset}&limit={limit}')

    return Response(data)

# @api_view(['GET'])
# def orders_by_average_drink_price(request):
#     waiter_id = request.GET.get('waiter_id')
#     orders = Order.objects.all()

#     if waiter_id:
#         orders = orders.filter(waiter_id=waiter_id)

#     orders = Order.objects.annotate(total_price=Sum('drinks__price'))

#     data = []
#     p=20
#     if (p<=200):
#      for order in orders:
#          p=p+1
#         #if(order.average_price):
#          data.append({
#             'id': order.id,
#             'waiter': order.waiter.firstName,
#             'table': order.table.name,
#             'average_price': order.total_price
#         })

#     return Response(data)

# def orders_by_average_drink_price(request):
#     # Query all orders with their total drink price
#     orders = Order.objects.annotate(total_price=Sum('drinks__price'))

#     # Serialize the orders queryset to JSON
#     data = []
#     for order in orders:
#         data.append({
#             'id': order.id,
#             'waiter': str(order.waiter),
#             'table': str(order.table),
#             'total_price': order.total_price
#         })

#     # Create response data
#     response_data = {
#         'orders': data
#     }

#     # Return JSON response
#     return JsonResponse(response_data)




@api_view(['GET'])
def order_list_by_wage(request):
    orders = Order.objects.annotate(waiter_wage=F('waiter__wage')).order_by('-waiter_wage')

    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)


# class WaitersTable(generics.ListCreateAPIView):
#     def get_object(self, pk):
#         try:
#             return Table.objects.get(pk=pk)
#         except Table.DoesNotExist:
#             raise Http404
        
#     def get_object(self, pk):
#         try:
#             return Task.objects.get(project_id=pk)
#         except Project.DoesNotExist:
#             raise Http404

#     def get(self, request, pk, format=None):
#         tasks = Table.objects.all()
#         tables = tasks.filter(project_id=pk)

#         serializer = ProjectTeamSerializer(tasks,many=True)
#         #serializer = TaskSerializer2(tasks, many=True)
#         return Response(serializer.data)

#     def post(self, request, format=None):
#         serializer = TaskSerializer2(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#class WaitersTable(generics.ListCreateAPIView):



class WaiterTablesView(generics.ListCreateAPIView):
    serializer_class = TableSerializer

    def get_queryset(self):
        waiter = Waiter.objects.get(pk=self.kwargs['pk'])
        return waiter.waiterTable.all()

    def create(self, request, *args, **kwargs):
        waiter = Waiter.objects.get(pk=self.kwargs['pk'])
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            table = serializer.save(waiter_id=waiter)
            return Response(TableSerializer(table).data)
        

class WaiterTablesViewDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TableSerializer

    def get_queryset(self):
        waiter = Waiter.objects.get(pk=self.kwargs['pk'])
        return waiter.waiterTable.all()

    def create(self, request, *args, **kwargs):
        waiter = Waiter.objects.get(pk=self.kwargs['pk'])
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            table = serializer.save(waiter_id=waiter)
            return Response(TableSerializer(table).data)
    
