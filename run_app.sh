#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Docker Hub repository
DOCKER_REPO="abdoamsg/ncsecmm"

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

# Function to get local image creation time
get_local_image_time() {
    local image=$1
    local created_time=$(docker images --format "{{.CreatedAt}}" "$image" 2>/dev/null | head -n1)
    
    if [ -z "$created_time" ]; then
        echo "0"
    else
        # Convert to epoch timestamp
        date -d "$created_time" +%s 2>/dev/null || date -j -f "%Y-%m-%d %H:%M:%S %z" "$created_time" +%s 2>/dev/null || echo "0"
    fi
}

# Function to get remote image push time using Docker Hub API
get_remote_image_time() {
    local image=$1
    local tag="${2:-latest}"
    local namespace=$(echo "$image" | cut -d'/' -f1)
    local repo_name=$(echo "$image" | cut -d'/' -f2)
    
    # Docker Hub API v2 endpoint
    local api_url="https://hub.docker.com/v2/repositories/${namespace}/${repo_name}/tags/${tag}"
    
    # Get the last updated time from Docker Hub
    local response=$(curl -s "$api_url")
    local last_updated=$(echo "$response" | grep -o '"last_updated":"[^"]*"' | cut -d'"' -f4)
    
    if [ -z "$last_updated" ] || [ "$last_updated" == "null" ]; then
        echo "0"
    else
        # Convert ISO 8601 to epoch timestamp
        date -d "$last_updated" +%s 2>/dev/null || date -j -f "%Y-%m-%dT%H:%M:%S" "${last_updated%%.*}" +%s 2>/dev/null || echo "0"
    fi
}

# Function to check and pull image if needed
check_and_pull_image() {
    local image=$1
    local tag="${2:-latest}"
    local full_image="${image}:${tag}"
    
    print_status "Checking image: $full_image"
    
    # Check if image exists locally
    if docker image inspect "$full_image" >/dev/null 2>&1; then
        print_status "Local image found. Checking if update is needed..."
        
        local local_time=$(get_local_image_time "$full_image")
        local remote_time=$(get_remote_image_time "$image" "$tag")
        
        if [ "$local_time" -eq "0" ] || [ "$remote_time" -eq "0" ]; then
            print_warning "Could not determine image timestamps. Pulling latest version..."
            docker pull "$full_image"
        elif [ "$remote_time" -gt "$local_time" ]; then
            print_status "Newer image available in repository. Pulling..."
            docker pull "$full_image"
        else
            print_success "Local image is up to date. No pull needed."
        fi
    else
        print_status "Local image not found. Pulling from repository..."
        docker pull "$full_image"
    fi
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
echo "   GCMM Platform - Docker Pull & Run Script"
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

if ! command_exists curl; then
    print_error "curl is not installed. Please install curl first."
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

# Check and pull images if needed
print_status "Checking Docker images..."

# Pull the specific images used in your docker-compose.yml
# Your images use tags instead of separate repositories
check_and_pull_image "${DOCKER_REPO}" "frontend"
check_and_pull_image "${DOCKER_REPO}" "backend"

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