# API Documentation

This document provides comprehensive documentation for the Hackathon Game Platform APIs, including REST endpoints, WebSocket connections, and game interfaces.

## Table of Contents

1. [REST API Endpoints](#rest-api-endpoints)
2. [WebSocket API](#websocket-api)
3. [Game Bot Interface](#game-bot-interface)
4. [Data Models](#data-models)
5. [Authentication](#authentication)
6. [Error Handling](#error-handling)

## REST API Endpoints

### Base URL
- **Development**: `http://localhost:8080`
- **Production**: `https://your-domain.com`

### Authentication
Most endpoints require authentication. See [Authentication](#authentication) section for details.

### Game Management

#### GET /game
Get list of games or specific game information.

**Query Parameters:**
- `id` (optional): Specific game ID to retrieve

**Response:**
```json
{
  "games": [
    {
      "id": "uuid",
      "name": "Game Name",
      "status": "WAITING|RUNNING|FINISHED",
      "teams": [...],
      "currentTurn": 0,
      "maxTurns": 100,
      "createdAt": "2023-01-01T00:00:00Z"
    }
  ]
}
```

#### POST /game
Create a new game.

**Request Body:**
```json
{
  "name": "Game Name",
  "maxTurns": 100,
  "mapWidth": 20,
  "mapHeight": 20,
  "teams": ["team1", "team2"]
}
```

**Response:**
```json
{
  "id": "uuid",
  "name": "Game Name",
  "status": "WAITING",
  "message": "Game created successfully"
}
```

#### POST /game/{gameId}/start
Start a specific game.

**Path Parameters:**
- `gameId`: UUID of the game to start

**Response:**
```json
{
  "status": "RUNNING",
  "message": "Game started successfully"
}
```

#### POST /game/{gameId}/stop
Stop a running game.

**Path Parameters:**
- `gameId`: UUID of the game to stop

**Response:**
```json
{
  "status": "FINISHED",
  "message": "Game stopped successfully"
}
```

#### GET /game/{gameId}/state
Get current game state.

**Path Parameters:**
- `gameId`: UUID of the game

**Response:**
```json
{
  "gameId": "uuid",
  "turn": 42,
  "status": "RUNNING",
  "map": {
    "width": 20,
    "height": 20,
    "outOfBounds": [[x, y], ...],
    "collectables": [
      {
        "id": "uuid",
        "position": {"x": 5, "y": 10}
      }
    ]
  },
  "teams": [
    {
      "id": "uuid",
      "name": "Team Name",
      "players": [
        {
          "id": "uuid",
          "position": {"x": 3, "y": 7},
          "isAlive": true
        }
      ],
      "spawnPoint": {"x": 0, "y": 0},
      "isDisqualified": false
    }
  ]
}
```

### Team Management

#### GET /teams
Get list of all teams.

**Response:**
```json
{
  "teams": [
    {
      "id": "uuid",
      "name": "Team Name",
      "password": "hashed_password",
      "isActive": true,
      "createdAt": "2023-01-01T00:00:00Z"
    }
  ]
}
```

#### POST /teams
Create a new team.

**Request Body:**
```json
{
  "name": "Team Name",
  "password": "team_password"
}
```

**Response:**
```json
{
  "id": "uuid",
  "name": "Team Name",
  "message": "Team created successfully"
}
```

#### PUT /teams/{teamId}
Update team information.

**Path Parameters:**
- `teamId`: UUID of the team

**Request Body:**
```json
{
  "name": "Updated Team Name",
  "password": "new_password"
}
```

### Admin Endpoints

#### PUT /admin
Update admin password.

**Request Body:**
```json
"new_admin_password"
```

**Response:**
```json
{
  "message": "Admin password updated successfully"
}
```

### Remote Bot Endpoints

#### POST /remote/register
Register a remote bot execution client.

**Request Body:**
```json
{
  "clientId": "unique_client_id",
  "capabilities": ["java", "python"],
  "maxConcurrentBots": 4
}
```

**Response:**
```json
{
  "registered": true,
  "clientId": "unique_client_id"
}
```

#### POST /remote/bot/{botId}/move
Submit bot moves (called by remote clients).

**Path Parameters:**
- `botId`: UUID of the bot

**Request Body:**
```json
{
  "moves": [
    {
      "playerId": "uuid",
      "direction": "NORTH"
    }
  ],
  "executionTime": 150
}
```

**Response:**
```json
{
  "accepted": true,
  "message": "Moves accepted"
}
```

## WebSocket API

### Connection Endpoint
- **URL**: `ws://localhost:8080/websocket` (development)
- **Protocol**: WebSocket

### Message Types

#### Game State Updates
Sent to all connected clients when game state changes.

```json
{
  "type": "GAME_STATE_UPDATE",
  "gameId": "uuid",
  "data": {
    "turn": 42,
    "gameState": { /* Full game state object */ },
    "events": [
      {
        "type": "PLAYER_MOVED",
        "playerId": "uuid",
        "from": {"x": 3, "y": 7},
        "to": {"x": 4, "y": 7}
      },
      {
        "type": "PLAYER_DIED",
        "playerId": "uuid",
        "cause": "COLLISION"
      },
      {
        "type": "COLLECTABLE_COLLECTED",
        "collectableId": "uuid",
        "playerId": "uuid"
      }
    ]
  }
}
```

#### Game Status Updates
Sent when game status changes (start, stop, etc.).

```json
{
  "type": "GAME_STATUS_UPDATE",
  "gameId": "uuid",
  "data": {
    "status": "RUNNING",
    "message": "Game started"
  }
}
```

#### Error Messages
Sent when errors occur.

```json
{
  "type": "ERROR",
  "data": {
    "message": "Error description",
    "code": "ERROR_CODE"
  }
}
```

### Client Messages

#### Subscribe to Game
Subscribe to updates for a specific game.

```json
{
  "type": "SUBSCRIBE_GAME",
  "gameId": "uuid"
}
```

#### Unsubscribe from Game
Unsubscribe from game updates.

```json
{
  "type": "UNSUBSCRIBE_GAME",
  "gameId": "uuid"
}
```

## Game Bot Interface

### Bot Implementation Requirements

Bots must implement the following interface:

```java
public abstract class Bot {
    /**
     * Make moves for this bot's players
     * @param gameState Current state of the game
     * @return List of moves to make
     */
    public abstract List<Move> makeMoves(GameState gameState);
    
    /**
     * Get the display name for this bot
     * @return Human-readable bot name
     */
    public String getDisplayName();
}
```

### GameState Object

The `GameState` object provided to bots contains:

```java
public class GameState {
    // Game metadata
    public int getTurn();
    public int getMaxTurns();
    public Id getGameId();
    
    // Map information
    public int getMapWidth();
    public int getMapHeight();
    public List<Position> getOutOfBounds();
    
    // Visible game objects (within 5 moves of bot's players)
    public List<Collectable> getCollectables();
    public List<Player> getPlayers(); // All visible players
    public List<Player> getMyPlayers(); // This bot's players only
    public List<SpawnPoint> getSpawnPoints(); // Visible spawn points
    
    // Utility methods
    public boolean isPositionOutOfBounds(Position position);
    public List<Player> getPlayersAt(Position position);
    public Optional<Collectable> getCollectableAt(Position position);
}
```

### Move Object

Moves are represented by the `Move` class:

```java
public class Move {
    public Move(Id playerId, Direction direction);
    
    public Id getPlayerId();
    public Direction getDirection();
}
```

### Direction Enum

Available movement directions:

```java
public enum Direction {
    NORTH,      // (0, -1)
    NORTHEAST,  // (1, -1)
    EAST,       // (1, 0)
    SOUTHEAST,  // (1, 1)
    SOUTH,      // (0, 1)
    SOUTHWEST,  // (-1, 1)
    WEST,       // (-1, 0)
    NORTHWEST   // (-1, -1)
}
```

### Bot Execution Rules

1. **Time Limit**: Bots have a maximum of 1 second to return moves
2. **Valid Moves**: Must only move own players that are alive
3. **One Move Per Player**: Each player can only be moved once per turn
4. **Exception Handling**: Any uncaught exception disqualifies the bot
5. **Resource Limits**: Bots run with limited CPU and memory

### Example Bot Implementation

```java
public class ExampleBot extends Bot {
    public ExampleBot() {
        super("Example Bot");
    }
    
    @Override
    public List<Move> makeMoves(GameState gameState) {
        List<Move> moves = new ArrayList<>();
        
        for (Player player : gameState.getMyPlayers()) {
            // Simple strategy: move towards nearest collectable
            Optional<Collectable> nearest = findNearestCollectable(
                gameState, player.getPosition()
            );
            
            if (nearest.isPresent()) {
                Direction direction = getDirectionTo(
                    player.getPosition(), 
                    nearest.get().getPosition()
                );
                moves.add(new Move(player.getId(), direction));
            }
        }
        
        return moves;
    }
    
    // Helper methods...
}
```

## Data Models

### Core Game Objects

#### Position
```json
{
  "x": 5,
  "y": 10
}
```

#### Player
```json
{
  "id": "uuid",
  "position": {"x": 5, "y": 10},
  "isAlive": true,
  "teamId": "uuid"
}
```

#### Collectable
```json
{
  "id": "uuid",
  "position": {"x": 3, "y": 7}
}
```

#### SpawnPoint
```json
{
  "id": "uuid",
  "position": {"x": 0, "y": 0},
  "teamId": "uuid",
  "isDestroyed": false
}
```

#### Team
```json
{
  "id": "uuid",
  "name": "Team Name",
  "players": [...],
  "spawnPoint": {...},
  "isDisqualified": false,
  "disqualificationReason": null
}
```

### Game Configuration

```json
{
  "mapWidth": 20,
  "mapHeight": 20,
  "maxTurns": 100,
  "playersPerTeam": 8,
  "collectablesPerTurn": 3,
  "visibilityRange": 5,
  "botTimeoutMs": 1000
}
```

## Authentication

### Admin Authentication
- **Username**: `admin`
- **Password**: Configurable (default: `secret`)
- **Role**: `ADMIN`

### Team Authentication
- **Username**: Team name
- **Password**: Team-specific password
- **Role**: `TEAM`

### Authentication Headers
```
Authorization: Basic <base64(username:password)>
```

### Protected Endpoints
- **Admin Only**: `/admin/*`, game management endpoints
- **Team Access**: Team-specific resources, game viewing
- **Public**: Game state viewing (read-only)

## Error Handling

### HTTP Status Codes
- `200 OK`: Successful request
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `409 Conflict`: Resource conflict (e.g., duplicate team name)
- `500 Internal Server Error`: Server error

### Error Response Format
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {
      "field": "Additional error details"
    }
  }
}
```

### Common Error Codes
- `GAME_NOT_FOUND`: Requested game does not exist
- `TEAM_NOT_FOUND`: Requested team does not exist
- `INVALID_GAME_STATE`: Game is in invalid state for operation
- `BOT_TIMEOUT`: Bot exceeded time limit
- `INVALID_MOVE`: Bot submitted invalid move
- `AUTHENTICATION_FAILED`: Invalid credentials
- `INSUFFICIENT_PERMISSIONS`: User lacks required permissions

## Rate Limiting

### Limits
- **API Requests**: 100 requests per minute per IP
- **WebSocket Connections**: 10 concurrent connections per IP
- **Bot Execution**: 1 second per turn per bot

### Rate Limit Headers
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

## API Versioning

Currently, the API is unversioned. Future versions will use URL versioning:
- `v1`: `/api/v1/game`
- `v2`: `/api/v2/game`

## SDK and Client Libraries

### Java Client
Use the provided game library for Java bot development:
```xml
<dependency>
    <groupId>com.scottlogic.hackathon</groupId>
    <artifactId>game</artifactId>
    <version>1.0-SNAPSHOT</version>
</dependency>
```

### Python Client
Use the provided Python client library:
```python
from hackathon_game import Bot, GameState, Move, Direction

class MyBot(Bot):
    def make_moves(self, game_state: GameState) -> List[Move]:
        # Implementation here
        pass
```

## Testing the API

### Using curl

#### Get game list
```bash
curl -X GET http://localhost:8080/game \
  -H "Authorization: Basic YWRtaW46c2VjcmV0"
```

#### Create a new game
```bash
curl -X POST http://localhost:8080/game \
  -H "Content-Type: application/json" \
  -H "Authorization: Basic YWRtaW46c2VjcmV0" \
  -d '{
    "name": "Test Game",
    "maxTurns": 50,
    "teams": ["team1", "team2"]
  }'
```

### Using WebSocket clients
```javascript
const ws = new WebSocket('ws://localhost:8080/websocket');

ws.onopen = function() {
    // Subscribe to game updates
    ws.send(JSON.stringify({
        type: 'SUBSCRIBE_GAME',
        gameId: 'your-game-id'
    }));
};

ws.onmessage = function(event) {
    const message = JSON.parse(event.data);
    console.log('Received:', message);
};
```

This API documentation should be updated as the system evolves and new endpoints are added.