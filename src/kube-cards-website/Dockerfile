# Adapted from: https://www.manifold.co/blog/building-a-production-grade-container-for-your-static-javascript-application-b2b2eff83fbd
FROM node AS build

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn --pure-lockfile

COPY . .

RUN yarn build

FROM nginx:stable

COPY --from=build /app/build/ /var/www
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

WORKDIR /var/www
COPY ./scripts/env.sh .
COPY .env .

RUN chmod +x env.sh

CMD ["/bin/bash", "-c", "/var/www/env.sh && nginx -g \"daemon off;\""]
