from django.db import models

# Create your models here.
class Word(models.Model):
    owner = models.CharField(max_length=4)
    userid = models.IntegerField(blank=True, null=True)
    source = models.CharField(max_length=100, blank=True, null=True)
    role = models.CharField(max_length=100, blank=True, null=True)
    word = models.TextField(blank=True, null=True)
    translated = models.TextField(blank=True, null=True)

    def __str__(self):
        return "{}".format(self.owner)
