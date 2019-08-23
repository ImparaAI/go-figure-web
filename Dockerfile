FROM alpine:edge as builder

# Install packages
RUN echo 'http://dl-cdn.alpinelinux.org/alpine/edge/testing' >> /etc/apk/repositories && \
  echo @edge http://nl.alpinelinux.org/alpine/edge/main >> /etc/apk/repositories && \
  apk update && \
  apk upgrade && \
  apk --no-cache add \
    bash \
    sed \
    grep \
    coreutils \
    vim \
    openssh \
    npm \
    chromium@edge \
    chromium-chromedriver

# Add configuration files
COPY docker/.bashrc /root/.bashrc
COPY docker/start.sh /bin/original_start.sh

# Set up bash, cli, conf and pid file, start script
RUN ln -snf /bin/bash /bin/sh && \
    sed -i -e 's/\r$//' /root/.bashrc && \
    tr -d '\r' < /bin/original_start.sh > /bin/start.sh && \
    chmod -R 700 /bin/start.sh && \
    printf "color desert" > /root/.vimrc && \
    rm -fr /var/cache/apk/*

# Install app
COPY . /app
WORKDIR /app

RUN cd /app && \
    npm install -g npm && \
    npm install

RUN ln -s /app/node_modules/.bin/ng /usr/bin

RUN ./node_modules/.bin/ng build --prod

EXPOSE 80 49153

ENV TERM=xterm-color \
    DEVELOPMENT=true \
    CHROME_BIN=/usr/bin/chromium-browser \
    CHROME_PATH=/usr/lib/chromium/

CMD ["sh", "/bin/start.sh"]


FROM alpine as final

COPY --from=builder /app/dist /app
COPY --from=builder /bin/start.sh /bin/start.sh

WORKDIR /app

# Set up nginx
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
RUN apk --no-cache add nginx

EXPOSE 80

CMD ["sh", "/bin/start.sh"]