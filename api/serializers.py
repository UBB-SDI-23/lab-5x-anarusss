from rest_framework import serializers
from django.db.models import Avg

from api.models import Table, Waiter, Order, Drink



class DrinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = Drink
        fields = ['id', 'name', 'description','ingredients','price','calories']

class WaiterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Waiter
        fields = ('__all__')


class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ('__all__')


class TableSerializer(serializers.ModelSerializer):
    #waiter_id = serializers.IntegerField(write_only=True)
    waiter = WaiterSerializer(read_only=True)
    nopeople = serializers.IntegerField()
    name = serializers.IntegerField()
    status = serializers.CharField(max_length=20)

    def validate_waiter_id(self, value):
        filter = Waiter.objects.filter(id=value)
        if not filter.exists():
            raise serializers.ValidationError("Waiter doesn't exist!")
        return value


    class Meta:
        model = Table
        #fields = ('__all__')
        fields = ('id', 'name', 'waiter', 'nopeople', 'status')

class DynamicFieldsModelSerializer(serializers.ModelSerializer):
    """
    A ModelSerializer that takes an additional `fields` argument that
    controls which fields should be displayed.
    """

    def __init__(self, *args, **kwargs):
        # Don't pass the 'fields' arg up to the superclass
        fields = kwargs.pop('fields', None)

        # Instantiate the superclass normally
        super().__init__(*args, **kwargs)

        if fields is not None:
            # Drop any fields that are not specified in the `fields` argument.
            allowed = set(fields)
            existing = set(self.fields)
            for field_name in existing - allowed:
                self.fields.pop(field_name)
class DynamicTableSerializer(DynamicFieldsModelSerializer):
    class Meta:
        model = Table
        fields = ['id', 'name', 'nopeople', 'status']

class TableSerializerWithoutWaiter(serializers.ModelSerializer):
    class Meta:
        model = Table
        fields = ('id', 'name','nopeople', 'status', 'waiter_id')

class DynamicWaiterSerializer(DynamicFieldsModelSerializer):
    firstName = serializers.CharField(max_length=50)
    lastName = serializers.CharField(max_length=50)
    phoneNumber = serializers.IntegerField()
    email = serializers.CharField(max_length=50)
    wage = serializers.CharField(max_length=50)
    waiterTable = TableSerializerWithoutWaiter(many=True, read_only=True)

    class Meta:
        model = Waiter
        fields = [ 'firstName', 'lastName', 'phoneNumber', 'email', 'wage', 'waiterTable']

class OrdersByAvfPriceSerializer (serializers.ModelSerializer):
    avg_drinks_price = serializers.SerializerMethodField()


    class Meta:
        model = Order
        fields = ('id', 'created', 'waiter', 'table', 'drinks', 'avg_drinks_price')

    def get_avg_drinks_price(self, obj):
        avg_diff = obj.o.aggregate(Avg('drinks_price'))['avg_drinks_price']
        return avg_diff if avg_diff else 0