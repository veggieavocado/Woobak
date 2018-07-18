from django.shortcuts import render
from django.views import View


class TestView(View):
    def get(self, request, *args, **kwargs):
        return render(request, 'test.html', {})


# 베타 버전 웹사이트 공개
class BetaHomeView(View):
    def get(self, request, *args, **kwargs):
        return render(request, 'home.html', {})


class BetaLoginView(View):
    def get(self, request, *args, **kwargs):
        return render(request, 'login.html', {})


class BetaRegisterView(View):
    def get(self, request, *args, **kwargs):
        return render(request, 'register.html', {})


# 관리자 페이지 뷰
class AdminView(View):
    def get(self, request, *args, **kwargs):
        return render(request, 'admin.html', {})


class DevopsView(View):
    def get(self, request, *args, **kwargs):
        return render(request, 'devops.html', {})


# 피피티 페이지 뷰
class PptTemplateView(View):
    def get(self, request, *args, **kwargs):
        return render(request, 'templateview.html', {})
