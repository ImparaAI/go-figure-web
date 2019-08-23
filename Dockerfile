FROM alpine:edge as builder

# Install packages
RUN echo 'http://dl-cdn.alpinelinux.org/alpine/edge/testing' >> /etc/apk/repositories && \
  echo @edge http://nl.alpinelinux.org/alpine/edge/main >> /etc/apk/repositories && \
  apk update && \
  apk upgrade && \
  apk --no-cache add \
    npm \
    chromium@edge \
    chromium-chromedriver

# Install app
COPY . /app
WORKDIR /app

RUN npm install -g npm && \
    npm install

RUN ln -s /app/node_modules/@angular/cli/bin/ng /usr/bin && \
    ng build --prod

ENV CHROME_BIN=/usr/bin/chromium-browser \
    CHROME_PATH=/usr/lib/chromium/

EXPOSE 80

CMD ng serve --host 0.0.0.0 --port 80 --disable-host-check --poll 250

# Production build
FROM alpine as final

COPY --from=builder /app/dist /app

# Set up nginx
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
RUN apk --no-cache add nginx

WORKDIR /app
EXPOSE 80

CMD ["/usr/sbin/nginx", "-g", "daemon off;"]