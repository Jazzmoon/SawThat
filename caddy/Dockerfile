FROM caddy:2.6.2-builder AS builder

RUN xcaddy build v2.6.2 --with github.com/caddy-dns/cloudflare@latest

FROM caddy:2.6.2-alpine

COPY --from=builder /usr/bin/caddy /usr/bin/caddy