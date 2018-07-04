#! /bin/bash

### CERTBOT AUTOMATION ###

sudo add-apt-repository ppa:certbot/certbot
sudo apt-get update
sudo apt-get install python-certbot-nginx
sudo nginx -t
sudo systemctl reload nginx
sudo certbot --nginx -d veggieavocado.com www.veggieavocado.com
sudo certbot renew --dry-run # certbot auto-renewal
