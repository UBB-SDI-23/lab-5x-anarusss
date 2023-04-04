# Generated by Django 3.1.8 on 2023-03-23 08:36

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Drink',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('name', models.CharField(max_length=200)),
                ('description', models.CharField(max_length=500)),
                ('ingredients', models.CharField(blank=True, max_length=500)),
                ('price', models.IntegerField(null=True)),
                ('calories', models.IntegerField(null=True)),
            ],
            options={
                'ordering': ['created'],
            },
        ),
        migrations.CreateModel(
            name='Waiter',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('firstName', models.CharField(max_length=50)),
                ('lastName', models.CharField(max_length=50)),
                ('phoneNumber', models.CharField(max_length=20)),
                ('email', models.CharField(max_length=30)),
                ('wage', models.IntegerField()),
            ],
            options={
                'ordering': ['created'],
            },
        ),
        migrations.CreateModel(
            name='Table',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('name', models.IntegerField()),
                ('nopeople', models.IntegerField()),
                ('status', models.CharField(max_length=50)),
                ('waiter_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='waiterTable', to='api.waiter')),
            ],
            options={
                'ordering': ['created'],
            },
        ),
        migrations.CreateModel(
            name='Order',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('drinks', models.ManyToManyField(to='api.Drink')),
                ('table', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='orderedDrink', to='api.table')),
                ('waiter', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='assignedWaiter', to='api.waiter')),
            ],
            options={
                'ordering': ['created'],
            },
        ),
    ]
