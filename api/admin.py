from django.contrib import admin

from api.models import Order, Drink, Table

# Register your models here.
admin.site.register(Order)
admin.site.register(Drink)
admin.site.register(Table)