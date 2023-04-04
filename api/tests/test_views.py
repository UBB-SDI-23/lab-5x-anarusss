from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient

from rest_framework.test import APITestCase
from api.serializers import OrderSerializer
from api.models import Waiter, Order, Drink, Table
from django.core.exceptions import ValidationError

class OrdersByAverageDrinkPriceViewTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()

        self.waiter1 = Waiter.objects.create(
            firstName='John',
            lastName='Doe',
            phoneNumber='1234567890',
            email='john@example.com',
            wage=10
        )

        self.waiter2 = Waiter.objects.create(
            firstName='Jane',
            lastName='Doe',
            phoneNumber='0987654321',
            email='jane@example.com',
            wage=15
        )

        self.table1 = Table.objects.create(
            name=1,
            nopeople=4,
            status='available',
            waiter_id=self.waiter1
        )

        self.table2 = Table.objects.create(
            name=2,
            nopeople=6,
            status='available',
            waiter_id=self.waiter2
        )

        self.drink1 = Drink.objects.create(
            name='Drink 1',
            description='A refreshing drink',
            ingredients='Water, sugar, lemon',
            price=3,
            calories=100
        )

        self.drink2 = Drink.objects.create(
            name='Drink 2',
            description='A strong drink',
            ingredients='Whiskey, soda, lemon',
            price=5,
            calories=200
        )

        self.order1 = Order.objects.create(
            waiter=self.waiter1,
            table=self.table1
        )

        self.order1.drinks.set([self.drink1, self.drink2])

        self.order2 = Order.objects.create(
            waiter=self.waiter2,
            table=self.table2
        )

        self.order2.drinks.set([self.drink1])

    def test_orders_by_average_drink_price_view(self):
        url = reverse('orders-by-average-drink-price')
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        data = response.json()
        self.assertEqual(len(data), 2)

        self.assertEqual(data[0]['id'], self.order1.id)
        self.assertEqual(data[0]['average_price'], 4.0)

        self.assertEqual(data[1]['id'], self.order2.id)
        self.assertEqual(data[1]['average_price'], 3.0)

    def test_orders_by_average_drink_price_view_with_empty_orders(self):
        # delete all orders
        Order.objects.all().delete()

        url = reverse('orders-by-average-drink-price')
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        data = response.json()
        self.assertEqual(len(data), 0)
        


class OrderByWaiterWageViewTestCase(APITestCase):
    
    def setUp(self):
        self.waiter1 = Waiter.objects.create(firstName='John', lastName='Doe', phoneNumber='1234567890', email='john@example.com', wage=10)
        self.waiter2 = Waiter.objects.create(firstName='Jane', lastName='Doe', phoneNumber='0987654321', email='jane@example.com', wage=20)
        self.table1 = Table.objects.create(name=1, nopeople=4, status='available', waiter_id=self.waiter1)
        self.table2 = Table.objects.create(name=2, nopeople=6, status='available', waiter_id=self.waiter2)
        self.drink1 = Drink.objects.create(name='Coffee', description='Black coffee', price=2, calories=0)
        self.drink2 = Drink.objects.create(name='Tea', description='Hot tea', price=3, calories=0)
        self.order1 = Order.objects.create(waiter=self.waiter1, table=self.table1)
        self.order1.drinks.add(self.drink1, self.drink2)
        self.order2 = Order.objects.create(waiter=self.waiter2, table=self.table2)
        self.order2.drinks.add(self.drink1, self.drink2)
        
    def test_orders_by_waiter_wage_view(self):
        response = self.client.get('/orders/by-waiter-wage/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response.data[0]['id'], self.order2.id)
        self.assertEqual(response.data[1]['id'], self.order1.id)
        
class WaiterModelTest(TestCase):

    def test_wage_validator(self):
        # Test valid wage value
        valid_wage = Waiter.objects.create(firstName='John', lastName='Mircea', phoneNumber='555-1234', email='john.doe@example.com', wage=1000)
        valid_wage.full_clean()  # 

        # Test invalid wage value
        invalid_wage = Waiter(firstName='Jane', lastName='Doe', phoneNumber='5678', email='jane.doe@example.com', wage=-100)
        with self.assertRaises(ValidationError):
            invalid_wage.full_clean()