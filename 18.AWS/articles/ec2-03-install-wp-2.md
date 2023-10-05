- [aws 프리티어 회원가입](#aws-프리티어-회원가입)


# FTP 설정
- 테마 및 플러그인을 설치 및 삭제하려면 FTP 접근을 허용시켜 줘야 한다.

```
#1. vsftpd (Very Secure FTP Daemon) 설치:
sudo apt-get update
sudo apt-get install vsftpd
 
#2. vsftpd 설정
sudo nano /etc/vsftpd.conf
  <!-- write_enable=YES -->
  <!-- local_umask=022 -->
  listen=YES
  listen_ipv6=NO
  local_enable=YES
  write_enable=YES
  chroot_local_user=YES

sudo service vsftpd restart
sudo service apache2 restart

#3.FTP 사용자 생성
sudo adduser ftp_user
>비밀번호 입력 해야함 > id ftp_user, password 생성 완료.!


#4.WordPress 파일 소유자 변경:
cd /var/www/html/wordpress
sudo chown -R ftp_user:ftp_user /var/www/html/wordpress
>원복 sudo chown -R ubuntu:ubuntu /var/www/html/wordpress

#5. 
sudo chmod -R 755 /var/www/html/wordpress

#6.
ftp sftp://사용자명@호스트주소


```

# SFTP설정

```
Ubuntu에서 WordPress에서 SFTP를 사용하려면 다음 단계를 따르십시오:

1. **EC2 인스턴스에 연결:** SSH를 사용하여 EC2 인스턴스에 연결합니다.

2. **OpenSSH 설치:** SFTP는 OpenSSH를 사용하므로 필요한 패키지를 설치합니다.
   ```bash
   sudo apt-get update
   sudo apt-get install openssh-server
   ```

3. **sshd_config 파일 수정:** `sshd_config` 파일을 열어 SFTP를 허용하도록 설정합니다.
   ```bash
   sudo nano /etc/ssh/sshd_config
   ```
   다음 라인을 찾아 주석 해제하거나 추가합니다.
   ```bash
   Subsystem sftp /usr/lib/openssh/sftp-server
   ```

4. **sshd 서비스 재시작:** 변경 사항을 적용하려면 SSH 서비스를 재시작합니다.
   ```bash
   sudo service ssh restart
   ```

5. **사용자 및 권한 설정:** SFTP로 접속할 수 있는 사용자를 만들고 비밀번호를 설정합니다.
   ```bash
   sudo adduser sftp_user
   ```

6. **웹 서버 디렉토리 권한 설정:** 웹 서버가 접근해야 하는 디렉토리에 대한 권한을 설정합니다.
   ```bash
   sudo chown -R sftp_user:sftp_user /var/www/html/wordpress
   ```

7. **워드프레스 설정:** 워드프레스 관리 대시보드에서 FTP 정보를 입력할 때, SFTP를 선택하고 해당 EC2 인스턴스의 사용자 이름과 비밀번호를 입력합니다.

주의: "your_username" 및 "/path/to/your/web/directory"를 실제 사용자 이름과 웹 디렉토리 경로로 바꾸십시오.

sudo service ssh restart
sudo service apache2 restart
```