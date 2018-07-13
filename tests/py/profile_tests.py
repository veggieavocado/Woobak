'''
pytest user and profile

Writer: MH-Lee
Date: 7/13
'''
import pytest
from django.contrib.auth import get_user_model
User = get_user_model()


@pytest.fixture
@pytest.mark.django_db
def make_user_data():
    print('make user data')
    user, user_created = User.objects.get_or_create(username='test',
                                                    email="test@gmail.com",
                                                    password='test123123123')

def simple_user_test(make_user_data):
    data_num = User.objects.all().count()
    user_name = User.objects.first().username
    user_password = User.objects.first().password

    assert data_num == 1
    assert user_created == 1
    assert user_name == 'test'
    assert user_password == 'test12312313'
