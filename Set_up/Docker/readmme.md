# For brand new installation, you need to do the following steps:

## Create all necesary folders
They are described in the ./nginx/docker-compose.yml file
- /docker/nginx/conf/
- /docker/couchdb/etc
- /docker/couchdb/databases/mainCouchdb/docker

## Configure .env file
Put your own values in the .env file

## You need to configure nginx file
File location: ./nginx/conf/default.conf

Some parameters you need to change:
proxy_pass
allow_origin
server_name

## Run docker-compose
```bash
cd ./nginx
docker compose up -d
```
---
# Some useful commands:

## Note:
### -If "docker compose" command is used:
> you need to be in the same folder as the docker-compose.yml file
> you need to reference the container name in the docker-compose.yml file

### -If "docker" command is used:
> you need to reference the container name in the list displayed by the command "docker ps -a"

## Print logs of the container (e.g. nginxCouchdb)
```bash
docker compose logs <-Container-Name->
```

## Restart container (e.g. nginxCouchdb)
```bash
docker compose restart <-Container-Name->
```

## Stop container (e.g. nginxCouchdb)
```bash
docker compose stop <-Container-Name->
```

## Start container (e.g. nginxCouchdb)
```bash
docker compose start <-Container-Name->
```

## Remove container (e.g. nginxCouchdb)
```bash
docker compose rm <-Container-Name->
```

## Remove all containers
```bash
docker compose rm
```

## Container bash (e.g. nginx-webserver-1)
```bash
docker exec -it <-Container-Name-> bash
```