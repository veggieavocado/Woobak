from rest_framework import generics
from rest_framework.filters import SearchFilter, OrderingFilter

from words.models import Word
from words.api.serializers import WordSerializer
from utils.paginations import StandardResultPagination

### Template data###
class WordAPIView(generics.ListCreateAPIView):
    queryset = Word.objects.all()
    serializer_class = WordSerializer
    pagination_class = StandardResultPagination
    filter_backends = [SearchFilter, OrderingFilter]

    def get_queryset(self, *args, **kwargs):
        queryset = Word.objects.all().order_by('id')
        owner_by = self.request.GET.get('owner')
        userid_by = self.request.GET.get('userid')
        source_by = self.request.GET.get('source')
        role_by = self.request.GET.get('role')
        detail_role_by = self.request.GET.get('detail_role')

        if owner_by:
            queryset = queryset.filter(owner=owner_by)
        if userid_by:
            queryset = queryset.filter(userid=userid_by)
        if owner_by and userid_by:
            queryset = queryset.filter(owner=owner_by).filter(userid=userid_by)
        if source_by:
            queryset = queryset.filter(source=source_by)
        if role_by:
            queryset = queryset.filter(role=role_by)
        if detail_role_by:
            queryset = queryset.filter(detail_role=detail_role_by)

        return queryset

class WordDetailsAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Word.objects.all()
    serializer_class = WordSerializer
