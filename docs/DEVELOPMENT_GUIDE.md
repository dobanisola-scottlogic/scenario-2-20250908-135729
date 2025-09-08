# Development Guide

This guide provides comprehensive information for developers working on the Hackathon Game Platform, including setup instructions, development workflows, testing strategies, and contribution guidelines.

## Table of Contents

1. [Development Environment Setup](#development-environment-setup)
2. [Project Structure](#project-structure)
3. [Development Workflow](#development-workflow)
4. [Testing Strategy](#testing-strategy)
5. [Code Quality Standards](#code-quality-standards)
6. [Debugging and Troubleshooting](#debugging-and-troubleshooting)
7. [Contributing Guidelines](#contributing-guidelines)
8. [Release Process](#release-process)

## Development Environment Setup

### Prerequisites

#### Required Software
- **Java 21 JDK** - OpenJDK or Oracle JDK
- **Node.js 18+** and **npm** - For frontend development
- **Git** - Version control
- **Docker** - For containerized development (optional)
- **PostgreSQL 14+** - For production-like database (optional, H2 used by default)

#### IDE Recommendations
- **IntelliJ IDEA** - Excellent Java support with Gradle integration
- **VS Code** - Good for frontend development and general editing
- **Eclipse** - Alternative Java IDE

### Initial Setup

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd hackathon-game-platform
   ```

2. **Verify Java Installation**
   ```bash
   java -version
   # Should show Java 21
   ```

3. **Install Node.js Dependencies**
   ```bash
   cd ui
   npm install
   cd ..
   ```

4. **Build the Project**
   ```bash
   ./gradlew build
   ```

5. **Run Tests**
   ```bash
   ./gradlew check
   ```

### IDE Configuration

#### IntelliJ IDEA Setup
1. **Import Project**: Open the root directory as a Gradle project
2. **Configure JDK**: Set Project SDK to Java 21
3. **Enable Lombok**: Install Lombok plugin and enable annotation processing
4. **Code Style**: Import code style settings from `.editorconfig`

#### VS Code Setup
1. **Install Extensions**:
   - Extension Pack for Java
   - Gradle for Java
   - TypeScript and JavaScript Language Features
   - Prettier - Code formatter
   - ESLint

2. **Configure Settings**:
   ```json
   {
     "java.configuration.updateBuildConfiguration": "automatic",
     "java.format.settings.url": ".editorconfig",
     "typescript.preferences.importModuleSpecifier": "relative"
   }
   ```

### Database Setup (Optional)

#### Using H2 (Default)
No setup required - H2 runs in-memory by default.

#### Using PostgreSQL
1. **Install PostgreSQL**
   ```bash
   # Ubuntu/Debian
   sudo apt-get install postgresql postgresql-contrib
   
   # macOS
   brew install postgresql
   ```

2. **Create Database**
   ```sql
   createdb hackathon
   createuser hackathon_user
   ```

3. **Configure Server**
   Edit `server/server.yml`:
   ```yaml
   database:
     driverClass: org.postgresql.Driver
     url: jdbc:postgresql://localhost:5432/hackathon
     user: hackathon_user
     password: your_password
   ```

## Project Structure

### Multi-Module Gradle Project

```
hackathon-game-platform/
├── build.gradle                 # Root build configuration
├── settings.gradle              # Project modules configuration
├── gradle/                      # Gradle wrapper files
├── docs/                        # Documentation (this directory)
├── default-bots/               # Built-in bot strategies
├── deployment/                 # Deployment scripts and configurations
├── game/                       # Core game API and interfaces
├── game-engine/               # Game logic implementation
├── java-contestant/           # Java bot template
├── python-contestant/         # Python bot template
├── remote/                    # Remote bot execution client
├── server/                    # Main server application
├── ui/                        # React frontend application
└── viewer/                    # Legacy viewer (being replaced)
```

### Key Configuration Files

- **`build.gradle`**: Root build configuration with shared dependencies
- **`lombok.config`**: Lombok configuration for all modules
- **`package.json`**: Root npm configuration for frontend tooling
- **`.editorconfig`**: Code style configuration
- **`azure-pipelines.yml`**: CI/CD pipeline configuration

## Development Workflow

### Starting Development

1. **Start the Backend Server**
   ```bash
   ./gradlew :server:run
   ```
   Server will be available at http://localhost:8080

2. **Start the Frontend Development Server**
   ```bash
   cd ui
   npm run dev
   ```
   Frontend will be available at http://localhost:5173

3. **Access the Application**
   - **Admin Interface**: http://localhost:8080/application
   - **Development UI**: http://localhost:5173
   - **API Endpoints**: http://localhost:8080/api/*

### Development Commands

#### Backend Development
```bash
# Build all modules
./gradlew build

# Run specific module
./gradlew :server:run
./gradlew :game-engine:test

# Clean build
./gradlew clean build

# Run with specific database
./gradlew :server:run -Pdatabase=hackathon.db

# Generate code coverage report
./gradlew jacocoTestReport
```

#### Frontend Development
```bash
cd ui

# Start development server
npm run dev

# Run tests
npm test

# Run tests with coverage
npm run coverage

# Build for production
npm run build

# Lint and format code
npm run format

# Type checking
npm run lint-tsc
```

### Hot Reloading

#### Backend Hot Reloading
- Use your IDE's hot swap capabilities
- Or restart the server with `./gradlew :server:run`

#### Frontend Hot Reloading
- Vite provides instant hot module replacement
- Changes are reflected immediately in the browser

### Working with Multiple Modules

#### Adding Dependencies
```gradle
// In module's build.gradle
dependencies {
    implementation project(':game')
    implementation project(':game-engine')
    implementation 'external.library:name:version'
}
```

#### Inter-module Communication
- Use shared interfaces from the `game` module
- Avoid direct dependencies between implementation modules
- Use dependency injection for loose coupling

## Testing Strategy

### Test Types and Tools

#### Backend Testing
- **Unit Tests**: JUnit 5 for individual class testing
- **Integration Tests**: Dropwizard testing framework
- **Test Coverage**: JaCoCo for coverage reporting

#### Frontend Testing
- **Unit Tests**: Vitest for component testing
- **Integration Tests**: React Testing Library
- **E2E Tests**: Playwright for browser automation

### Running Tests

#### All Tests
```bash
./gradlew check
```

#### Specific Module Tests
```bash
./gradlew :server:test
./gradlew :game-engine:test
./gradlew :ui:test
```

#### Frontend Tests
```bash
cd ui
npm test                    # Run all tests
npm run coverage           # Run with coverage
npm run test:e2e          # Run E2E tests
```

### Writing Tests

#### Backend Unit Test Example
```java
@ExtendWith(MockitoExtension.class)
class GameServiceTest {
    
    @Mock
    private GameDAO gameDAO;
    
    @InjectMocks
    private GameService gameService;
    
    @Test
    void shouldCreateGame() {
        // Given
        GameConfiguration config = new GameConfiguration("Test Game");
        
        // When
        Game result = gameService.createGame(config);
        
        // Then
        assertThat(result.getName()).isEqualTo("Test Game");
        verify(gameDAO).save(any(Game.class));
    }
}
```

#### Frontend Component Test Example
```typescript
import { render, screen } from '@testing-library/react';
import { GameBoard } from './GameBoard';

describe('GameBoard', () => {
  it('renders game board with correct dimensions', () => {
    const gameState = {
      map: { width: 10, height: 10 },
      teams: [],
      collectables: []
    };
    
    render(<GameBoard gameState={gameState} />);
    
    expect(screen.getByTestId('game-board')).toBeInTheDocument();
  });
});
```

### Test Coverage Requirements

- **Minimum Coverage**: 80% line coverage for new code
- **Critical Paths**: 100% coverage for game logic
- **Integration Tests**: Cover all API endpoints
- **E2E Tests**: Cover main user workflows

## Code Quality Standards

### Code Formatting

#### Automated Formatting
```bash
# Format all code
./gradlew spotlessApply

# Check formatting
./gradlew spotlessCheck

# Format frontend code
cd ui && npm run prettier:write
```

#### Pre-commit Hooks
Husky automatically runs formatting and linting on commit:
```bash
# Install hooks
npm run prepare

# Hooks will run automatically on git commit
```

### Code Style Guidelines

#### Java Code Style
- **Indentation**: 2 spaces
- **Line Length**: 100 characters
- **Imports**: Organized automatically by Spotless
- **Naming**: CamelCase for classes, camelCase for methods/variables

#### TypeScript/JavaScript Code Style
- **Indentation**: 2 spaces
- **Quotes**: Single quotes preferred
- **Semicolons**: Required
- **Trailing Commas**: Required for multi-line

### Static Analysis

#### Java Analysis
- **Spotless**: Code formatting and import organization
- **FindBugs**: Static analysis for common issues
- **Checkstyle**: Code style enforcement

#### TypeScript Analysis
- **ESLint**: Linting and code quality
- **TypeScript Compiler**: Type checking
- **Prettier**: Code formatting

### Code Review Guidelines

#### Before Submitting PR
1. Run all tests: `./gradlew check`
2. Format code: `./gradlew spotlessApply`
3. Update documentation if needed
4. Add tests for new functionality

#### Review Checklist
- [ ] Code follows style guidelines
- [ ] Tests are included and passing
- [ ] Documentation is updated
- [ ] No security vulnerabilities
- [ ] Performance considerations addressed

## Debugging and Troubleshooting

### Backend Debugging

#### IntelliJ IDEA Debugging
1. Set breakpoints in your code
2. Run server in debug mode
3. Use "Debug" configuration instead of "Run"

#### Command Line Debugging
```bash
./gradlew :server:run --debug-jvm
```

#### Logging Configuration
Edit `server/server.yml`:
```yaml
logging:
  level: DEBUG
  loggers:
    com.scottlogic.hackathon: DEBUG
    org.hibernate.SQL: DEBUG
```

### Frontend Debugging

#### Browser DevTools
- Use React Developer Tools extension
- Redux DevTools for state inspection
- Network tab for API calls

#### VS Code Debugging
1. Install "Debugger for Chrome" extension
2. Use provided launch configuration
3. Set breakpoints in TypeScript code

### Common Issues

#### Build Issues
```bash
# Clean and rebuild
./gradlew clean build

# Clear npm cache
cd ui && npm ci

# Check Java version
java -version
```

#### Database Issues
```bash
# Reset H2 database
rm -f *.db

# Check PostgreSQL connection
psql -h localhost -U hackathon_user -d hackathon
```

#### Port Conflicts
```bash
# Check what's using port 8080
lsof -i :8080

# Kill process using port
kill -9 <PID>
```

## Contributing Guidelines

### General Guidelines
- Use the internal Slack channel `hackathon-ai-game` for discussions
- Raise bugs and feature requests via GitHub issues
- All changes must be made via pull requests
- Follow the established code style and conventions

### Pull Request Process

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**
   - Write code following style guidelines
   - Add tests for new functionality
   - Update documentation as needed

3. **Test Changes**
   ```bash
   ./gradlew check
   cd ui && npm test
   ```

4. **Commit Changes**
   ```bash
   git add .
   git commit -m "feat: add new feature description"
   ```

5. **Push and Create PR**
   ```bash
   git push origin feature/your-feature-name
   # Create PR via GitHub interface
   ```

### Commit Message Format
Follow conventional commits:
- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `test:` - Test additions/changes
- `chore:` - Build/tooling changes

### PR Requirements
- [ ] Includes tests for new functionality
- [ ] Documentation updated if applicable
- [ ] All tests passing
- [ ] Code review approved by at least one other developer
- [ ] No merge conflicts

## Release Process

### Version Management
- Use semantic versioning (MAJOR.MINOR.PATCH)
- Update version in `build.gradle` and `package.json`
- Tag releases in Git

### Release Steps

1. **Prepare Release**
   ```bash
   # Update version numbers
   # Update CHANGELOG.md
   # Run full test suite
   ./gradlew check
   ```

2. **Create Release Branch**
   ```bash
   git checkout -b release/v1.2.0
   ```

3. **Build and Test**
   ```bash
   ./gradlew build
   ./gradlew :server:dockerBuild
   ```

4. **Tag and Push**
   ```bash
   git tag v1.2.0
   git push origin v1.2.0
   ```

5. **Deploy**
   - Deploy to staging environment
   - Run integration tests
   - Deploy to production

### Hotfix Process

1. **Create Hotfix Branch**
   ```bash
   git checkout -b hotfix/critical-fix main
   ```

2. **Fix and Test**
   ```bash
   # Make minimal changes
   ./gradlew check
   ```

3. **Release Hotfix**
   ```bash
   git tag v1.2.1
   git push origin v1.2.1
   ```

## Performance Considerations

### Backend Performance
- Use connection pooling for database
- Implement caching where appropriate
- Monitor memory usage and GC
- Profile critical paths

### Frontend Performance
- Use React.memo for expensive components
- Implement virtual scrolling for large lists
- Optimize bundle size with code splitting
- Monitor render performance

### Database Performance
- Add appropriate indexes
- Optimize queries
- Monitor slow query log
- Use connection pooling

## Security Considerations

### Code Security
- Validate all inputs
- Use parameterized queries
- Implement proper authentication
- Follow OWASP guidelines

### Dependency Security
- Regularly update dependencies
- Use security scanning tools
- Monitor for vulnerabilities
- Review third-party libraries

This development guide should be updated as the project evolves and new development practices are adopted.