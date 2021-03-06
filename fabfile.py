'''
****** TASK MANAGER USING FABRIC/PYTHON ******
RUN: "fab <taskname>"
(ex) fab shell
(the tasknames are defined below, check the codes below for more information)
###### LOCAL FAB TASKS ######
==> can run on local computer/servers
shell
runserver
static
new_static
migrate
test
lazy_commit
server_reload
restart_celery
js_gobble_reinstall
clean_known_hosts
start_browser

###### INIT DEPLOY TASKS ######
send_deploy_script
init_server
init_web

###### OPEN SHELL TASKS ######
root_web_shell
'''

import os, sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fabric.api import *
from configs.base import CONFIG

from autoserver.common import server_init, web_deploy


###### LOCAL FAB TASKS ######
@task
def shell():
    # opens the shell
    local('python manage.py shell')

@task
def runserver():
    # runs the Django server
    local('python manage.py runserver')

@task
def static():
    # collects static files again
    local('python manage.py collectstatic')

@task
def new_static():
    # removes static-dist directory and collects static again
    local('rm -r static-dist')
    local('mkdir static-dist')
    local('python manage.py collectstatic')

@task
def migrate():
    # make migrations on DB then migrate those changes
    local('python manage.py makemigrations')
    local('python manage.py migrate')

@task
def test():
    # perform Django tests
    local('python manage.py test')

@task
def push(commit_msg):
    # git add . > git commit then git pushes changes lazily
    execute(static)
    with settings(warn_only=True):
        local('git add -A')
        local('git commit -m "{}"'.format(commit_msg))
    local('git push')

@task
def server_reload():
    # local server reload
    local('sudo systemctl restart uwsgi')
    local('sudo systemctl restart nginx')


###### INIT DEPLOY TASKS ######
@task
@hosts(CONFIG['ip-address']['web'])
def send_deploy_script():
    env.user = 'root'
    env.password = CONFIG['initial-deploy-pw']['web']
    # env.password = CONFIG['common']['ROOT_PW']
    put('./scripts/deploy.sh', '~/deploy.sh')

@task
@hosts(CONFIG['ip-address']['web'])
def send_configs():
    env.user = 'root'
    env.password = CONFIG['common']['ROOT_PW']
    run('mkdir -p /home/woobak/woobak/configs')
    put('./configs/*', '/home/woobak/woobak/configs/')

@task
@hosts(CONFIG['ip-address']['web'])
def init_server():
    env.user = 'root'
    # env.password = CONFIG['initial-deploy-pw']['web']
    env.password = CONFIG['common']['ROOT_PW']
    server_init()

@task
@hosts(CONFIG['ip-address']['web'])
def init_web():
    env.user = 'root'
    # env.password = CONFIG['initial-deploy-pw']['web']
    env.password = CONFIG['common']['ROOT_PW']
    web_deploy()


###### OPEN SHELL TASKS ######
@task
@hosts(CONFIG['ip-address']['web'])
def root_web_shell():
    env.user = 'root'
    env.password = CONFIG['common']['ROOT_PW']
    open_shell()
