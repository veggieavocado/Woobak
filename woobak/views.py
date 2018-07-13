from django.shortcuts import render
from django.views import View


class TestView(View):
    def get(self, request, *args, **kwargs):
        return render(request, 'test.html', {})


class BetaHomeView(View):
    def get(self, request, *args, **kwargs):
        return render(request, 'home.html', {})


class BetaLoginView(View):
    def get(self, request, *args, **kwargs):
        return render(request, 'login.html', {})


class BetaRegisterView(View):
    def get(self, request, *args, **kwargs):
        return render(request, 'register.html', {})
