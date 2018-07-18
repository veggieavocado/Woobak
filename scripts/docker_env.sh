#! /bin/bash

#### 도커 레지스트리/모니터링/로깅 시스템 환경 구축 ####

# install Docker on server
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
add-apt-repository \
"deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
apt-get update
apt-get install docker-ce
apt-get install docker-compose

# 도커 사설 레지스트리 컨테이너 생성
# 서버: 5000 & 컨테이너: 5000 포트 연결
docker run -d --name myregistry \
  -p 5000:5000 \
  --restart=always \
  registry:2

# docker rm --volumes myregistry  -->  레지스트리 형성과 동시에 생기는 볼륨 제거

# 도커 모니터링툴 cAdvisor 시작
# 포트 7000번으로 액세스 가능하도록 하기
sudo docker run \
  --volume=/:/rootfs:ro \
  --volume=/var/run:/var/run:rw \
  --volume=/sys:/sys:ro \
  --volume=/var/lib/docker/:/var/lib/docker:ro \
  --publish=7000:8080 \
  --detach=true \
  --name=cadvisor \
  google/cadvisor:latest
