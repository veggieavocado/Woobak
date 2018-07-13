from django.test import TestCase
from django.contrib.auth import get_user_model
User = get_user_model()

class UserTestCase(TestCase):
    def setUp(self):
        self.user = User(username='test',
                    email="test@gmail.com",
                    password='test123123123')
        self.user.save()

    def test_user_is_created(self):
        username = self.user.username
        self.assertEqual(username, 'test')
