from django.conf.urls import url

from states.api.views import (
    StateAPIView,
    StateDetailsAPIView,
)

urlpatterns = [
    url(r'^$', StateAPIView.as_view(), name='states'),
    url(r'^(?P<pk>[\w.@+-]+)/$', StateDetailsAPIView.as_view(), name='state-details'),
    ]
