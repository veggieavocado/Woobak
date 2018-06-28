import sys
sys.path.append("..")

import requests
from config.github import GITHUB

username = GITHUB['username']
password = GITHUB['password']
repo = GITHUB['repo']
key = GITHUB['key']

def git_auth():
    r = requests.get('https://api.github.com/?access_token={}'.format(key))
    print(r.status_code)
    print(r.json())

def get_repo():
    r = requests.get('https://api.github.com/repos/{0}/{1}'.format(username, GITHUB['repo']))
    if r.status_code == 200:
        repos = r.json()
        for key, val in repos.items():
            print(key)
            print(val)
            print('--------------------------------------')

def get_branches():
    r = requests.get('https://api.github.com/repos/veggieavocado/Woobak/branches')
    branches = r.json()
    for branch in branches:
        print(branch)


if __name__ == '__main__':
    git_auth()
    print('=====================')
    get_repo()
    print('=====================')
    get_branches()
