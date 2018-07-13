from django.contrib.auth import get_user_model
from django.test import TestCase
from django.core.urlresolvers import reverse

from rest_framework import status
from rest_framework.test import APIClient

from rest_framework_jwt import utils, views
from rest_framework_jwt.compat import get_user_model
from rest_framework_jwt.settings import api_settings, DEFAULTS
from accounts.models import (
    Profile
    )

User = get_user_model()


class UserAPITestCase(TestCase):
    '''
    User REST API testing module
    '''

    def setUp(self):
        print('Starting User API test')
        self.client = APIClient(enforce_csrf_checks=True)
        self.username = 'lee'
        self.email = 'lee@gmail.com'
        self.password = '123123123'
        # create new user to send post requests
        self.user = {
            'username': self.username,
            'email': self.email,
            'password': self.password
        }
        response = self.client.post(
            '/api/accounts/user/',
            self.user,
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.first().username, self.user['username'])
        self.assertEqual(User.objects.first().email, self.user['email'])

    def test_jwt_token(self):
        print('Strating JWT token test')
        userdata =  {
            'username': 'lee',
            'password': '123123123'
        }
        response = self.client.post(
            '/api/accounts/api-token-auth/',
            userdata,
            format='json'
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        decoded_payload = utils.jwt_decode_handler(response.data['token'])

        token = response.data['token']

        response = self.client.get(
            '/api/accounts/profile/',
            format='json',
            HTTP_AUTHORIZATION='JWT {0}'.format(token)
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = self.client.get(
            '/api/accounts/profile/',
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        # user = Profile.objects.all()
        # response = self.client.put(reverse('profile-detail',
        #                                     args=[self.user.username]), data,
        #                                     HTTP_AUTHORIZATION='JWT {0}'.format(token) )
        #
        # username = User.objects.first().username
        # print(username)
        # self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        # print(response.json())
        # # self.assertEqual()
        #
        # data = {'username': 'leemh'}
        # print()
        # response = self.client.put(reverse('profile-detail',
        #                                     args=[self.user.id]), data)
        # self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
