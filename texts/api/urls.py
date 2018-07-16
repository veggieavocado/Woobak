from django.conf.urls import url

from texts.api.views import (
    TextAPIView,
    TextDetailsAPIView,
)

urlpatterns = [
    url(r'^$', TextAPIView.as_view(), name='texts'),
    url(r'^(?P<pk>[\w.@+-]+)/$', TextDetailsAPIView.as_view(), name='text-details'),
]
