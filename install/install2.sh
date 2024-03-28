rm -f /var/www/html/phpinfo.php

dnf list installed httpd mariadb-server php-mysqlnd

systemctl start mariadb
systemctl enable mariadb
mysql_secure_installation
dnf install php-mbstring php-xml -y
systemctl restart httpd
systemctl restart php-fpm
cd /var/www/html
wget https://www.phpmyadmin.net/downloads/phpMyAdmin-latest-all-languages.tar.gz
mkdir phpMyAdmin && tar -xvzf phpMyAdmin-latest-all-languages.tar.gz -C phpMyAdmin --strip-components 1
rm phpMyAdmin-latest-all-languages.tar.gz
echo "open http://$(curl http://checkip.amazonaws.com)/phpMyAdmin"

echo "then run install3.sh"
