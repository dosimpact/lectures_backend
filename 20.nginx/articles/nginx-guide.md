

# static file provide


```
server {
    ...

    location ~ ^/ads.txt { # 정규식에 해당하는 url로 접근하면 
            root /opt/homebrew/etc/nginx/public; # root폴더 기준으로 정적 파일을 제공한다.
            default_type text/plain; # 파일 타입
    }

    ...
}

```