FROM duluca/minimal-nginx-web-server:1-alpine

COPY /dist/streamvault /var/www

CMD 'nginx'



