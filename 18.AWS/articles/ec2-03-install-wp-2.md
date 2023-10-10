- [FTP접속 이슈 - 권한 설정](#ftp접속-이슈---권한-설정)
  - [ref](#ref)
- [리다이렉션 이슈](#리다이렉션-이슈)
  - [](#)
- [ec2 ssh down issue](#ec2-ssh-down-issue)

# FTP접속 이슈 - 권한 설정

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


# 리다이렉션 이슈

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

## 

```
sudo apt install php-gd -y
sudo apt install php-mbstring -y

sudo nano /etc/php/8.1/apache2/php.ini
```
# ec2 ssh down issue

```
한국시간기준 00시가되면 ssh가 갑자기죽는다 ?
```

```
sudo apt-get update
sudo apt-get install shellinabox
sudo systemctl start shellinabox
sudo systemctl enable shellinabox

# 2. 설정 변경 http 허용

# Should shellinaboxd start automatically
SHELLINABOX_DAEMON_START=1

# TCP port that shellinboxd's webserver listens on
SHELLINABOX_PORT=4200

# Parameters that are managed by the system and usually should not need
# changing:
# SHELLINABOX_DATADIR=/var/lib/shellinabox
# SHELLINABOX_USER=shellinabox
# SHELLINABOX_GROUP=shellinabox

# Any optional arguments (e.g. extra service definitions).  Make sure
# that that argument is quoted.
#
#   Beeps are disabled because of reports of the VLC plugin crashing
#   Firefox on Linux/x86_64.
# SHELLINABOX_ARGS="--no-beep"
+ SHELLINABOX_ARGS="--disable-ssl"

# 3. ubuntu 계정의 password 설정

sudo passwd ubuntu 
---
sudo passwd root
sudo  su -
passwd ubuntu

# 4. inbound 설정


```
