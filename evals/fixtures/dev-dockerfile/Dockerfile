FROM golang:1.23 AS build
WORKDIR /src
COPY . .
RUN CGO_ENABLED=0 go build -o /status .
FROM gcr.io/distroless/static
COPY --from=build /status /status
USER 65532
ENTRYPOINT ["/status"]
