# https://docs.aws.amazon.com/linux/al2023/ug/ec2-lamp-amazon-linux-2023.html
dnf update -y
dnf install -y git telnet emacs httpd wget php-fpm php-mysqli php-json php php-devel mariadb105 mariadb105-server php-intl ImageMagick ImageMagick-libs composer
systemctl start httpd
systemctl enable httpd
usermod -a -G apache ec2-user
echo "checking groups ..."
groups

chown -R ec2-user:apache /var/www
chmod 2775 /var/www
find /var/www -type d -exec sudo chmod 2775 {} \;
find /var/www -type f -exec sudo chmod 0664 {} \;

echo "<?php phpinfo(); ?>" > /var/www/html/phpinfo.php

echo "httpd and php should be running"
echo "test http://$(curl http://checkip.amazonaws.com)/phpinfo.php"
echo "you should have a security group that allows 80, 443 (and probably 22) 0.0.0.0/0"
echo "then run install2.sh"
