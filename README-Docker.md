# Docker Deployment Guide

This guide explains how to run the Weather App using Docker with runtime environment variables.

## Quick Start

### Option 1: Using Docker Compose (Recommended)

1. **Copy the environment template:**
   ```bash
   cp env.example .env
   ```

2. **Edit the `.env` file** with your API keys:
   ```bash
   # Required: Get your OpenWeatherMap API key from https://openweathermap.org/api
   VITE_WEATHER_API_KEY=your_openweathermap_api_key_here
   
   # Required: Get your OpenAI API key from https://platform.openai.com/api-keys
   VITE_OPENAI_API_KEY=your_openai_api_key_here
   ```

3. **Run with Docker Compose:**
   ```bash
   docker-compose up --build
   ```

4. **Access the app:**
   Open http://localhost:8080 in your browser

### Option 2: Using Docker directly

1. **Build the image:**
   ```bash
   docker build -t weatherapp .
   ```

2. **Run with environment variables:**
   ```bash
   docker run -p 8080:8080 \
     -e VITE_OPENAI_API_KEY="your_openai_api_key" \
     -e VITE_WEATHER_API_KEY="your_weather_api_key" \
     weatherapp
   ```

## Environment Variables

### Required Variables
- `VITE_OPENAI_API_KEY` - Your OpenAI API key
- `VITE_WEATHER_API_KEY` - Your OpenWeatherMap API key

### Optional Variables
- `VITE_OPENAI_API_URL` - OpenAI API endpoint (default: https://api.openai.com/v1/chat/completions)
- `VITE_WEATHER_API_URL` - Weather API endpoint (default: https://api.openweathermap.org/data/2.5/weather)
- `PORT` - Server port (default: 8080)

## Runtime Environment Variable Support

This Docker setup supports **runtime environment variables**, meaning you can:
- Change API keys without rebuilding the image
- Use the same image across different environments (dev, staging, prod)
- Mount different .env files for different deployments

The app automatically detects and uses runtime environment variables when available, falling back to build-time variables if needed.

## Production Deployment

### Using Environment Variables from Secret Manager
```bash
docker run -p 8080:8080 \
  -e VITE_OPENAI_API_KEY="$(cat /path/to/openai-secret)" \
  -e VITE_WEATHER_API_KEY="$(cat /path/to/weather-secret)" \
  weatherapp
```

### Using Docker Secrets (Docker Swarm)
```yaml
version: '3.8'
services:
  weatherapp:
    image: weatherapp:latest
    ports:
      - "8080:8080"
    environment:
      - VITE_OPENAI_API_KEY_FILE=/run/secrets/openai_key
      - VITE_WEATHER_API_KEY_FILE=/run/secrets/weather_key
    secrets:
      - openai_key
      - weather_key

secrets:
  openai_key:
    external: true
  weather_key:
    external: true
```

## Health Check

The container includes a health check endpoint at `/health` that returns:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.456,
  "version": "1.0.0"
}
```

## Resource Requirements

**Minimum:**
- CPU: 0.25 cores
- Memory: 128MB

**Recommended:**
- CPU: 1.0 core
- Memory: 512MB

## Security Features

- ✅ Non-root user (nodejs:nodejs)
- ✅ Multi-stage build (smaller final image)
- ✅ No secrets in image layers
- ✅ Proper signal handling with dumb-init
- ✅ Health checks for monitoring
- ✅ Read-only file system compatible

## Troubleshooting

### Container won't start
Check logs: `docker logs <container-id>`

### API keys not working
Verify environment variables are set: `docker exec <container-id> env | grep VITE`

### Health check failing
Test manually: `curl http://localhost:8080/health`

## Building for Different Architectures

For ARM64 (Apple Silicon, ARM servers):
```bash
docker buildx build --platform linux/arm64 -t weatherapp:arm64 .
```

For multi-platform:
```bash
docker buildx build --platform linux/amd64,linux/arm64 -t weatherapp:latest .
``` 