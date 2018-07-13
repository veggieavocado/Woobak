'''
This is a test script for pytest and Travis CI
Refer to the code later as well/Do not delete file (Leave all tests untouched!!)

Writer: 박시형
Date: 6/22
'''
import pytest

# test fixture
@pytest.fixture
def travis_worked_string():
    return 'travis worked!'

def test_travis_worked(travis_worked_string):
    # tests if travis ci works properly and that pytest fixtures also work well
    assert travis_worked_string == 'travis worked!'

def test_travis_with_mh():
    test_var = 1
    assert test_var == 1
