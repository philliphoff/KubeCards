# Adapted from: https://www.manifold.co/blog/building-a-production-grade-container-for-your-static-javascript-application-b2b2eff83fbd
FROM node AS build

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn --pure-lockfile

COPY . .

ARG REACT_APP_MSAL_AUTHORITY
ARG REACT_APP_MSAL_CLIENT_ID
ARG REACT_APP_MSAL_IMPERSONATION_SCOPE
ARG REACT_APP_CARDS_INVENTORY_SERVICE_BASE_URI

ENV REACT_APP_MSAL_AUTHORITY=${REACT_APP_MSAL_AUTHORITY}
ENV REACT_APP_MSAL_CLIENT_ID=${REACT_APP_MSAL_CLIENT_ID}
ENV REACT_APP_MSAL_IMPERSONATION_SCOPE=${REACT_APP_MSAL_IMPERSONATION_SCOPE}
ENV REACT_APP_CARDS_INVENTORY_SERVICE_BASE_URI=${REACT_APP_CARDS_INVENTORY_SERVICE_BASE_URI}

RUN yarn build

FROM nginx:stable

COPY --from=build /app/build/ /var/www
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]
