# 🚀 Multi-Server Development Environment v1.2.0

<div align="center">

![Status](https://img.shields.io/badge/status-active-success.svg)
![Version](https://img.shields.io/badge/version-1.2.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

</div>

A containerized development environment for testing and developing applications across multiple server technologies simultaneously. This project provides hot-reloading development servers for HTML/CSS/JS, Python (Flask and FastAPI), and Node.js Express, all running in Docker containers with a unified dashboard for monitoring.

<div align="center">

![Dashboard Preview](https://via.placeholder.com/800x400?text=Development+Environment+Dashboard)

</div>

## 📋 Table of Contents

- [Features](#-features)
- [Architecture](#-architecture)
- [Quick Start](#-quick-start)
- [Service Access Points](#-service-access-points)
- [UI Features](#-ui-features)
- [Development Workflow](#-development-workflow)
- [API Documentation](#-api-documentation)
- [Testing](#-testing)
- [Managing Containers](#-managing-containers)
- [Performance Optimization](#-performance-optimization)
- [Security Considerations](#-security-considerations)
- [Git Configuration](#-git-configuration)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

- **Beautiful UI**: Dark and light theme with modern component library
- **Cross-platform compatibility**: All services run in Docker containers
- **Hot reloading**: All servers automatically reload when code changes
- **Unified dashboard**: Monitor all services in one interface
- **Standardized API endpoints**: Common patterns across all server implementations
- **CORS enabled**: All services configured for cross-origin requests
- **Health checks**: Docker health checks implemented for all services
- **API testing tools**: Built-in interface for testing endpoints
- **Theme switching**: Toggle between dark and light themes with persistent preferences
- **Loading screen**: Smooth page load experience with animated loading indicator
- **Responsive Layout**: Mobile-friendly design with adaptive components
- **Git workflow**: Complete Git configuration with hooks, templates, and CI/CD

## 🏗️ Architecture

The development environment consists of the following components:

<table>
  <thead>
    <tr>
      <th>Service</th>
      <th>Technology</th>
      <th>Port</th>
      <th>Purpose</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Dashboard</td>
      <td>HTML/JS/CSS (Live Server)</td>
      <td>8081</td>
      <td>Monitor all services</td>
    </tr>
    <tr>
      <td>Flask API</td>
      <td>Python Flask</td>
      <td>8082</td>
      <td>Python web framework</td>
    </tr>
    <tr>
      <td>FastAPI</td>
      <td>Python FastAPI</td>
      <td>8083</td>
      <td>Modern Python API framework</td>
    </tr>
    <tr>
      <td>Node.js API</td>
      <td>Express.js</td>
      <td>8084</td>
      <td>JavaScript API server</td>
    </tr>
    <tr>
      <td>Reverse Proxy</td>
      <td>Nginx (optional)</td>
      <td>8080</td>
      <td>Unified routing</td>
    </tr>
  </tbody>
</table>

## 🚀 Quick Start

### Prerequisites

- [Docker](https://www.docker.com/products/docker-desktop) and Docker Compose installed
- Git for version control

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/pkeffect/dev-server.git
   cd dev-environment
   ```

2. Create an environment file:
   ```bash
   cp .env.example .env
   ```

3. Set up Git hooks (optional but recommended):
   ```bash
   chmod +x .githooks/pre-commit
   git config core.hooksPath .githooks
   ```

4. Build and start all services:
   ```bash
   docker-compose up --build
   ```

5. Access the dashboard:
   - Open your browser and navigate to [http://localhost:8081](http://localhost:8081)

## 🔌 Service Access Points

<details>
<summary>Click to expand all service endpoints</summary>

- **Dashboard**: [http://localhost:8081](http://localhost:8081)
- **Live Server API**: [http://localhost:8081/api.html](http://localhost:8081/api.html)
- **Flask API**: [http://localhost:8082](http://localhost:8082)
- **FastAPI**: [http://localhost:8083](http://localhost:8083)
  - OpenAPI Documentation: [http://localhost:8083/docs](http://localhost:8083/docs)
- **Node.js Express**: [http://localhost:8084](http://localhost:8084)
- **Unified Access** (if using Nginx): [http://localhost:8080](http://localhost:8080)
  - Flask API: [http://localhost:8080/flask](http://localhost:8080/flask)
  - FastAPI: [http://localhost:8080/fastapi](http://localhost:8080/fastapi)
  - Node.js: [http://localhost:8080/node](http://localhost:8080/node)

</details>

## 🎨 UI Features

- **Dark & Light Themes**: Toggle between themes with persistent preferences that respect system settings
- **Modern UI Components**: Buttons, cards, alerts, badges, dropdowns, forms and more
- **Loading Screen**: Smooth page load experience with animated loading indicator
- **Responsive Layout**: Mobile-friendly design with adaptive components
- **Interactive Dashboard**: Real-time service status monitoring
- **API Testing Panel**: Built-in interface for testing endpoints across all services
- **GitHub-Inspired Design**: Familiar, clean interface for developers

## 💻 Development Workflow

### Project Structure

```
dev-environment/
├── app_flask.py              # Flask application
├── app_fastapi.py            # FastAPI application
├── app_node.js               # Node.js Express application
├── Dockerfile                # Multi-stage Docker build
├── compose.yml               # Docker Compose configuration
├── requirements.txt          # Python dependencies
├── package.json              # Node.js dependencies
├── .env.example              # Environment variables template
├── .gitignore                # Git ignore patterns
├── .gitattributes            # Git attributes configuration
├── .githooks/                # Git hooks
│   └── pre-commit            # Pre-commit hook
├── .github/                  # GitHub configuration
│   ├── workflows/            # GitHub Actions
│   │   └── ci.yml            # CI workflow
│   ├── ISSUE_TEMPLATE/       # Issue templates
│   └── PULL_REQUEST_TEMPLATE.md # PR template
├── healthcheck.sh            # Health check script
├── nginx/                    # Nginx configuration
│   └── nginx.conf            # Reverse proxy setup
├── src/                      # Front-end source files
│   ├── index.html            # Dashboard HTML
│   ├── css/                  # CSS styles
│   │   ├── main.css          # Main shared styles
│   │   ├── components.css    # UI component styles
│   │   ├── dark-theme.css    # Dark theme styles
│   │   ├── light-theme.css   # Light theme styles
│   │   ├── dashboard.css     # Dashboard-specific styles
│   │   ├── utilities.css     # Utility classes
│   │   └── loading.css       # Loading screen styles
│   ├── js/                   # JavaScript files
│   │   ├── main.js           # Main functionality
│   │   ├── theme.js          # Theme switching logic
│   │   ├── dashboard.js      # Dashboard functionality
│   │   └── loading.js        # Loading screen manager
│   ├── img/                  # Images directory
│   │   └── icons/            # SVG icons
│   └── api.html              # Live Server API endpoint
└── tests/                    # Testing utilities
    ├── api_tests.sh          # Bash test suite
    ├── test_suite.py         # Python test suite
    ├── test_flask.py         # Flask-specific tests
    ├── conftest.py           # pytest configuration
    └── node-tests.js         # Node.js tests
```

### Making Changes

All code is mounted as volumes in the Docker containers, so changes to files will automatically trigger server reloads:

- **HTML/CSS/JS**: Edit files in the `src/` directory
- **Python (Flask/FastAPI)**: Edit `app_flask.py` or `app_fastapi.py`
- **Node.js**: Edit `app_node.js`

### Adding Dependencies

- **Python**: Add to `requirements.txt` and restart the containers
- **Node.js**: Add to `package.json` and restart the containers

### Environment Variables

Configure your development environment by editing the `.env` file:

<details>
<summary>View example environment configuration</summary>

```
# Server Configurations
FLASK_ENV=development
FLASK_DEBUG=1
NODE_ENV=development

# API Keys (for demonstration)
DEMO_API_KEY=your_api_key_here

# Database Configuration (if needed)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=devdb
DB_USER=devuser
DB_PASSWORD=devpassword
```

</details>

## 📝 API Documentation

All services implement the following standard endpoints:

<details>
<summary>View API endpoints</summary>

### Root Endpoint

```
GET /
```

Returns basic service information:

```json
{
  "message": "Hello from [Service]!",
  "service": "[Service Name]",
  "environment": "development",
  "version": "1.0.0"
}
```

### Health Check

```
GET /health
```

Returns service health status:

```json
{
  "status": "healthy",
  "service": "[Service Name]"
}
```

### Echo Endpoint

```
POST /echo
```

Body:
```json
{
  "message": "Hello world",
  "data": { "key": "value" }
}
```

Response:
```json
{
  "echo": {
    "message": "Hello world",
    "data": { "key": "value" }
  },
  "service": "[Service Name]"
}
```

</details>

### FastAPI Documentation

FastAPI automatically generates interactive API documentation:

- **Swagger UI**: [http://localhost:8083/docs](http://localhost:8083/docs)
- **ReDoc**: [http://localhost:8083/redoc](http://localhost:8083/redoc)

## 🧪 Testing

### Dashboard Testing

The dashboard provides an interactive way to test all services:

1. Open [http://localhost:8081](http://localhost:8081)
2. Use the "Test" buttons for individual services
3. Click "Test All Services" for a comprehensive check
4. Use the API Testing panel for custom endpoint tests

<details>
<summary>View command line testing options</summary>

### Command Line Testing

#### Bash Script

```bash
# Run the bash test suite
./tests/api_tests.sh
```

#### Python Script

```bash
# Run the Python test suite
python tests/test_suite.py
```

#### Node.js Tests

```bash
# Run the Node.js tests
npm test
```

#### Flask and FastAPI Tests

```bash
# Run the Flask tests
docker-compose exec flask-dev pytest tests/test_flask.py

# Run the FastAPI tests 
docker-compose exec fastapi-dev pytest
```

</details>

## 🐳 Managing Containers

<details>
<summary>View Docker management commands</summary>

### Starting Services

```bash
# Start all services
docker-compose up

# Start in detached mode
docker-compose up -d

# Start a specific service
docker-compose up flask-dev
```

### Stopping Services

```bash
# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

### Viewing Logs

```bash
# View logs from all services
docker-compose logs

# Follow logs
docker-compose logs -f

# View logs for a specific service
docker-compose logs flask-dev
```

</details>

## 🚄 Performance Optimization

This environment includes several performance optimizations:

### FastAPI Resource Management

The FastAPI service includes CPU and memory limits to prevent resource contention:

```yaml
deploy:
  resources:
    limits:
      cpus: '0.5'
      memory: 256M
    reservations:
      cpus: '0.25'
      memory: 128M
```

### Optimized Asset Loading

The dashboard implements:
- Progressive loading of resources
- Efficient theme switching without page reloads
- Preloading of critical JavaScript
- Optimized SVG icons

### Development vs. Production Settings

For development, use the included hot-reload settings. For production, consider:

1. Disabling hot-reload flags (`--reload`)
2. Adjusting worker counts based on available CPU cores
3. Setting appropriate logging levels

## 🔒 Security Considerations

### Container Security

The Dockerfile includes options for running containers as non-root users:

```dockerfile
# --- Create non-root user and group ---
RUN addgroup -S dev-group && adduser -S dev-user -G dev-group

# --- Change ownership of the application directory ---
RUN chown -R dev-user:dev-group /app

# --- Switch to the non-root user ---
USER dev-user
```

Uncomment these sections for improved container security in production.

### Environment Variables

Ensure sensitive information is stored in `.env` files and never committed to version control. The `.gitignore` file excludes `.env` files by default:

```
# Environment variables
.env
.env.*
!.env.example
```

## 🔄 Git Configuration

This project includes a complete Git workflow setup:

- **`.gitignore`**: Comprehensive ignore patterns for development files
- **`.gitattributes`**: Line ending normalization and file handling
- **GitHub Workflows**: Automated CI/CD with GitHub Actions
- **Issue & PR Templates**: Standardized formats for contributions
- **Git Hooks**: Pre-commit validation for code quality

<details>
<summary>View Git setup instructions</summary>

### Setting Up Git Hooks

```bash
# Make git hooks executable
chmod +x .githooks/pre-commit

# Set hooks path
git config core.hooksPath .githooks
```

### Branch Strategy

Follow the GitHub Flow branching strategy:

1. Create a feature branch from main
2. Make changes and commit
3. Push branch and create a Pull Request
4. After review, merge to main

For detailed instructions, see [GIT_SETUP.md](GIT_SETUP.md).

</details>

## 🔧 Troubleshooting

<details>
<summary>View common issues and solutions</summary>

### Common Issues

#### Service Not Starting

Check the Docker logs:
```bash
docker-compose logs [service-name]
```

#### Hot Reloading Not Working

Ensure the correct volume mounts are in place and file permissions are correct:
```bash
docker-compose down
docker-compose up --build
```

#### Cannot Access Service

Verify the port mappings in `compose.yml` and check if the container is running:
```bash
docker-compose ps
```

#### Theme Switching Not Working

Check browser console for errors in theme.js. Local storage might be disabled or full.

#### Live Server Test Failing

Ensure the `src/api.html` file exists for the Live Server API endpoint. If the test still fails, check the browser console for CORS errors.

#### CI Pipeline Failing

Check the GitHub Actions logs for detailed error information. Common issues include:

- Missing test files or incorrect paths
- Import errors in Python tests
- Timing issues with service startup

### Health Checks

Each service has built-in health checks that Docker uses to monitor container status:

```bash
# View container health
docker ps
```

</details>

## 👥 Contributing

We welcome contributions to this project! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please read our [Code of Conduct](CODE_OF_CONDUCT.md) and [Security Policy](SECURITY.md) before contributing.

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <sub>Built with ❤️ for developers</sub>
</div>
