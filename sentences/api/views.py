from rest_framework import generics
from rest_framework.filters import SearchFilter, OrderingFilter

from sentences.models import Se
from sentences.api.serializers import SentenceSerializer
from utils.paginations import StandardResultPagination

### Template data###
class SentenceAPIView(generics.ListAPIView):
    queryset = Text.objects.all()
    serializer_class = SentenceSerializer
    pagination_class = StandardResultPagination
    filter_backends = [SearchFilter, OrderingFilter]

    def get_queryset(self, *args, **kwargs):
        queryset = Text.objects.all().order_by('id')
        owner_by = self.request.GET.get('owner')
        userid_by = self.request.GET.get('userid')
        source_by = self.request.GET.get('source')
        role_by = self.request.GET.get('role')
        detail_role_by = self.request.GET.get('detail_role')
        sentence_by = self.request.GET.get('sentence')

        if owner_by:
            queryset = queryset.filter(owner=owner_by)
        if userid_by:
            queryset = queryset.filter(userid=userid_by)
        if owner_by and userid_by:
            queryset = queryset.filter(owner=owner_by).filter(userid=userid_by)
        if type_by:
            queryset = queryset.filter(type=source_by)
        if source_by:
            queryset = queryset.filter(source=role_by)
        if title_by:
            queryset = queryset.filter(title=detail_role_by)
        if template_by:
            queryset = queryset.filter(template__contains=sentence_by)

        return queryset
