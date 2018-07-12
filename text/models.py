from django.contrib.postgres.fields import ArrayField
from django.db import models


class Text(models.Model):
    category = models.CharField(max_length=150)
    title = models.CharField(max_length=150)
    text = models.TextField()
    tags = ArrayField(models.CharField(max_length=150), blank=True)
