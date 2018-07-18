from django.db import models

# Create your models here.
class Text(models.Model):
    owner = models.CharField(max_length=4)
    userid = models.IntegerField(blank=True, null=True)
    type = models.CharField(max_length=10, blank=True, null=True)
    source = models.CharField(max_length=100, blank=True, null=True)
    cartegory = models.CharField(max_length=100, blank=True, null=True)
    title = models.CharField(max_length=100, blank=True, null=True)
    template = models.TextField(blank=True, null=True)
    translated = models.TextField(blank=True, null=True)

    def __str__(self):
        return "{}".format(self.owner)
