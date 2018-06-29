'''
명훈과의 오픈랩 테스팅 세션

Writer: 박시형
Date: 6/29
'''
import pytest

from mhtest.models import Mhtest

@pytest.fixture
@pytest.mark.django_db
def save_mhtest_data():
    mhtest_inst = Mhtest(name='mh')

def simple_test(save_mhtest_data):
    data_num = Mhtest.objects.all().count()
    assert data_num == 1
