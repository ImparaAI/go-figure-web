#!/bin/sh

if [ $DEVELOPMENT == true ]; then

  cd /var/www/go-figure
  npm install
  npm rebuild node-sass

  # add ng cli to the path
  ln -s /var/www/go-figure/node_modules/@angular/cli/bin/ng /usr/bin

  # start the app
  ng serve --host 0.0.0.0
fi

touch /var/healthy

supervisord