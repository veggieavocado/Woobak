from rest_framework import generics
from rest_framework.filters import SearchFilter, OrderingFilter

from states.models import State
from states.api.serializers import StateSerializer
from utils.paginations import StandardResultPagination

class StateAPIView(generics.ListCreateAPIView):
    queryset = State.objects.all()
    serializer_class = StateSerializer
    pagination_class = StandardResultPagination
    filter_backends = [SearchFilter, OrderingFilter]


class StateDetailsAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = State.objects.all()
    serializer_class = StateSerializer
