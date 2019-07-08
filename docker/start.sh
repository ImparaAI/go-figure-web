#!/bin/sh

if [ $DEVELOPMENT == true ]; then

  cd /var/www/go-figure

  # add ng cli to the path
  ln -s /var/www/go-figure/node_modules/@angular/cli/bin/ng /usr/bin

  touch /var/healthy

  # start the app
  ng serve --host 0.0.0.0 --port 80 --disable-host-check --poll 250

  while :
  do
    sleep 1
  done

else
  touch /var/healthy

  supervisord
fi