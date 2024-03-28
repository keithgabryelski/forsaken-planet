# https://docs.aws.amazon.com/linux/al2023/ug/SSL-on-amazon-linux-2023.html
echo adding root CERTS

dnf install openssl mod_ssl
openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/pki/tls/private/apache-selfsigned.key -out /etc/pki/tls/certs/apache-selfsigned.crt
systemctl restart httpd

echo "you should get stuff signed by an authority"
echo "go to install4.sh"
