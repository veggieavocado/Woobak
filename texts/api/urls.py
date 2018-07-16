from django.conf.urls import url

from Texts.api.views import (
    TextAPIView,
)

urlpatterns = [
    url(r'^/api/text/$', TextAPIView.as_view(), name='texts'),
    ]
