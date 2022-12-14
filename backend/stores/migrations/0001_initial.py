# Generated by Django 4.0.3 on 2022-03-25 06:02

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Store',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('map_id', models.IntegerField()),
                ('store_name', models.CharField(max_length=50)),
                ('address', models.CharField(max_length=200)),
                ('simple_address', models.CharField(max_length=100)),
                ('category', models.CharField(max_length=100)),
                ('tel', models.CharField(max_length=50)),
                ('business_hours', models.CharField(max_length=500)),
                ('store_cnt', models.IntegerField(default=0)),
                ('lat', models.FloatField()),
                ('lon', models.FloatField()),
            ],
        ),
    ]
