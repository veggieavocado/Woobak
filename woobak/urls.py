from django.conf.urls import url
from django.contrib import admin

from .views import TestView

urlpatterns = [
    url(r'^admin/', admin.site.urls),

    url(r'^$', TestView.as_view(), name='test'),
]
