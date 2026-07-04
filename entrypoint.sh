#!/bin/sh

envsubst < /config/config-template.jsx \
         > /usr/share/nginx/html/config/config.jsx

exec nginx -g 'daemon off;'