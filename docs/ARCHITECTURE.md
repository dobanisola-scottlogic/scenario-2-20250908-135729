# System Architecture

## Overview

The Hackathon Game Platform is a distributed system designed to host programming competitions where teams develop AI bots to compete in a turn-based strategy game. The platform provides a complete environment for running hackathon events with real-time game visualization, team management, and automated bot execution.

## High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Web Browser   │    │   Web Browser   │    │   Web Browser   │
│   (Admin UI)    │    │  (Game Viewer)  │    │ (Contestant IDE)│
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          │ HTTP/WebSocket       │ HTTP/WebSocket       │ HTTP
          │                      │                      │
┌─────────▼──────────────────────▼──────────────────────▼───────┐
│                    Game Server                                │
│                 (Dropwizard + Java)                          │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────────┐ │
│  │   REST API  │ │  WebSocket  │ │    Game Engine          │ │
│  │             │ │   Handler   │ │                         │ │
│  └─────────────┘ └─────────────┘ └─────────────────────────┘ │
└─────────┬─────────────────────────────────────┬─────────────┘
          │                                     │
          │ Database                            │ HTTP
          │ Connection                          │
          │                                     │
┌─────────▼───────┐                   ┌─────────▼───────┐
│   PostgreSQL    │                   │  Remote Client  │
│    Database     │                   │   (Bot Runner)  │
└─────────────────┘                   └─────────┬───────┘
                                                │
                                                │ Process
                                                │ Execution
                                                │
                                      ┌─────────▼───────┐
                                      │ Contestant Bots │
                                      │ (Java/Python)   │
                                      └─────────────────┘
