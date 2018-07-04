from fabric.api import cd, env, local, run, sudo, settings, put, open_shell
from fabric.contrib.files import exists
from fabric.operations import open_shell

from configs.base import CONFIG


class ConfigOBJ(object):

    def __init__(self, this_system):
        self.config = {
            'project_name': CONFIG['common']['PROJECT_NAME'],
            'github_repo': CONFIG['common']['GITHUB_REPO'],
            'ip_address': CONFIG['ip-address'][this_system],
            'root_pw': CONFIG['common']['ROOT_PW'],
            'user_id': CONFIG['common']['USER_ID'],
            'user_pw': CONFIG['common']['USER_PW'],
            'db_id': CONFIG['common']['DB_USER'],
            'db_pw': CONFIG['common']['DB_PW'],
            'uwsgi_ini': CONFIG['common']['UWSGI_INI'],
            'uwsgi_service': CONFIG['common']['UWSGI_SERVICE'],
            'nginx_conf': CONFIG['common']['NGINX_CONF'],
            'supervisor_celery': CONFIG['common']['SUPERVISOR_CELERY'],
            'supervisor_celerybeat': CONFIG['common']['SUPERVISOR_CELERYBEAT'],
            'redis_conf': CONFIG['common']['REDIS_CONF']
        }

    def get_conf(self):
        return self.config


