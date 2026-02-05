# Stage 1: Build the React frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/web
COPY web/package*.json ./
RUN npm install
COPY web/ .
RUN npm run build

# Stage 2: Build the Go backend
FROM golang:1.22-alpine AS backend-builder
WORKDIR /src
# Copy Go dependency files
COPY go.mod go.sum ./
RUN go mod download
# Copy the entire source code explicitly
COPY . .
# Debug: List the cmd folder to the logs so we can see the structure
RUN ls -la cmd/ && ls -la cmd/bulkserver/
# Build the binary using the package path directly
RUN CGO_ENABLED=0 GOOS=linux go build -v -o /src/bulkserver ./cmd/bulkserver

# Stage 3: Final production image
FROM alpine:latest
RUN apk --no-cache add ca-certificates wget
WORKDIR /app
# Copy binary from backend-builder
COPY --from=backend-builder /src/bulkserver .
# Copy static assets from frontend-builder
COPY --from=frontend-builder /app/web/dist ./public

RUN chmod +x ./bulkserver

ENV ADDR=:8080
EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s \
    CMD wget --quiet --tries=1 --spider http://localhost:8080/health || exit 1

CMD ["./bulkserver"]
