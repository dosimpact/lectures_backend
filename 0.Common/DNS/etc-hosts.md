

# hosts 파일

hosts 파일는 DNS보다 먼저 호스트명을 IP로 변경해 주는 파일이다. 주로 개발을 하거나, 특별한 이유로 호스트명으로 통신을 해야 하는 경우에 변경하여 사용할 있다.
- etc/hosts 에서 로컬 도메인과 매핑을 할 수 있다.

```
##
# Host Database
#
# localhost is used to configure the loopback interface
# when the system is booting.  Do not change this entry.
##
127.0.0.1       localhost
255.255.255.255 broadcasthost
::1             localhost
# Added by Docker Desktop

# To allow the same kube context to work on the host and the container:
127.0.0.1 kubernetes.docker.internal

# exmaple) 127.0.0.1 local.dodoco.com - O
# exmaple) dodokyo.github.io blog.dodoco.com - X 

# End of section
```

DNS cache 를 갱신한다. 이제 hosts 파일이 수정하면 재부팅하거나, dscacheutil -flushcache 를 입력하면 바로 적용 하실 수 있다.
> dscacheutil -flushcache

# ref
- https://www.devkuma.com/docs/mac-os/hosts/