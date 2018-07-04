from fabric.contrib.files import append, exists
from fabric.api import cd, env, local, run, settings
from fabric.operations import open_shell

from autoserver.autoserver import Autoserver, ConfigOBJ

def server_init():
    woobak = ConfigOBJ('web') # just set as web
    config_obj = woobak.get_conf()
    # deploys webserver using Autoserver instance with 'web' data
    autoserver = Autoserver(config_obj)
    autoserver.update()
    autoserver.set_root_password()
    with settings(warn_only=True):
        autoserver.create_user()
    autoserver.start_firewall()
    autoserver.pull_github_code()
    autoserver.update_and_download_dependencies()
    autoserver.setup_postgresql()
    autoserver.setup_python_virtualenv()
    autoserver.setup_nginx_uwsgi()
