FROM duluca/minimal-nginx-web-server:1-alpine

COPY /dist/streamweb3 /var/www

CMD 'nginx'



