- [ghost cms 설치](#ghost-cms-설치)
  - [db setup](#db-setup)
  - [dbeaver 접속](#dbeaver-접속)
  - [nginx connect](#nginx-connect)

# ghost cms 설치

db와 ghost cms는 따로 2티어로 구분한다.
- 서버 환경 : M1 Mac OSX 

## db setup

```
# mysql 8 초기셋팅 퀵스타트

## eg - database 를 만들고, admin 유저에게 권한을 할당.

```sql
docker exec -it mysql_8 mysql -uroot -p

[ root 계정 생성 후 모든 권한 주기 ]
// 모든곳에서 접속할 수 있는 root 유저 생성 및 모든 권한 주기
-- create user 'root'@'%' IDENTIFIED BY 'user_name';
-- GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' WITH GRANT OPTION;

[ buffett 이라는 db를 만든다. ]
create database buffett default character set utf8mb4;



[ admin 유저 생성 후 권한 할당]
CREATE USER 'admin'@'%' IDENTIFIED BY 'user_name';
GRANT ALL PRIVILEGES ON buffett.* TO 'admin'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;

[ 유저 확인 ]
mysql> select user,host from mysql.user;
+------------------+-----------+
| user             | host      |
+------------------+-----------+
| admin            | %         |
| mysql.infoschema | localhost |
| mysql.session    | localhost |
| mysql.sys        | localhost |
| root             | localhost |
+------------------+-----------+

[ 권한 확인 ]
mysql> SHOW GRANTS FOR admin@'%';
+----------------------------------------------------------------------+
| Grants for admin@%                                                   |
+----------------------------------------------------------------------+
| GRANT USAGE ON *.* TO `admin`@`%`                                    |
| GRANT ALL PRIVILEGES ON `buffett`.* TO `admin`@`%` WITH GRANT OPTION |
+----------------------------------------------------------------------+
```

## dbeaver 접속 

이슈) Public key retrieval is not allowed
- 해결: Driver Properties > allowPublicKeyRetrieval = True 설정

```

## ghost docker run

```yml
# .env
GHOST_CONTENT_VOLUME_DIR=/Volume/ghost-content
GHOST_URL=https://ex.domain.com

DB_CONNECTION_HOST=host
DB_CONNECTION_PORT=3306
DB_CONNECTION_USER=admin
DB_CONNECTION_PASSWORD=password
DB_CONNECTION_DATABASE=ghost
--- 
# docker-compse.yml
version: "3.1"

networks:
  ghost:
    driver: bridge

services:
  ghost:
    image: ghost:5.62
    restart: always
    container_name: ghost_5
    ports:
      - 3030:2368
    volumes:
      - ${GHOST_CONTENT_VOLUME_DIR}:/var/lib/ghost/content
    environment:
      # see https://ghost.org/docs/config/#configuration-options
      database__client: mysql
      database__connection__host: ${DB_CONNECTION_HOST}
      database__connection__port: ${DB_CONNECTION_PORT}
      database__connection__user: ${DB_CONNECTION_USER}
      database__connection__password: ${DB_CONNECTION_PASSWORD}
      database__connection__database: ${DB_CONNECTION_DATABASE}
      # this url value is just an example, and is likely wrong for your environment!
      url: ${GHOST_URL}
      # contrary to the default mentioned in the linked documentation, this image defaults to NODE_ENV=production (so development mode needs to be explicitly specified if desired)
      #NODE_ENV: development
    networks:
      - ghost

---
docker compose up -d
docker compose down

```

## nginx connect

```
#.1 nginx 설치
brew install nginx
brew services start nginx
brew services stop nginx
brew services restart nginx

brew services
Name        Status  User      File
nginx       started dodo ~/Library/LaunchAgents/homebrew.mxcl.nginx.plist


#.2 환경설정파일
cd /opt/homebrew/etc/nginx/
nano /opt/homebrew/etc/nginx/nginx.conf

# 환경 설정 파일 검사 후 재시작
nginx -t 
brew services restart nginx

---

    server {
        listen 443 ssl; 
        server_name travel.domain.com; 

        access_log /Users/dodo/log/ghost/access.log;
        error_log /Users/dodo/log/ghost/error.log;

        client_max_body_size 100M;

        ssl_certificate /etc/letsencrypt/live/travel.domain.com/fullchain.pem; 
        ssl_certificate_key /etc/letsencrypt/live/travel.domain.com/privkey.pem; 

        # SSL 설정 (최신 보안 권장)
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers 'TLS_AES_128_GCM_SHA256:TLS_AES_256_GCM_SHA384:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384';
        ssl_prefer_server_ciphers off;

        # SSL 세션 캐싱 설정
        ssl_session_cache shared:SSL:10m;
        ssl_session_timeout 1h;

        location / {
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Host $host;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_pass http://127.0.0.1:3030/;
        }   
    }

    # ghost cms - dodoco-coding
    server {
        listen 80 ;
        server_name wp.dodoco-coding.site;

        location /.well-known/acme-challenge {
            alias /opt/homebrew/etc/nginx/.well-known/acme-challenge; # 실제 파일이 위치한 경로를 지정합니다.
            try_files $uri $uri/ /opt/homebrew/etc/nginx/.well-known/acme-challenge/GA8XfAQnDC7jp1kjtxMmzhUJ5RVeYWG0MbwfdnH1JXQ; # 특정 파일명을 여기에 지정합니다.
        }

        location / {  # HTTP to HTTPS 리디렉션
            return 301 https://$host$request_uri;
            # proxy_pass http://127.0.0.1:8080;
        }
        # location ~ /.well-known {
        #     allow all;
        # }
    }


```


```
1. 하위 설정 파일 생성 (하위 서버 블록)

# nginx.conf
http {
    ... 
    include servers/*;
    ..
}



2. 환경 설정 추가 

- http 서버 블록 분기처리 추가
- nginx는 서버 블록 환경 설정을 분리할 수 있다.
- 하위 폴더에 아래의 내용 추가
- 파일명 : server/domain.conf

# ghost cms - domain.com
server {
    listen 80 ;
    server_name domain.com www.domain.com;

    access_log /Users/user_name/log/ghost_domain/access.log;
    error_log /Users/user_name/log/ghost_domain/error.log;


    location / {  # HTTP to HTTPS 리디렉션
        # return 301 https://$host$request_uri;
        proxy_pass http://127.0.0.1:3031/;
    }
}

3. https 인증서 발급
sudo certbot --nginx --nginx-server-root /opt/homebrew/etc/nginx -d domain.com


Password:
Saving debug log to /var/log/letsencrypt/letsencrypt.log
Requesting a certificate for domain.com

Successfully received certificate.
Certificate is saved at: /etc/letsencrypt/live/domain.com/fullchain.pem
Key is saved at:         /etc/letsencrypt/live/domain.com/privkey.pem
This certificate expires on 2024-01-11.
These files will be updated when the certificate renews.

Deploying certificate
Successfully deployed certificate for domain.com to /opt/homebrew/etc/nginx/servers/domain.com.conf
Congratulations! You have successfully enabled HTTPS on https://domain.com

NEXT STEPS:
- The certificate will need to be renewed before it expires. Certbot can automatically renew the certificate in the background, but you may need to take steps to enable that functionality. See https://certbot.org/renewal-setup for instructions.

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
If you like Certbot, please consider supporting our work by:
 * Donating to ISRG / Let's Encrypt:   https://letsencrypt.org/donate
 * Donating to EFF:                    https://eff.org/donate-le
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

4. restart nginx 

sudo chmod -R 755 /etc/letsencrypt
nginx -t 
brew services restart nginx

5. change nginx conf


    + client_max_body_size 100M;
    location / { 
        +proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        +proxy_set_header X-Forwarded-Host $host;
        +proxy_set_header X-Forwarded-Proto $scheme;
        proxy_pass http://127.0.0.1:3031/;
    }

6. restart nginx 
nginx -t 
brew services restart nginx

7.


# ghost cms - domain.com
server {
    server_name domain.com;

    access_log /Users/user_name/log/ghost_domain/access.log;
    error_log /Users/user_name/log/ghost_domain/error.log;

    client_max_body_size 100M;

    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/domain.com/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/domain.com/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot

    location / { 
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_pass http://127.0.0.1:3031/;
    }

}

server {
    if ($host = domain.com) {
        return 301 https://$host$request_uri;
    } # managed by Certbot


    listen 80 ;
    server_name domain.com;
    return 404; # managed by Certbot

}

---

final conf


# ghost cms - domain.com
server {
    server_name domain.com;

    access_log /Users/user_name/log/ghost_domain/access.log;
    error_log /Users/user_name/log/ghost_domain/error.log;

    client_max_body_size 100M;

    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/domain.com/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/domain.com/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot

    location / { 
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_pass http://127.0.0.1:3031/;
    }

}

server {
    if ($host = domain.com) {
        return 301 https://$host$request_uri;
    } # managed by Certbot


    listen 80 ;
    server_name domain.com;
    return 404; # managed by Certbot

}


```