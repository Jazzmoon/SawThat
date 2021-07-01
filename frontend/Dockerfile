# yarn alpine base
FROM node:lts-alpine as yarnbuilder
WORKDIR /app
COPY package.json ./
COPY yarn.lock ./
RUN yarn install --frozen-lockfile

# builder
FROM yarnbuilder as builder
COPY . .
ENV NODE_ENV=production
RUN yarn build

# final
FROM caddy:2.3.0-alpine
RUN apk --no-cache add curl
COPY --from=builder /app/dist /app
CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]
