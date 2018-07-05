from django.db import models

# Create your models here.
class Mhtest(models.Model):
    name = models.CharField(max_length=100)
