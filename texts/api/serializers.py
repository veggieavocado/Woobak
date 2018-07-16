from rest_framework import serializers
from texts.models import Text

class TextSerializer(serializers.ModelSerializer):
    class Meta:
        model = Text
        field = {'owner',
                 'userid',
                 'type',
                 'source',
                 'cartegory',
                 'title',
                 'template',
                 'translated',
                  }