class Autoserver(object):
    '''
    Autoserver wraps up basic commands needed for deploying and managing Ubuntu (Debian based) servers.
    '''

    def __init__(self, config_obj):
        # initialize Autoserver instance with a config object
        # in this case we will use the BuzzzConfig object after instantiating it
        # you are most likely to get these data from config.py file
        self.PROJECT_NAME = config_obj['project_name']
        self.GITHUB_REPO = config_obj['github_repo']
        self.IP_ADDRESS = config_obj['ip_address']
        self.ROOT_PW = config_obj['root_pw']
        self.USER_ID = config_obj['user_id']
        self.USER_PW = config_obj['user_pw']
        self.DB_ID = config_obj['db_id']
        self.DB_PW = config_obj['db_pw']

        # configuration file names
        self.UWSGI_INI = config_obj['uwsgi_ini']
        self.UWSGI_SERVICE = config_obj['uwsgi_service']
        self.NGINX_CONF = config_obj['nginx_conf']
        self.SUPERVISOR_CELERY = config_obj['supervisor_celery']
        self.SUPERVISOR_CELERYBEAT = config_obj['supervisor_celerybeat']
        self.REDIS_CONF = config_obj['redis_conf']

        print(
        '''
        Project Name: {0}
        Github Repo: {1}
        IP Address: {2}
        Root PW: {3}
        User ID: {4}
        User PW: {5}
        DB ID: {6}
        DB PW: {7}

        UWSGI .ini file: {8}
        UWSGI .service file: {9}
        NGINX configuration file: {10}
        Supervisor celery file: {11}
        Supervisor celerybeat file: {12}
        Redis configuaration file: {13}
        '''.format(self.PROJECT_NAME,
                   self.GITHUB_REPO,
                   self.IP_ADDRESS,
                   self.ROOT_PW,
                   self.USER_ID,
                   self.USER_PW,
                   self.DB_ID,
                   self.DB_PW,
                   self.UWSGI_INI,
                   self.UWSGI_SERVICE,
                   self.NGINX_CONF,
                   self.SUPERVISOR_CELERY,
                   self.SUPERVISOR_CELERYBEAT,
                   self.REDIS_CONF
                   )
        )

    def update(self):
        run('sudo apt-get update')
        return True

    ### TEST PASSED ###
    def set_root_password(self):
        run('echo -e "{0}\n{1}" | passwd root'.format(self.ROOT_PW, self.ROOT_PW))
        return True # returns True after running so DeployTester knows that the function ran

    ### TEST PASSED ###
    def create_user(self):
        run('echo -e "{0}\n{1}" | adduser {2}'.format(self.USER_PW,
                                                      self.USER_PW,
                                                      self.USER_ID))
        run('usermod -aG sudo {}'.format(self.USER_ID))
        run('groups {}'.format(self.USER_ID))
        return True

    ### TEST PASSED ###
    def start_firewall(self):
        run('sudo ufw app list')
        run('sudo ufw allow OpenSSH')
        run('echo -e "y" | sudo ufw enable')
        return True

    ### TEST PASSED ###
    def pull_github_code(self):
        # create project folder to move your github code into
        with settings(warn_only=True):
            run('mkdir /home/{0}/{1}'.format(self.USER_ID, self.PROJECT_NAME))
        with cd('/home/{0}/{1}'.format(self.USER_ID, self.PROJECT_NAME)):
            run('git clone {}'.format(self.GITHUB_REPO)) # clone your github code
            repo_name = self.GITHUB_REPO.split('/')[-1].split('.')[0] # get your github repo name
            with settings(warn_only=True):
                # move your github repo code into your specified directory
                run('mv ./{0}/* /home/{1}/{2}'.format(repo_name,
                                                      self.USER_ID,
                                                      self.PROJECT_NAME))
                run('rm -r {}'.format(repo_name))
        return True

    ### TEST PASSED ###
    def update_and_download_dependencies(self):
        run('sudo apt-get update')
        run('sudo apt-get install python3-pip python3-dev libpq-dev postgresql postgresql-contrib')
        return True

    ### TEST PASSED ###
    def setup_postgresql(self):
        # open port 5432 to remote computers/servers
        run('sudo ufw allow 5432')
        # moving postgresql configuration files to server
        # this is needed to allow access from remote computers to server
        with cd('/etc/postgresql/9.5/main'):
            run("vim +\":%s/#listen_addresses = 'localhost'/listen_addresses = '*'/g | wq\" postgresql.conf")
            run("vim +\"%s/127.0.0.1\/32/0.0.0.0\/0   /g | %s/::1\/128/::\/0/g | wq\" pg_hba.conf")
        # start, enable and restart postgresql service
        # run('sudo systemctl start postgresql.service')
        run('sudo systemctl enable postgresql.service')
        run('sudo systemctl restart postgresql.service')

        # create database table and user if they do not exist already
        with settings(warn_only=True):
            run('sudo -i -u postgres psql -c "CREATE DATABASE {};"'.format(self.DB_ID))
        with settings(warn_only=True):
            run("sudo -i -u postgres psql -c \"CREATE USER {0} WITH PASSWORD '{1}';\"".format(self.DB_ID, self.DB_PW))
        run("sudo -i -u postgres psql -c \"ALTER ROLE {} SET client_encoding TO 'utf8';\"".format(self.DB_ID))
        run("sudo -i -u postgres psql -c \"ALTER ROLE {} SET default_transaction_isolation TO 'read committed';\"".format(self.DB_ID))
        run("sudo -i -u postgres psql -c \"ALTER ROLE {} SET timezone TO 'UTC';\"".format(self.DB_ID))
        run("sudo -i -u postgres psql -c \"GRANT ALL PRIVILEGES ON DATABASE {0} TO {1};\"".format(self.DB_ID, self.DB_ID))
        return True

    ### TEST PASSED ###
    def setup_python_virtualenv(self):
        # download dependencies
        run('sudo -H pip3 install --upgrade pip')
        run('sudo pip3 install setuptools')
        run('sudo -H pip3 install virtualenv virtualenvwrapper')
        # configure virtualenvwrapper to load on terminal open
        run('echo "export VIRTUALENVWRAPPER_PYTHON=/usr/bin/python3" >> ~/.bashrc')
        run('echo "export WORKON_HOME=/home/{}/venv" >> ~/.bashrc'.format(self.USER_ID))
        run('echo "source /usr/local/bin/virtualenvwrapper.sh" >> ~/.bashrc')
        # final step of this is to reboot server
        # run('source ~/.bashrc') # does not work, run manually
        open_shell()
        # 1. source ~/.bashrc
        # 2. mkvirtualenv woobak
        return True

    def setup_nginx_uwsgi(self):
        # install nginx and uwsgi on server
        # needs build-essential to compile uwsgi correctly, since it is run on a C++ platform
        run('sudo apt-get install build-essential nginx')
        run('sudo apt-get install uwsgi uwsgi-emperor uwsgi-plugin-python3')
        run('sudo -H pip3 install uwsgi')
        run('sudo usermod -aG www-data woobak')
        # move uwsgi and nginx conf files from within the server to correct locations
        run('sudo mkdir -p /etc/uwsgi/sites')
        run('sudo cp /home/{0}/{1}/server_config/uwsgi/{2} /etc/uwsgi/sites/{3}'.format(self.USER_ID,
                                                                                        self.PROJECT_NAME,
                                                                                        self.UWSGI_INI,
                                                                                        self.UWSGI_INI))
        run('sudo ln -s /etc/uwsgi/sites/{0} /etc/uwsgi-emperor/vassals'.format(self.UWSGI_INI))
        run('sudo cp /home/{0}/{1}/server_config/uwsgi/uwsgi.service /etc/systemd/system/uwsgi.service'.format(self.USER_ID,
                                                                                                               self.PROJECT_NAME))
        run('sudo cp /home/{0}/{1}/server_config/nginx/{2} /etc/nginx/sites-available/{3}'.format(self.USER_ID,
                                                                                                  self.PROJECT_NAME,
                                                                                                  self.NGINX_CONF,
                                                                                                  self.NGINX_CONF))
        with settings(warn_only=True):
            run('sudo ln -s etc/nginx/sites-available/{0} /etc/nginx/sites-enabled'.format(self.NGINX_CONF))

        cd('/etc/nginx/sites-available'):
            run("vim +\":%s/server_name 127.0.0.1;/server_name {0} veggieavocado.com www.veggieavocado.com;/g | wq\" {1}".format(self.IP_ADDRESS,
                                                                                                                                 self.NGINX_CONF))
        run('sudo nginx -t') # check for any errors in nginx conf file
        run('sudo systemctl restart nginx') # restart nginx to apply changes in configuration files
        run('sudo systemctl start uwsgi')
        # enable both nginx and uwsgi
        run('sudo systemctl enable nginx')
        run('sudo systemctl enable uwsgi')
        # open firewall for port 80: nginx access
        run('sudo ufw allow "Nginx Full"')
        return True
