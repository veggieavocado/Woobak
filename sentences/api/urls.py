from django.conf.urls import url

from sentences.api.views import (
    SentenceAPIView,
    SentenceDetailsAPIView,
)

urlpatterns = [
    url(r'^$', SentenceAPIView.as_view(), name='sentences'),
    url(r'^(?P<pk>[\w.@+-]+)/$', SentenceDetailsAPIView.as_view(), name='sentence-details'),
    ]
