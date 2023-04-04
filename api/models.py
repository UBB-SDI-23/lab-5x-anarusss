from django.db import models
import uuid
from django.core.validators import MinValueValidator
from django.core.validators import MaxValueValidator
from django.forms import ValidationError
from django.test import TestCase

#Waiter
class Waiter(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    firstName = models.CharField(max_length=50)
    lastName = models.CharField(max_length=50)
    phoneNumber = models.CharField(max_length=20)
    email = models.CharField(max_length=30)
    wage = models.IntegerField(validators=[MinValueValidator(0)])

    def __str__(self):
        return self.firstName

    class Meta:
        ordering = ['created']

class Drink(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    name = models.CharField(max_length=200)
    description = models.CharField(max_length=500)
    ingredients = models.CharField(max_length=500, blank=True)
    price = models.IntegerField(null=True, validators=[MinValueValidator(0)])
    calories = models.IntegerField(null=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['created']


class Table(models.Model):     
    created = models.DateTimeField(auto_now_add=True)
    name = models.IntegerField()
    nopeople = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(20)])
    status =models.CharField(max_length=50)
    waiter_id = models.ForeignKey(Waiter, on_delete=models.CASCADE, related_name="waiterTable") # 1 to many; a waiter can have more tables.

    def __str__(self):
        return str(self.name)
    class Meta:
        ordering = ['created']


class Order(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    waiter = models.ForeignKey(Waiter, on_delete=models.CASCADE, related_name="assignedWaiter") # many to many
    table = models.ForeignKey(Table, on_delete=models.CASCADE, related_name="orderedDrink") # many to many
    drinks=models.ManyToManyField(Drink)

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

    def waiter_wage(self,waiter_id):
        return Waiter.objects.get(id=waiter_id).wage

    def __str__(self):
        return self.table

    class Meta:
        ordering = ['created']


    def clean(self):
        super().clean()

        if self.table.status != 'available':
            raise ValidationError('This table is not available.')



class OrderModelTest(TestCase):
    def test_table_availability(self):
        waiter = Waiter.objects.create(firstName='John', lastName='Doe', phoneNumber='1234567890', email='johndoe@example.com', wage=10)
        table = Table.objects.create(name=1, nopeople=4, status='occupied', waiter_id=waiter)

        drink = Drink.objects.create(name='Coffee', description='A hot cup of coffee', price=2, calories=100)

        order1 = Order.objects.create(waiter=waiter, table=table)
        order1.drinks.add(drink)

        # Attempt to create a new order with the same table
        with self.assertRaises(ValueError):
            order2 = Order.objects.create(waiter=waiter, table=table)
            order2.drinks.add(drink)
        

