#!/bin/sh
set -e
envsubst < /usr/share/nginx/html/config/config-template.jsx \
         > /usr/share/nginx/html/config/config.jsx

exec nginx -g 'daemon off;'
