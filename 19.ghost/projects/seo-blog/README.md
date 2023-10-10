# ghost cms 설치

db와 ghost cms는 따로 2티어로 구분한다.
- 서버 환경 : M1 Mac OSX 


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
