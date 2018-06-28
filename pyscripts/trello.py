import sys
sys.path.append("..")

import requests
from config.trello import TRELLO

key = TRELLO['key']
secret = TRELLO['secret']
token = TRELLO['token']

def list_boards():
    r = requests.get('https://api.trello.com/1/members/me/boards?key={0}&token={1}'.format(key, token))
    if r.status_code == 200:
        boards = r.json()
        for board in boards:
            print(board)

def get_va_board_cards():
    va_board_id = '5b27804acfb5b8b8392dbc08'
    r = requests.get('https://api.trello.com/1/boards/{0}/cards?key={1}&token={2}'.format(va_board_id, key, token))
    print(r.json())

def get_va_board_lists():
    va_board_id = '5b27804acfb5b8b8392dbc08'
    r = requests.get('https://api.trello.com/1/boards/{0}/lists?key={1}&token={2}'.format(va_board_id, key, token))
    print(r.json())

if __name__ == '__main__':
    list_boards()
    print('=====================')
    get_va_board_cards()
    print('=====================')
    get_va_board_lists()
