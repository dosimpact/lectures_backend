- [wordpress 설치](#wordpress-설치)


# wordpress 설치

- docker 에서 설치하려고 했으나, 좀더 빠른 성능을 위해 EC2에 직접 설치한다.

https://www.youtube.com/watch?v=8Uofkq718n8

```
sudo apt-get update
sudo apt install apache2 -y
sudo apt install php libapache2-mod-php php-mysql -y
sudo apt install mysql-server -y
sudo apt install certbot python3-certbot-apache -y

sudo apt install php-gd -y
sudo apt install php-mbstring -y
---
YouTube video link: https://youtu.be/8Uofkq718n8
All the commands that are executed in the above youtube video are mentioned in this gist. 

1. Install Apache server on Ubuntu
sudo apt install apache2 -y
systemctl status apache2

2. Install php runtime and php mysql connector
sudo apt install php libapache2-mod-php php-mysql -y

3. Install MySQL server
sudo apt install mysql-server -y

4. Login to MySQL server
sudo mysql -u root

5. Change authentication plugin to mysql_native_password (change the password to something strong)
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password by 'Testpassword@123';

6. Create a new database user for wordpress (change the password to something strong)
CREATE USER 'wp_user'@localhost IDENTIFIED BY 'Testpassword@123';


7. Create a database for wordpress
CREATE DATABASE wp;

8. Grant all privilges on the database 'wp' to the newly created user
GRANT ALL PRIVILEGES ON wp.* TO 'wp_user'@localhost;

---
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password by 'Testpassword@123';
CREATE USER 'wp_user'@localhost IDENTIFIED BY 'Testpassword@123';
CREATE DATABASE wp;
GRANT ALL PRIVILEGES ON wp.* TO 'wp_user'@localhost;
---

---
cd /tmp
wget https://wordpress.org/latest.tar.gz
tar -xvf latest.tar.gz
sudo mv wordpress/ /var/www/html
---

9. Download wordpress & Unzip & Move wordpress folder to apache document root

cd /tmp
wget https://wordpress.org/latest.tar.gz
tar -xvf latest.tar.gz
sudo mv wordpress/ /var/www/html


11.1 check wordpress error message, follow up with create wp-config.php
- go http://3.11.111.11/wordpress/wp-admin/install.php?language=en_US
- check message 
- enter wp / wp_user / Testpassword@123 / localhost / wp_

cd /var/www/html/wordpress
sudo nano wp-config.php

11.2 continue install 
- 

12.1 buy domain and setting A Record 

12.2 chnage apache2 config (ServerName)
cd /etc/apache2/sites-available/
sudo nano 000-default.conf 

        ...ß
        # It is also possible to configure the loglevel for particular
        # modules, e.g.
        #LogLevel info ssl:warn
       +ServerName your-domain.site
       +ServerAlias dev.your-domain.site ( 선택 추가 도메인 )
        ...

sudo systemctl restart apache2

13.1 go to dashboard
http://3.11.111.11/wp-login.php


13.3 change setting > general 
- wordpress address : http://soft.your-domain.com
- site address : http://soft.your-domain.com


13.4 chnage apache2 config (DocumentRoot)

cd /etc/apache2/sites-available/
sudo nano 000-default.conf 
chnage to > 
  - DocumentRoot /var/www/html
  + DocumentRoot /var/www/html/wordpress

sudo systemctl restart apache2


14. Request and install ssl on your site with certbot
sudo certbot --apache

- enter Y Y Y 
- both of domain name accpet

success https!
```

