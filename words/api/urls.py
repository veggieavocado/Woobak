from django.conf.urls import url

from words.api.views import (
    WordAPIView,
    WordDetailsAPIView,
)

urlpatterns = [
    url(r'^$', WordAPIView.as_view(), name='words'),
    url(r'^(?P<pk>[\w.@+-]+)/$', WordDetailsAPIView.as_view(), name='word-detail'),
    ]
