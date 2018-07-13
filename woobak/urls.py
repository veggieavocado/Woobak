from django.conf.urls import url
from django.conf.urls import include, url
from django.contrib import admin

from .views import (
    TestView,
    BetaHomeView,
    BetaLoginView,
    BetaRegisterView,
    AdminView,
    DevopsView,
)

urlpatterns = [
    url(r'^admin/', admin.site.urls),

    url(r'^$', TestView.as_view(), name='test'),

    url(r'^api/accounts/', include('accounts.api.urls', namespace='accounts')),

    # beta version links
    url(r'^beta/$', BetaHomeView.as_view(), name='beta-home'),
    url(r'^beta/login/$', BetaLoginView.as_view(), name='beta-login'),
    url(r'^beta/register/$', BetaRegisterView.as_view(), name='beta-register'),

    # 관리자 페이지
    url(r'^manager/$', AdminView.as_view(), name='manager'),
    url(r'^manager/devops/$', DevopsView.as_view(), name='devops'),
]
