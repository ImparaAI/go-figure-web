#!/bin/sh

touch /var/healthy

if [ $DEVELOPMENT == true ]; then
  ng serve --host 0.0.0.0 --port 80 --disable-host-check --poll 250

  while :
  do
    sleep 1
  done

else
  /usr/sbin/nginx -g "daemon off;"
fi