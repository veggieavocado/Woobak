from django.conf.urls import url

from sentences.api.views import (
    SentenceAPIView,
)

urlpatterns = [
    url(r'^/api/sentence/$', TextAPIView.as_view(), name='texts'),
    ]
