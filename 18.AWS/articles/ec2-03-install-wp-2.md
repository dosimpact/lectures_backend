- [1. FTP접속을 하라는 메시지나 나온다. - 권한 설정 문제](#1-ftp접속을-하라는-메시지나-나온다---권한-설정-문제)
  - [ref](#ref)
- [2. 리다이렉션 이슈](#2-리다이렉션-이슈)
- [3. 메모리 부족 이슈](#3-메모리-부족-이슈)
- [webp 변경 플러그인 support](#webp-변경-플러그인-support)




# 1. FTP접속을 하라는 메시지나 나온다. - 권한 설정 문제

문제
EC2에 mysql-server, php-fpm, nginx(혹은 apache 등)을 설치하고 wordpress를 내려받아 설정 후 관리자로 워드프레스 페이지에 로그인하는데까지 성공했는데
테마, 플러그인 등을 삭제하거나 설치하려고 하면 ftp 혹인 sftp 관련 설정이 필요하다면서 팝업이 나타나는 경우가 있다.

원인
웹서버가 워드프레스 파일이 있는 디렉토리에 접근 권한이 없어서 그렇다.

해결방법
웹서버를 띄운 사용자를 확인(ps -ef | grep nginx 혹은 ps -ef | grep httpd와 같이)해서 워드프레스가 있는 위치(var/wordpress와 같은)에 소유자를 변경해주면 된다. 예를 들어 -


```
# 1. apache2 사용자 파악
ps -ef | grep apache2

# 2. www-data 라는 사용자 이다.

# 3. wordpress 디렉터리 이동 후 권한 부여
cd /var/www/html
sudo chown -R www-data:www-data /var/www/html/wordpress
```


ps -ef | grep apache2

## ref
- https://devlog.jwgo.kr/2019/03/08/wordpress-ftp-setting-popup-on-ec2/


# 2. 리다이렉션 이슈

- 그냥 파머링크를 안바꾸고 기본설정으로 쓰면된다.

```
#1
cd /etc/apache2/sites-available/
sudo nano 000-default.conf 

    ...
    <Directory /var/www/html/wordpress>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>

sudo systemctl restart apache2
```



# 3. 메모리 부족 이슈

https://sundries-in-myidea.tistory.com/102

```
한국시간기준 00시가되면 ssh가 갑자기죽는다 ?
ssh 접속도 불가능한 상태임을 보니, OOM으로 서버가 다운된것
- 재시작하니 정상 접속 가능
- 하지만 또 얼마 못가 다운된다.
```

```
# 0. 메모리 상태 파악
free -h


# 1. 일단 dd 명령어를 통해 swap 메모리를 할당한다.
128씩 16개의 공간을 만드는 것이여서 우리의 경우 count를 16으로 할당하는 것이 좋다. 즉, 2GB정도 차지하는 것이다.
sudo dd if=/dev/zero of=/swapfile bs=128M count=16

# 2. 스왑 파일에 대한 읽기 및 쓰기 권한을 업데이트합니다.
sudo chmod 600 /swapfile

# 3. Linux 스왑 영역을 설정합니다.
sudo mkswap /swapfile


# 4. 스왑 공간에 스왑 파일을 추가하여 스왑 파일을 즉시 사용할 수 있도록 만듭니다.
sudo swapon /swapfile
 

# 5. 절차가 성공했는지 확인합니다.
sudo swapon -s

# 6. /etc/fstab 파일을 편집하여 부팅 시 스왑 파일을 활성화합니다.
편집기에서 파일을 엽니다.
sudo vi /etc/fstab

파일 끝에 다음 줄을 새로 추가하고 파일을 저장한 다음 종료합니다.
/swapfile swap swap defaults 0 0

# 7. 다음과 같이 적용됬는지 확인을 해봅니다.
free -h
             total       used       free     shared    buffers     cached
Mem:       1009136     941624      67512          4      11696      96836
-/+ buffers/cache:     833092     176044
Swap:      2097148     304972    1792176
 

적어도 이렇게하면 삐걱삐걱 돌아가기는 합니다. 물론 원래 RAM에 비해서는 속도가 현저히 낮아집니다. HDD에 할당하기때문에, RAM이랑 비교하기에는 쨉도 안되는 속도지만...
```



# webp 변경 플러그인 support 

```
sudo apt install php-gd -y
sudo apt install php-mbstring -y

sudo nano /etc/php/8.1/apache2/php.ini
```
