from faker import Faker
import random
RANGE=1000000
BATCHES=100

fake = Faker()

# Generate data for Waiter entity
waiters = []
for _ in range(RANGE):
    waiter = {
        'firstName': fake.first_name(),
        'lastName': fake.last_name(),
        'phoneNumber': fake.numerify(text='######'),
        'email': fake.email(),
        'wage': random.randint(0, 5000),
        'created': fake.date_time_this_decade()
    }
    waiters.append(waiter)

# Generate data for Drink entity
drinks = []
for _ in range(RANGE):
    drink = {
        'created': fake.date_time_this_decade(),
        'name': fake.random_element(elements=("Caspian Splash", "Caramel Macchiato", "Berry Blast", "Mango Tango", "Vanilla Latte", "Strawberry Lemonade", "Coconut Mojito", "Green Tea Smoothie", "Chocolate Martini", "Blueberry Mojito", "Pineapple Margarita", "Espresso Martini", "Raspberry Lemonade", "Mint Julep", "Orange Creamsicle", "Lemonade Spritzer", "Peach Bellini", "Watermelon Mojito", "Iced Chai Latte", "Pina Colada")),
        'description': fake.sentence(),
        'ingredients': fake.random_element(elements=("vodka, peach schnapps, cranberry juice, orange juice, lime juice, ice", "espresso, steamed milk, vanilla syrup", "strawberries, blueberries, raspberries, blackberries, ice, water", "mango, pineapple juice, orange juice, ice", "espresso, steamed milk, vanilla syrup", "strawberries, lemon juice, simple syrup, soda water, ice", "rum, mint leaves, lime juice, simple syrup, soda water", "green tea, milk, honey, ice", "vodka, coffee liqueur, chocolate liqueur, ice", "blueberries, mint leaves, lime juice, simple syrup, soda water", "pineapple juice, tequila, triple sec, lime juice, simple syrup, ice", "espresso, vodka, coffee liqueur", "raspberries, lemon juice, simple syrup, soda water, ice", "mint leaves, sugar, bourbon, crushed ice", "orange juice, vanilla ice cream, whipped cream, orange zest", "lemonade, soda water, ice", "peach puree, champagne", "watermelon, rum, mint leaves, lime juice, simple syrup, soda water, ice", "chai tea, milk, honey, ice", "rum, coconut cream, pineapple juice, ice")),
        'price': random.randint(0, 100),
        'calories': random.randint(0, 1000)
    }
    drinks.append(drink)

# Generate data for Table entity
tables = []
for i in range(RANGE):

    table = {
        'created': fake.date_time_this_decade(),
        'name': fake.random_element(elements=('1', '2', '3', '5', '6', '7', '8', '9', '10')),
        'nopeople': random.randint(1, 20),
        'status': fake.random_element(elements=('available', 'occupied', 'reserved')),
        'waiter_id_id': random.randint(1, RANGE-BATCHES)
    }
    tables.append(table)

# Generate data for Order entity
orders = []
#10000000
for i in range(10000000):
    order = {
        'created': fake.date_time_this_decade(),
        'waiter_id': random.randint(1, RANGE-BATCHES),
        'table_id': random.randint(1, RANGE-BATCHES),
    }
    orders.append(order)

# Generate data for many-to-many intermediary table
order_drinks = []
for i in range(RANGE):
    order_drink = {
        'order_id': random.randint(1, RANGE),
        'drink_id': random.randint(1, RANGE)
    }
    order_drinks.append(order_drink)

# Write SQL script to populate the database
with open('populate_db.sql', 'w') as f:
    #cleanup
    f.write(f'DELETE from api_table;\n')
    f.write(f'DELETE from api_waiter;\n')
    f.write(f'DELETE from api_order;\n')
    f.write(f'DELETE from api_order_drinks;\n')
    f.write(f'DELETE from api_drink;\n')

    f.write(f'ALTER SEQUENCE public.api_table_id_seq RESTART WITH 1;\n')
    f.write(f'ALTER SEQUENCE public.api_order_id_seq RESTART WITH 1;\n')
    f.write(f'ALTER SEQUENCE public.api_waiter_id_seq RESTART WITH 1;\n')
    f.write(f'ALTER SEQUENCE public.api_drink_id_seq RESTART WITH 1;\n')

    # Insert Waiter data in batches of 1000
    for i in range(0, RANGE, BATCHES):
        batch = waiters[i:i + BATCHES]
        values = ",".join(f"('{w['created']}', '{w['firstName']}', '{w['lastName']}', '{w['phoneNumber']}', '{w['email']}', {w['wage']})" for w in batch)
        f.write(f'INSERT INTO api_waiter ("created", "firstName", "lastName", "phoneNumber", "email", "wage") VALUES {values};\n')

    # Insert Drink data in batches of 1000
    for i in range(0, RANGE, BATCHES):
        batch = drinks[i:i + BATCHES]
        values = ",".join(f"('{d['created']}', '{d['name']}', '{d['description']}', '{d['ingredients']}', {d['price']}, {d['calories']})" for d in batch)
        f.write(f'INSERT INTO api_drink ("created", "name", "description", "ingredients", "price", "calories") VALUES {values};\n')

    # Insert Table data in batches of 1000
    for i in range(0, RANGE, BATCHES):
        batch = tables[i:i + BATCHES]
        values = ",".join(f"('{t['created']}', '{t['name']}', {t['nopeople']}, '{t['status']}', {t['waiter_id_id']})" for t in batch)
        f.write(f'INSERT INTO api_table ("created", "name", "nopeople", "status", "waiter_id_id") VALUES {values};\n')
    # Insert Order data in batches of 1000
    for i in range(0, RANGE, BATCHES):
        batch = orders[i:i + BATCHES]
        values = ",".join(f"('{o['created']}', {o['waiter_id']}, {o['table_id']})" for o in batch)
        f.write(f'INSERT INTO api_order ("created", "waiter_id",  "table_id") VALUES {values};\n')

    # Insert Order-Drink data in batches of 1000
    for i in range(0, RANGE, BATCHES):
        batch = order_drinks[i:i + BATCHES]
        values = ",".join(f"({od['order_id']}, {od['drink_id']})" for od in batch)
        f.write(f'INSERT INTO api_order_drinks ("order_id", "drink_id") VALUES {values};\n')