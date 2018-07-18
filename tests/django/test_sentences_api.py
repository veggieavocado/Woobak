from django.contrib.auth import get_user_model
from django.test import TestCase
from django.core.urlresolvers import reverse

from rest_framework import status
from rest_framework.test import APIClient

from rest_framework_jwt import utils, views
from rest_framework_jwt.compat import get_user_model
from rest_framework_jwt.settings import api_settings, DEFAULTS

import json, os
from django.utils.encoding import smart_text

User = get_user_model()
from accounts.models import Profile
from sentences.models import Sentence


class SentenceAPITestCase(TestCase):
    '''
    User REST API testing module
    '''

    def setUp(self):
        print('Starting User API test')
        self.client = APIClient(enforce_csrf_checks=True)
        # User settings
        self.username = 'lee'
        self.email = 'lee@gmail.com'
        self.password = '123123123'
        # create new user to send post requests
        self.user = {
            'username': self.username,
            'email': self.email,
            'password': self.password,
        }

        # 테스트영 user-data 생성
        self.userdata =  {
            'username': self.username,
            'password': self.password,
        }

        self.owner='VA',
        self.userid=1000,
        self.source='TED',
        self.role='프레젠테이션',
        self.detail_role='스티브잡스 연설',
        self.sentence='It started before I was born',
        self.translated='내가 태어나 기 전에 시작되었습니다.',
        # create new user to send post requests

        self.sentence = {
            'owner': self.owner,
            'userid': self.userid,
            'source': self.source,
            'role': self.role,
            'detail_role': self.detail_role,
            'sentence': self.sentence,
            'translated': self.translated
            }

        self.user_response = self.client.post(
            '/api/accounts/user/',
            self.user,
            format='json'
        )

        self.jwt_response = self.client.post(
            '/api/accounts/api-token-auth/',
            json.dumps(self.userdata),
            content_type='application/json'
        )

        self.token = self.jwt_response.data['token']

    def test_setup(self):
        self.assertEqual(User.objects.all().count(), 1, msg='user data not created properly')
        self.assertEqual(self.user_response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.first().username, self.user['username'])
        self.assertEqual(User.objects.first().email, self.user['email'])
        self.assertEqual(self.jwt_response.status_code, status.HTTP_200_OK)

    def test_post_sentence(self):
        # unauthorized case
        response = self.client.post(
            '/api/sentence/',
            self.sentence,
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(Sentence.objects.all().count(), 0, msg='sentence data not created properly')

        # authorized case
        user = User.objects.get(username='lee')
        # self.client.force_authenticate(user=user)
        response = self.client.post(
            '/api/sentence/',
            self.sentence,
            HTTP_AUTHORIZATION='JWT ' + self.token,
            format='json'
        )
        self.assertEqual(Sentence.objects.all().count(), 1, msg='sentence data created properly')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Sentence.objects.first().owner, self.sentence['owner'])
        self.assertEqual(Sentence.objects.first().userid, self.sentence['userid'])

    def test_get_sentence(self):
        # unauthorized case
        response = self.client.get(
            '/api/sentence/',
            format='json'
        )
        data = response.json()
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        # authorized case
        response = self.client.get(
            '/api/sentence/',
            HTTP_AUTHORIZATION='JWT ' + self.token,
            format='json'
        )
        data = response.json()
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(data['owner'], self.sentence['owner'])
        self.assertEqual(data['userid'], self.sentence['userid'])



    # def test_put_sentence(self):
    #     sentence_modified = {
    #         'role': '연설하기',
    #         'detail_role': 'steve jobs 스탠포드 대학교 졸업식 스피치',
    #     }
    #     response = self.client.put(
    #         '/api/sentence/1/',
    #         sentence_modified,
    #         HTTP_AUTHORIZATION='JWT ' + self.token,
    #         format='json'
    #     )
    #
    #     data = response.json()
    #     self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    #     self.assertEqual(data['role'],sentence_modified['role'])
    #     self.assertEqual(data['detail_role'], sentence_modified['detail_role'])
    #
    #     # unauthorized case
    #     response = self.client.put(
    #         '/api/sentence/1/',
    #         sentence_modified,
    #         format='json'
    #     )
    #
    #     data = response.json()
    #     self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    #
    # def test_delete_sentence(self):
    #     # unauthorized case
    #     response = self.client.delete(
    #         '/api/sentence/1/',
    #         format='json',
    #     )
    #     self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    #     self.assertEqual(User.objects.all().count(), 1, msg='sentence data not delete properly')
    #
    #     response = self.client.delete(
    #         '/api/sentence/1/',
    #         HTTP_AUTHORIZATION='JWT ' + self.token,
    #         format='json',
    #     )
    #     self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
    #     self.assertEqual(User.objects.all().count(), 0, msg='sentence data delete properly')
