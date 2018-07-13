from django.conf.urls import url
from django.conf.urls import include, url
from django.contrib import admin

from .views import TestView

urlpatterns = [
    url(r'^admin/', admin.site.urls),

    url(r'^$', TestView.as_view(), name='test'),
    url(r'^api/accounts/', include('accounts.api.urls', namespace='accounts')),
]
