# golang alpine base
FROM golang:alpine as goalpine
RUN adduser -D -g '' gopher && apk update && apk --no-cache add ca-certificates tzdata git

# builder w/ git injection
FROM goalpine as build
COPY backend/ /project
COPY .git/ /project/.git/
WORKDIR /project
RUN GIT_HASH=$(git rev-parse --short HEAD) && CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -a -mod=vendor -installsuffix cgo -ldflags="-w -s -X main.gitHash=$GIT_HASH" -o /project/entrypoint main.go && rm -rf .git/

# final
FROM alpine
RUN apk --no-cache add curl
COPY --from=build /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/
COPY --from=build /usr/share/zoneinfo /usr/share/zoneinfo
COPY --from=build /etc/passwd /etc/passwd
COPY --from=build /project /project
RUN cp /usr/share/zoneinfo/America/Toronto /etc/localtime
WORKDIR /project
USER gopher
ENTRYPOINT ["/project/entrypoint"]
