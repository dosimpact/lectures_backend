
# refs)
https://m.blog.naver.com/wideeyed/222025366151

```
sudo docker run --name myvault -d --cap-add=IPC_LOCK -p 8200:8200 \
             --log-opt mode=non-blocking \
             -v /Users/dos/DockerVolumns/vault/config:/vault/config \
             -v /Users/dos/DockerVolumns/vault/file:/vault/file \
             -v /Users/dos/DockerVolumns/vault/logs:/vault/logs vault server 
 
```

https://ikcoo.tistory.com/363

```
docker run --cap-add=IPC_LOCK -d  -e 'VAULT_DEV_ROOT_TOKEN_ID=qwer1234'  -e 'VAULT_DEV_LISTEN_ADDRESS=0.0.0.0:8200'  -p 8200:8200  --name=dev-vault vault
```