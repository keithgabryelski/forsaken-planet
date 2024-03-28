#https://www.mediawiki.org/wiki/Manual:Installing_MediaWiki

echo from https://www.mediawiki.org/wiki/Download
echo downloading that file
mkdir -p ~/forsaken-eternity/tmp
cd ~/forsaken-eternity/tmp
curl -O https://releases.wikimedia.org/mediawiki/1.41/mediawiki-1.41.0.tar.gz
cd ..
cd /var/www/html
tar -zxvof ~/forsaken-eternity/tmp/mediawiki-*.tar.gz
