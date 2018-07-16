from rest_framework import serializers
from sentences.models import Sentence

class SentenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sentence
        fields = "__all__"
