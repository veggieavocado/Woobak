#! /bin/bash

### RANCHER DEPLOY ###

sudo apt-get update
sudo apt-get upgrade

sudo apt install -y docker.io
systemctl start docker
systemctl enable docker

HOST_VOLUME=$HOME/rancher-data/mysql
mkdir -p $HOST_VOLUME

sudo docker run -d -v $HOST_VOLUME:/var/lib/mysql --restart=unless-stopped -p 8000:8080 rancher/server
