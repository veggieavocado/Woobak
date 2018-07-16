from django.db import models

TYPES = (
    ('TEXT', '템플릿'),
    ('SENT', '문장'),
    ('WORD', '단어'),
)

STATUS_TYPES = (
    (1, 'pass'),
    (0, 'fail'),
)

# Create your models here.
class State(models.Model):
    type = models.CharField(max_length=4, choices=TYPES, blank=True, null=True)
    status = models.BooleanField(choices=STATUS_TYPES)
    created = models.DateField(auto_now_add=True)
    updated = models.DateField(auto_now=True)

    def __str__(self):
        return "{}".format(self.type)
