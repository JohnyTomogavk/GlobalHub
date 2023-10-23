FROM node:20.8-alpine as build

WORKDIR /app
COPY package.json package-lock.json ./
RUN ["npm", "ci"]
COPY . .
RUN ["npm", "run", "build-prod"]

FROM nginx:1.25-alpine as final
COPY --from=build ./app/dist ./usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

RUN apk add --no-cache --update nodejs
RUN apk add --no-cache --update npm
RUN npm i -g runtime-env-cra@0.2.0 && npm cache clean --force

WORKDIR /usr/share/nginx/html
COPY .env .

EXPOSE 80
CMD ["/bin/sh", "-c", "runtime-env-cra && nginx -g \"daemon off;\""]