```

## Core Components

### 1. Game Server (`/server`)
**Technology**: Java 21, Dropwizard Framework, Guice DI
**Purpose**: Central orchestration hub for the entire platform

**Key Responsibilities**:
- REST API endpoints for game management and team administration
- WebSocket connections for real-time game state broadcasting
- Game orchestration and turn management
- User authentication and authorization
- Database persistence layer
- Integration with remote bot execution clients

**Key Classes**:
- `HackathonApplication`: Main application entry point
- Game management controllers and resources
- WebSocket handlers for real-time communication
- Database entities and DAOs

### 2. Game Engine (`/game-engine`)
**Technology**: Java 21
**Purpose**: Core game logic implementation

**Key Responsibilities**:
- Turn-based game state management
- Game rule enforcement and validation
- Bot move processing and collision detection
- Map generation and management
- Game outcome determination

**Features**:
- Donut-shaped (toroidal) grid-based maps
- Player spawning and movement mechanics
- Collectible food system
- Combat resolution (outnumbering mechanics)
- Spawn point destruction mechanics

### 3. Game API (`/game`)
**Technology**: Java 21
**Purpose**: Shared interfaces and data models

**Key Responsibilities**:
- Common interfaces for game components
- Data transfer objects (DTOs)
- Game state representations
- Move and action definitions
- Shared constants and enums

### 4. Frontend Applications

#### Modern UI (`/ui`)
**Technology**: React 18, TypeScript, Vite, Material-UI, Redux Toolkit
**Purpose**: Modern web interface for game administration and viewing

**Key Features**:
- Game administration dashboard
- Real-time game visualization using Phaser.js
- Team management interface
- Game statistics and analytics
- Responsive design with Material-UI components

**Architecture**:
- Redux store for state management
- React Router for navigation
- WebSocket integration for real-time updates
- Component-based architecture

#### Legacy Viewer (`/viewer`)
**Technology**: Legacy web application (being replaced)
**Purpose**: Original game visualization interface

### 5. Remote Execution System (`/remote`)
**Technology**: Java 21
**Purpose**: Distributed bot execution client

**Key Responsibilities**:
- Secure bot code execution in isolated environments
- Communication with game server via HTTP
- Support for multiple programming languages
- Resource management and timeout handling
- Error handling and bot disqualification

### 6. Contestant Templates

#### Java Contestant (`/java-contestant`)
**Technology**: Java 21, Gradle
**Purpose**: Template and development environment for Java bots

**Features**:
- Pre-configured development environment
- Example bot implementations
- Build and testing infrastructure
- Integration with remote execution system

#### Python Contestant (`/python-contestant`)
**Technology**: Python 3.x
**Purpose**: Template and development environment for Python bots

**Features**:
- Python bot template and examples
- Dependency management
- Integration with remote execution system
- Development and testing tools

### 7. Default Bots (`/default-bots`)
**Technology**: Java 21
**Purpose**: Built-in bot strategies for testing and demonstration

**Features**:
- Multiple difficulty levels
- Various strategic approaches
- Used for testing and as opponents during development

### 8. Deployment Infrastructure (`/deployment`)
**Technology**: Terraform, Docker, AWS
**Purpose**: Cloud deployment automation

**Key Components**:
- Terraform configurations for AWS infrastructure
- Docker containerization
- CI/CD pipeline configurations
- Environment-specific configurations

## Data Flow

### Game Execution Flow
1. **Game Initialization**: Admin creates a new game through the UI
2. **Team Registration**: Teams are registered and assigned to the game
3. **Bot Deployment**: Contestant code is deployed to remote execution clients
4. **Game Loop**:
   - Game server requests moves from all active bots via remote clients
   - Remote clients execute bot code and return moves
   - Game engine processes moves and updates game state
   - New game state is broadcast to all connected clients via WebSocket
   - Process repeats until game completion
5. **Game Completion**: Final results are calculated and stored

### Real-time Communication
- **WebSocket Connections**: Established between browsers and game server
- **Game State Broadcasting**: Real-time updates sent to all connected viewers
- **Event Streaming**: Game events, player actions, and state changes

### Data Persistence
- **PostgreSQL Database**: Stores games, teams, players, and historical data
- **Hibernate ORM**: Object-relational mapping for database operations
- **Migration Support**: Database schema versioning and updates

## Security Considerations

### Bot Execution Security
- **Isolated Execution**: Bots run in separate processes/containers
- **Resource Limits**: CPU and memory constraints on bot execution
- **Timeout Management**: Strict time limits for bot decision-making
- **Code Sandboxing**: Restricted access to system resources

### Authentication & Authorization
- **Admin Authentication**: Secure access to administrative functions
- **Team Authentication**: Secure access to team-specific resources
- **API Security**: Protected endpoints with appropriate access controls

### Network Security
- **HTTPS/WSS**: Encrypted communication channels
- **CORS Configuration**: Controlled cross-origin resource sharing
- **Input Validation**: Comprehensive validation of all user inputs

## Scalability & Performance

### Horizontal Scaling
- **Stateless Design**: Game server designed for horizontal scaling
- **Load Balancing**: Support for multiple server instances
- **Database Connection Pooling**: Efficient database resource utilization

### Performance Optimizations
- **Efficient Game State Management**: Optimized data structures
- **Caching Strategies**: Strategic caching of frequently accessed data
- **Asynchronous Processing**: Non-blocking operations where possible

### Monitoring & Observability
- **Logging**: Comprehensive logging throughout the system
- **Metrics Collection**: Performance and usage metrics
- **Health Checks**: System health monitoring endpoints

## Technology Stack Summary

| Component | Primary Technologies |
|-----------|---------------------|
| Backend | Java 21, Dropwizard, Guice, Hibernate |
| Frontend | React 18, TypeScript, Vite, Material-UI, Redux |
| Database | PostgreSQL, H2 (development) |
| Build Tools | Gradle, npm, Vite |
| Testing | JUnit 5, Vitest, Playwright |
| Deployment | Docker, Terraform, AWS |
| Game Graphics | Phaser.js |
| Communication | WebSocket, REST API |

## Development Environment

### Prerequisites
- Java 21 JDK
- Node.js and npm
- PostgreSQL (for production-like setup)
- Docker (for containerized deployment)

### Build System
- **Gradle**: Multi-project build with shared configurations
- **npm**: Frontend dependency management and build scripts
- **Spotless**: Code formatting and style enforcement
- **Husky**: Git hooks for code quality

### Testing Strategy
- **Unit Tests**: Comprehensive unit test coverage
- **Integration Tests**: End-to-end testing of system components
- **Frontend Tests**: Component and integration testing with Vitest
- **E2E Tests**: Browser automation testing with Playwright