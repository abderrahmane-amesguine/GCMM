#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} ✓ $1"
}

print_error() {
    echo -e "${RED}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} ✗ $1"
}

print_warning() {
    echo -e "${YELLOW}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} ⚠ $1"
}

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to wait for a service to be ready
wait_for_service() {
    local url=$1
    local max_attempts=30
    local attempt=1
    
    print_status "Waiting for service at $url to be ready..."
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s -o /dev/null -w "%{http_code}" "$url" | grep -q "200\|301\|302"; then
            print_success "Service is ready!"
            return 0
        fi
        
        echo -n "."
        sleep 2
        ((attempt++))
    done
    
    echo ""
    print_error "Service failed to start after $max_attempts attempts"
    return 1
}

# Function to open URL in browser
open_browser() {
    local url=$1
    
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        open "$url"
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        if command_exists xdg-open; then
            xdg-open "$url"
        elif command_exists gnome-open; then
            gnome-open "$url"
        elif command_exists firefox; then
            firefox "$url"
        elif command_exists google-chrome; then
            google-chrome "$url"
        else
            print_warning "Could not detect web browser. Please open $url manually."
        fi
    elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" || "$OSTYPE" == "win32" ]]; then
        # Windows
        start "$url"
    else
        print_warning "Unknown OS type. Please open $url manually."
    fi
}

# Main script
echo "============================================="
echo "   GCMM Platform - Docker Build & Run Script"
echo "============================================="
echo ""

# Check for required dependencies
print_status "Checking dependencies..."

if ! command_exists docker; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command_exists docker-compose && ! docker compose version >/dev/null 2>&1; then
    print_error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

print_success "All dependencies are installed"

# Check if Docker daemon is running
if ! docker info >/dev/null 2>&1; then
    print_warning "Docker daemon is not running. Attempting to start Docker..."
    
    # Platform-specific Docker startup
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        if [ -d "/Applications/Docker.app" ]; then
            print_status "Starting Docker Desktop for macOS..."
            open -a Docker
            started_docker=true
        else
            print_error "Docker Desktop not found. Please install Docker Desktop for Mac."
            exit 1
        fi
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux - try to start docker service
        if command_exists systemctl; then
            print_status "Starting Docker service..."
            sudo systemctl start docker
            started_docker=true
        elif command_exists service; then
            print_status "Starting Docker service..."
            sudo service docker start
            started_docker=true
        else
            print_error "Cannot start Docker service. Please start Docker manually."
            exit 1
        fi
    elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
        # Windows (Git Bash/MinGW)
        docker_desktop_path=""
        
        # Check common Docker Desktop locations
        if [ -f "/c/Program Files/Docker/Docker/Docker Desktop.exe" ]; then
            docker_desktop_path="/c/Program Files/Docker/Docker/Docker Desktop.exe"
        elif [ -f "/c/Program Files (x86)/Docker/Docker/Docker Desktop.exe" ]; then
            docker_desktop_path="/c/Program Files (x86)/Docker/Docker/Docker Desktop.exe"
        fi
        
        if [ -n "$docker_desktop_path" ]; then
            print_status "Starting Docker Desktop for Windows..."
            "$docker_desktop_path" &
            started_docker=true
        else
            print_error "Docker Desktop not found. Please install Docker Desktop for Windows."
            exit 1
        fi
    fi
    
    # If we started Docker, wait for it to be ready
    if [ "$started_docker" = true ]; then
        print_status "Waiting for Docker to start (this may take a minute)..."
        max_attempts=60
        attempt=0
        
        while [ $attempt -lt $max_attempts ]; do
            if docker info >/dev/null 2>&1; then
                print_success "Docker is now running!"
                break
            fi
            
            echo -n "."
            sleep 2
            ((attempt++))
            
            if [ $attempt -eq $max_attempts ]; then
                echo ""
                print_error "Docker failed to start after 2 minutes. Please start Docker manually and run this script again."
                exit 1
            fi
        done
        echo ""
    else
        print_error "Docker daemon is not running. Please start Docker first."
        exit 1
    fi
fi

# Navigate to script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Check if docker-compose.yml exists
if [ ! -f "docker-compose.yml" ]; then
    print_error "docker-compose.yml not found in current directory"
    exit 1
fi

# Stop any existing containers
print_status "Stopping any existing containers..."
docker-compose down >/dev/null 2>&1 || docker compose down >/dev/null 2>&1

# Build the images
print_status "Building Docker images..."
print_status "This may take a few minutes on first run..."

if docker-compose build --no-cache; then
    print_success "Docker images built successfully"
else
    if docker compose build --no-cache; then
        print_success "Docker images built successfully"
    else
        print_error "Failed to build Docker images"
        exit 1
    fi
fi

# Start the containers
print_status "Starting containers..."

if docker-compose up -d; then
    print_success "Containers started successfully"
else
    if docker compose up -d; then
        print_success "Containers started successfully"
    else
        print_error "Failed to start containers"
        exit 1
    fi
fi

# Wait for services to be ready
FRONTEND_URL="http://localhost:5173"
BACKEND_URL="http://localhost:8000"

print_status "Waiting for services to start..."
sleep 5

# Check backend
if wait_for_service "$BACKEND_URL/docs"; then
    print_success "Backend API is running at $BACKEND_URL"
else
    print_error "Backend API failed to start"
    print_status "Checking logs..."
    docker-compose logs backend || docker compose logs backend
    exit 1
fi

# Check frontend
if wait_for_service "$FRONTEND_URL"; then
    print_success "Frontend is running at $FRONTEND_URL"
else
    print_error "Frontend failed to start"
    print_status "Checking logs..."
    docker-compose logs frontend || docker compose logs frontend
    exit 1
fi

# Open browser
print_status "Opening browser..."
open_browser "$FRONTEND_URL"

echo ""
echo "============================================="
echo "   GCMM Platform is now running!"
echo "============================================="
echo ""
echo "Frontend: $FRONTEND_URL"
echo "Backend API: $BACKEND_URL"
echo "API Documentation: $BACKEND_URL/docs"
echo ""
echo "To view logs:"
echo "  docker-compose logs -f"
echo ""
echo "To stop the application:"
echo "  docker-compose down"
echo ""
echo "Press Ctrl+C to stop watching logs (containers will keep running)"
echo ""

# Follow logs
print_status "Following container logs..."
docker-compose logs -f || docker compose logs -f