from rest_framework import generics
from rest_framework.filters import SearchFilter, OrderingFilter

from texts.models import Text
from texts.api.serializers import TextSerializer
from utils.paginations import StandardResultPagination

### Template data###
class TextAPIView(generics.ListCreateAPIView):
    queryset = Text.objects.all()
    serializer_class = TextSerializer
    pagination_class = StandardResultPagination
    filter_backends = [SearchFilter, OrderingFilter]

    def get_queryset(self, *args, **kwargs):
        queryset = Text.objects.all().order_by('id')
        owner_by = self.request.GET.get('owner')
        userid_by = self.request.GET.get('userid')
        type_by = self.request.GET.get('type')
        source_by = self.request.GET.get('source')
        category_by = self.request.GET.get('category')
        title_by = self.request.GET.get('title')

        if owner_by:
            queryset = queryset.filter(owner=owner_by)
        if userid_by:
            queryset = queryset.filter(userid=userid_by)
        if owner_by and userid_by:
            queryset = queryset.filter(owner=owner_by).filter(userid=userid_by)
        if type_by:
            queryset = queryset.filter(type=type_by)
        if category_by:
            queryset = queryset.filter(category=category_by)
        if title_by:
            queryset = queryset.filter(title=title_by)

        return queryset


class TextDetailsAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Text.objects.all()
    serializer_class = TextSerializer
