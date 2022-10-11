# Generated by Django 4.0.3 on 2022-04-01 17:46

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('stores', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Hashtag',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=200)),
                ('singer', models.CharField(blank=True, max_length=50)),
                ('group', models.CharField(blank=True, max_length=50)),
                ('cnt', models.IntegerField(default=0)),
            ],
        ),
        migrations.CreateModel(
            name='Review',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('twitter_id', models.CharField(max_length=25)),
                ('map_id', models.IntegerField()),
                ('url', models.CharField(max_length=200)),
                ('img_url', models.CharField(max_length=200)),
                ('hashtags', models.ManyToManyField(related_name='reviews', to='reviews.hashtag')),
                ('store', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='stores.store')),
            ],
        ),
    ]
