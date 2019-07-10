FROM alpine:edge

# Install packages
RUN echo 'http://dl-cdn.alpinelinux.org/alpine/edge/testing' >> /etc/apk/repositories && \
  echo @edge http://nl.alpinelinux.org/alpine/edge/main >> /etc/apk/repositories && \
  apk update && \
  apk upgrade && \
  apk --no-cache add \
    bash \
    gawk \
    sed \
    grep \
    bc \
    coreutils \
    vim \
    supervisor \
    curl \
    wget \
    openssh \
    git \
    zip \
    bzip2 \
    libressl-dev \
    npm \
    chromium@edge \
    chromium-chromedriver

# Add configuration files
COPY docker/supervisord.conf /etc/supervisor.d/supervisord.ini
COPY docker/.bashrc /root/.bashrc
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY docker/start.sh /bin/original_start.sh

# Set up bash, cli, fpm conf and pid file, start script
RUN ln -snf /bin/bash /bin/sh && \
    sed -i -e 's/\r$//' /root/.bashrc && \
    tr -d '\r' < /bin/original_start.sh > /bin/start.sh && \
    chmod -R 700 /bin/start.sh && \
    printf "color desert" > /root/.vimrc && \
    addgroup -g 82 -S www-data && \
    adduser -u 82 -D -S -G www-data www-data && \
    rm -fr /var/cache/apk/* && \
    mkdir /root/.ssh && \
    touch /root/.ssh/known_hosts && \
    ssh-keyscan github.com >> /root/.ssh/known_hosts

# Install nginx after www-data has been created
RUN apk --no-cache add nginx && \
    mkdir -p /run/nginx

# Install app
COPY . /var/www/go-figure
WORKDIR /var/www/go-figure

RUN cd /var/www/go-figure && \
    chown -R www-data:www-data /var/www/go-figure && \
    chmod -R 777 /var/www/go-figure && \
    npm install -g npm && \
    npm install

EXPOSE 80 49153

ENV TERM=xterm-color \
    CHROME_BIN=/usr/bin/chromium-browser \
    CHROME_PATH=/usr/lib/chromium/

CMD ["sh", "/bin/start.sh"]