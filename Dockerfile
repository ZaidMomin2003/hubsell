FROM node:20-alpine AS frontend-builder
WORKDIR /app/web
COPY web/package*.json ./
RUN npm install
COPY web/ .
RUN npm run build

FROM golang:1.21-alpine AS backend-builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
COPY --from=frontend-builder /app/web/dist ./public
RUN CGO_ENABLED=0 GOOS=linux go build -o bulkserver ./cmd/bulkserver

FROM alpine:latest
WORKDIR /app
COPY --from=backend-builder /app/bulkserver .
COPY --from=backend-builder /app/public ./public

ENV ADDR=:8080
EXPOSE 8080
CMD ["./bulkserver"]
