# AirCade Milestones

## M0.1.0: Repository & Infrastructure Setup

**Goal:** Establish the monorepo structure, shared tooling, and initial CI/CD pipeline.

### Repository Structure

- [X] **[Shared]** Initialize project root with pnpm workspaces configuration
- [X] **[Shared]** Use `create-turbo` to scaffold the monorepo structure
- [X] **[Shared]** Configure `pnpm-workspace.yaml` with all workspace packages
- [X] **[Shared]** Set up root `package.json` with workspace scripts (dev, build, lint, test)
- [X] **[Shared]** Configure `turbo.json` with build, dev, lint, and type-check pipelines

### Application Setup

- [X] **[Frontend]** Create Next.js 16 application inside `apps/web` using App Router
- [X] **[Frontend]** Configure Next.js to run on port 3001
- [X] **[Frontend]** Set up basic `app/layout.tsx` and `app/page.tsx`
- [X] **[Backend]** Create NestJS application inside `apps/api`
- [X] **[Backend]** Configure NestJS to run on port 3000
- [X] **[Backend]** Set up basic `AppModule`, `AppController`, and `AppService`
- [X] **[Backend]** Add health check endpoint (`GET /health`)

### Shared Packages

- [X] **[Shared]** Create `packages/database` with initial package.json
- [-] **[Shared]** Create `packages/types` with initial package.json
- [X] **[Shared]** Create `packages/ui` stub package with package.json
- [X] **[Shared]** Create `packages/eslint-config` with base, next, and nest configurations
- [X] **[Shared]** Create `packages/typescript-config` with base, nextjs, and nestjs configurations
- [X] **[Shared]** Configure all packages to use workspace protocol (`workspace:*`)

### Development Environment

- [X] **[Shared]** Create `.gitignore` at root with Node, IDE, and environment file exclusions
- [-] **[Shared]** Set up Prettier configuration for consistent code formatting
- [-] **[Shared]** Configure ESLint to work with Prettier
- [-] **[Shared]** Add pre-commit hooks with Husky for linting and formatting
- [X] **[Shared]** Create `.nvmrc` or `.node-version` file specifying Node >= 18

### Documentation

- [X] **[Shared]** Create root `README.md` with project overview and setup instructions
- [X] **[Shared]** Document common commands (dev, build, lint, test) in README
- [-] **[Shared]** Create `CONTRIBUTING.md` with development guidelines
- [X] **[Shared]** Set up `.env.example` files for both apps

### CI/CD Pipeline

- [-] **[Infra]** Set up GitHub Actions workflow for CI
- [-] **[Infra]** Add job for dependency installation with pnpm caching
- [-] **[Infra]** Add job for linting across all workspaces
- [-] **[Infra]** Add job for type-checking across all workspaces
- [-] **[Infra]** Add job for building all apps and packages
- [-] **[Infra]** Configure CI to run on pull requests and main branch pushes

### Verification

- [-] **[QA]** Verify `pnpm install` works correctly
- [-] **[QA]** Verify `pnpm dev` starts both apps successfully
- [-] **[QA]** Verify `pnpm build` builds all workspaces without errors
- [-] **[QA]** Verify `pnpm lint` runs across all workspaces
- [-] **[QA]** Verify CI pipeline passes on a test commit

---

## M0.2.0: Database Schema & Core Backend Services

**Goal:** Implement foundational backend services, database schema, and user authentication.

### Database Setup

- [ ] **[Database]** Provision new Supabase project for PostgreSQL database
- [ ] **[Database]** Configure connection pooling and performance settings
- [ ] **[Database]** Add Supabase connection string to `packages/database/.env`
- [ ] **[Database]** Initialize Prisma in `packages/database` package
- [ ] **[Database]** Configure Prisma to use PostgreSQL provider
- [ ] **[Database]** Set up Prisma Client generation scripts

### User Management Schema

- [ ] **[Database]** Define `User` model in `schema.prisma` with fields:
  - [ ] `id` (UUID, primary key)
  - [ ] `email` (unique, indexed)
  - [ ] `passwordHash` (nullable for OAuth users)
  - [ ] `displayName` (nullable)
  - [ ] `avatarUrl` (nullable)
  - [ ] `role` (enum: USER, ADMIN)
  - [ ] `createdAt`, `updatedAt` timestamps
- [ ] **[Database]** Define `Account` model for OAuth provider linking
- [ ] **[Database]** Run first Prisma migration to create User and Account tables
- [ ] **[Database]** Create database indexes for performance (email, createdAt)

### Authentication Module

- [ ] **[Backend]** Install required packages: `@nestjs/jwt`, `@nestjs/passport`, `passport-jwt`, `bcrypt`
- [ ] **[Backend]** Create `AuthModule` with providers and controllers
- [ ] **[Backend]** Create `UserService` with methods:
  - [ ] `create(email, password)` - Create new user with hashed password
  - [ ] `findByEmail(email)` - Find user by email
  - [ ] `findById(id)` - Find user by ID
  - [ ] `updateProfile(id, data)` - Update user profile
- [ ] **[Backend]** Create `AuthService` with methods:
  - [ ] `register(email, password)` - Register new user
  - [ ] `validateUser(email, password)` - Validate credentials
  - [ ] `login(user)` - Issue JWT token
  - [ ] `verifyToken(token)` - Verify and decode JWT
- [ ] **[Backend]** Implement bcrypt password hashing (salt rounds: 10)
- [ ] **[Backend]** Configure JWT with secret key and expiration (24h for access token)

### Authentication Endpoints

- [ ] **[Backend]** Create `AuthController` with endpoints:
  - [ ] `POST /auth/register` - Register new user
  - [ ] `POST /auth/login` - Login and receive JWT
  - [ ] `POST /auth/logout` - Invalidate session (if using refresh tokens)
  - [ ] `GET /auth/me` - Get current user profile (protected)
  - [ ] `PATCH /auth/me` - Update current user profile (protected)
- [ ] **[Backend]** Implement request DTOs with class-validator:
  - [ ] `RegisterDto` (email, password validation)
  - [ ] `LoginDto` (email, password)
  - [ ] `UpdateProfileDto` (displayName, avatarUrl)
- [ ] **[Backend]** Implement response DTOs (exclude password hash)

### JWT Strategy & Guards

- [ ] **[Backend]** Create `JwtStrategy` for Passport.js
- [ ] **[Backend]** Create `JwtAuthGuard` extending `AuthGuard('jwt')`
- [ ] **[Backend]** Create `RolesGuard` for role-based access control
- [ ] **[Backend]** Create custom decorators:
  - [ ] `@CurrentUser()` - Extract user from request
  - [ ] `@Roles()` - Specify required roles
  - [ ] `@Public()` - Mark endpoint as public

### Error Handling

- [ ] **[Backend]** Implement global exception filter
- [ ] **[Backend]** Create custom exceptions:
  - [ ] `UserAlreadyExistsException`
  - [ ] `InvalidCredentialsException`
  - [ ] `UnauthorizedException`
- [ ] **[Backend]** Add validation pipe globally for DTO validation

### Testing

- [ ] **[Backend]** Write unit tests for `UserService`
- [ ] **[Backend]** Write unit tests for `AuthService`
- [ ] **[Backend]** Write e2e tests for authentication endpoints
- [ ] **[Backend]** Test password hashing and validation
- [ ] **[Backend]** Test JWT token generation and verification
- [ ] **[Backend]** Achieve >80% code coverage for auth module

### Shared Types

- [ ] **[Types]** Define `User` type/interface in `packages/types`
- [ ] **[Types]** Define `AuthTokens` type (accessToken, refreshToken)
- [ ] **[Types]** Define auth-related DTOs for frontend consumption
- [ ] **[Types]** Export all types from package index

### Verification

- [ ] **[QA]** Verify user registration works via API
- [ ] **[QA]** Verify user login returns valid JWT
- [ ] **[QA]** Verify protected endpoint rejects unauthorized requests
- [ ] **[QA]** Verify protected endpoint accepts valid JWT
- [ ] **[QA]** Verify password validation prevents weak passwords

---

## M0.3.0: Session Management & Real-time Connection

**Goal:** Build session creation system and WebSocket infrastructure for controller-console communication.

### Session Database Schema

- [ ] **[Database]** Define `Session` model in `schema.prisma`:
  - [ ] `id` (UUID, primary key)
  - [ ] `code` (6-character alphanumeric, unique, indexed)
  - [ ] `hostId` (FK to User, nullable)
  - [ ] `gameId` (FK to Game, nullable)
  - [ ] `status` (enum: LOBBY, IN_PROGRESS, PAUSED, ENDED)
  - [ ] `maxPlayers` (integer, default 8)
  - [ ] `settings` (JSON for game-specific config)
  - [ ] `expiresAt` (timestamp)
  - [ ] `createdAt`, `updatedAt` timestamps
- [ ] **[Database]** Define `SessionPlayer` model:
  - [ ] `id` (UUID, primary key)
  - [ ] `sessionId` (FK to Session)
  - [ ] `userId` (FK to User, nullable for guest players)
  - [ ] `nickname` (string, required)
  - [ ] `avatarColor` (string)
  - [ ] `isHost` (boolean)
  - [ ] `isReady` (boolean)
  - [ ] `connectionStatus` (enum: CONNECTED, DISCONNECTED, RECONNECTING)
  - [ ] `score` (integer, default 0)
  - [ ] `joinedAt`, `lastActiveAt` timestamps
- [ ] **[Database]** Add relations between Session and SessionPlayer
- [ ] **[Database]** Create indexes for session code lookup and active sessions
- [ ] **[Database]** Run migration to create session tables

### Session Service

- [ ] **[Backend]** Create `SessionModule` with providers and controllers
- [ ] **[Backend]** Create `SessionService` with methods:
  - [ ] `generateSessionCode()` - Generate unique 6-char code
  - [ ] `createSession(hostId?)` - Create new session
  - [ ] `findByCode(code)` - Find session by code
  - [ ] `findById(id)` - Find session by ID
  - [ ] `updateSessionStatus(id, status)` - Update session status
  - [ ] `endSession(id)` - Mark session as ended
  - [ ] `cleanupExpiredSessions()` - Remove old sessions
- [ ] **[Backend]** Implement session code generation with collision detection
- [ ] **[Backend]** Set session expiration to 2 hours of inactivity
- [ ] **[Backend]** Create cron job to cleanup expired sessions (every 15 minutes)

### Player Management

- [ ] **[Backend]** Create `PlayerService` with methods:
  - [ ] `addPlayer(sessionId, userId?, nickname)` - Add player to session
  - [ ] `removePlayer(sessionId, playerId)` - Remove player
  - [ ] `updatePlayerStatus(playerId, status)` - Update connection status
  - [ ] `setPlayerReady(playerId, ready)` - Set ready state
  - [ ] `getSessionPlayers(sessionId)` - Get all players in session
  - [ ] `kickPlayer(sessionId, playerId, hostId)` - Host kicks player
- [ ] **[Backend]** Implement max players validation
- [ ] **[Backend]** Implement host transfer logic when host disconnects
- [ ] **[Backend]** Generate random avatar colors for players

### Session REST API

- [ ] **[Backend]** Create `SessionController` with endpoints:
  - [ ] `POST /sessions` - Create new session (returns code)
  - [ ] `GET /sessions/:code` - Get session details by code
  - [ ] `GET /sessions/:code/players` - Get players in session
  - [ ] `DELETE /sessions/:code` - End session (host only)
  - [ ] `POST /sessions/:code/join` - Validate code before WebSocket connection
  - [ ] `POST /sessions/:code/players/:playerId/kick` - Kick player (host only)
- [ ] **[Backend]** Implement DTOs for session endpoints
- [ ] **[Backend]** Add authorization guards (host-only actions)

### WebSocket Infrastructure

- [ ] **[Backend]** Install `@nestjs/websockets`, `@nestjs/platform-socket.io`, `socket.io`
- [ ] **[Backend]** Create `GatewayModule` with WebSocket gateway
- [ ] **[Backend]** Configure Socket.IO with CORS for local development
- [ ] **[Backend]** Create `SessionGateway` extending `WebSocketGateway`
- [ ] **[Backend]** Implement connection authentication via JWT
- [ ] **[Backend]** Store socket-to-player mapping in memory/Redis

### WebSocket Events - Client to Server

- [ ] **[Backend]** Implement `join_session` event handler:
  - [ ] Validate session code
  - [ ] Create/retrieve player record
  - [ ] Join socket to session room
  - [ ] Emit player joined event to room
  - [ ] Return session state to joining player
- [ ] **[Backend]** Implement `leave_session` event handler
- [ ] **[Backend]** Implement `set_ready` event handler
- [ ] **[Backend]** Implement `disconnect` event handler:
  - [ ] Update player status to DISCONNECTED
  - [ ] Notify room of disconnection
  - [ ] Handle host disconnection logic

### WebSocket Events - Server to Client

- [ ] **[Backend]** Define event emitters for:
  - [ ] `player_joined` - New player joined session
  - [ ] `player_left` - Player left session
  - [ ] `player_disconnected` - Player lost connection
  - [ ] `player_reconnected` - Player reconnected
  - [ ] `session_updated` - Session state changed
  - [ ] `host_changed` - New host assigned
  - [ ] `player_kicked` - Player was kicked

### Frontend - Console View Setup

- [ ] **[Frontend]** Create `/play` route with `ConsoleView` component
- [ ] **[Frontend]** Install `socket.io-client` and `qrcode.react` packages
- [ ] **[Frontend]** Create `useSession` hook for session state management
- [ ] **[Frontend]** Implement session creation on page load:
  - [ ] Call `POST /sessions` API
  - [ ] Store session code and ID in state
  - [ ] Initialize WebSocket connection
- [ ] **[Frontend]** Display session code in large, readable font
- [ ] **[Frontend]** Generate and display QR code with join URL
- [ ] **[Frontend]** Create "Copy Code" button with clipboard API
- [ ] **[Frontend]** Create "Copy Link" button with full join URL

### Frontend - Lobby UI

- [ ] **[Frontend]** Create `PlayerList` component showing connected players
- [ ] **[Frontend]** Display player nicknames with avatar colors
- [ ] **[Frontend]** Show player ready status with visual indicators
- [ ] **[Frontend]** Show player count (e.g., "3/8 players")
- [ ] **[Frontend]** Add "Kick Player" button for host (with confirmation)
- [ ] **[Frontend]** Display connection status indicators (connected/reconnecting)
- [ ] **[Frontend]** Implement real-time updates via WebSocket listeners

### Frontend - Controller/Join View

- [ ] **[Frontend]** Create `/join` route with `ControllerView` component
- [ ] **[Frontend]** Create session code input form with validation
- [ ] **[Frontend]** Add QR code scanner using `react-qr-scanner` or similar
- [ ] **[Frontend]** Create nickname input (required, 2-20 characters)
- [ ] **[Frontend]** Implement join flow:
  - [ ] Validate code via API
  - [ ] Store session info in local storage
  - [ ] Connect to WebSocket
  - [ ] Emit `join_session` event
  - [ ] Navigate to lobby on success
- [ ] **[Frontend]** Create error states:
  - [ ] Invalid code
  - [ ] Session full
  - [ ] Session already ended
  - [ ] Network error

### Frontend - Controller Lobby

- [ ] **[Frontend]** Create controller lobby view showing:
  - [ ] Session code
  - [ ] Player count
  - [ ] Player's own nickname and color
  - [ ] Ready status toggle
- [ ] **[Frontend]** Implement "Ready" button with state persistence
- [ ] **[Frontend]** Show "Waiting for host to start game" message
- [ ] **[Frontend]** Handle kick event (redirect to join page)
- [ ] **[Frontend]** Handle session ended event

### Reconnection Logic

- [ ] **[Backend]** Implement reconnection window (5 minutes)
- [ ] **[Backend]** Preserve player state during disconnection
- [ ] **[Backend]** Handle duplicate connections (same player, multiple sockets)
- [ ] **[Frontend]** Implement automatic reconnection on connection loss
- [ ] **[Frontend]** Show "Reconnecting..." UI state
- [ ] **[Frontend]** Store session ID in localStorage for page refresh recovery

### Shared Types

- [ ] **[Types]** Define `Session` type
- [ ] **[Types]** Define `SessionPlayer` type
- [ ] **[Types]** Define `SessionStatus` enum
- [ ] **[Types]** Define WebSocket event payloads
- [ ] **[Types]** Define DTOs for session API

### Testing

- [ ] **[Backend]** Write unit tests for session code generation
- [ ] **[Backend]** Write unit tests for player management
- [ ] **[Backend]** Write e2e tests for session REST API
- [ ] **[Backend]** Write tests for WebSocket events
- [ ] **[Frontend]** Write component tests for ConsoleView
- [ ] **[Frontend]** Write component tests for ControllerView

### Verification

- [ ] **[QA]** Verify session creation generates unique codes
- [ ] **[QA]** Verify QR code scans correctly on mobile
- [ ] **[QA]** Verify multiple players can join same session
- [ ] **[QA]** Verify players appear in real-time on console
- [ ] **[QA]** Verify disconnection/reconnection works correctly
- [ ] **[QA]** Verify host can kick players
- [ ] **[QA]** Verify session cleanup works for expired sessions

---

## M0.4.0: Game Database Schema & Catalog API

**Goal:** Define game metadata structure and implement catalog browsing functionality.

### Game Database Schema

- [ ] **[Database]** Define `Game` model in `schema.prisma`:
  - [ ] `id` (UUID, primary key)
  - [ ] `slug` (unique, URL-friendly identifier)
  - [ ] `title` (string)
  - [ ] `description` (text)
  - [ ] `shortDescription` (string, 120 chars)
  - [ ] `thumbnailUrl` (string, image URL)
  - [ ] `coverImageUrl` (string)
  - [ ] `minPlayers` (integer)
  - [ ] `maxPlayers` (integer)
  - [ ] `estimatedDuration` (integer, in minutes)
  - [ ] `difficulty` (enum: EASY, MEDIUM, HARD)
  - [ ] `category` (enum: PARTY, TRIVIA, RACING, DRAWING, STRATEGY)
  - [ ] `isPremium` (boolean)
  - [ ] `isPublished` (boolean)
  - [ ] `isFeatured` (boolean)
  - [ ] `playCount` (integer, default 0)
  - [ ] `controllerConfig` (JSON, controller layout definition)
  - [ ] `gameConfig` (JSON, game-specific settings)
  - [ ] `createdAt`, `updatedAt`, `publishedAt` timestamps
- [ ] **[Database]** Define `GameTag` model for flexible categorization
- [ ] **[Database]** Define many-to-many relation between Game and GameTag
- [ ] **[Database]** Create indexes for slug, category, isPremium, isPublished
- [ ] **[Database]** Run migration to create game tables

### Game Assets Management

- [ ] **[Database]** Define `GameAsset` model:
  - [ ] `id` (UUID)
  - [ ] `gameId` (FK to Game)
  - [ ] `type` (enum: IMAGE, SOUND, MUSIC, DATA)
  - [ ] `key` (string, asset identifier)
  - [ ] `url` (string, CDN URL)
  - [ ] `metadata` (JSON, dimensions, size, etc.)
- [ ] **[Database]** Run migration for GameAsset table

### Seed Data

- [ ] **[Database]** Create seed script in `packages/database/prisma/seed.ts`
- [ ] **[Database]** Create seed data for 5 demo games:
  - [ ] Game 1: "Quick Quiz" (Trivia, 2-8 players, Easy)
  - [ ] Game 2: "Speed Tap" (Party, 2-6 players, Easy)
  - [ ] Game 3: "Color Rush" (Racing, 2-4 players, Medium)
  - [ ] Game 4: "Draw Together" (Drawing, 3-8 players, Medium)
  - [ ] Game 5: "Strategy Showdown" (Strategy, 2-4 players, Hard, Premium)
- [ ] **[Database]** Create placeholder game tags (family-friendly, competitive, cooperative)
- [ ] **[Database]** Add placeholder thumbnail and cover images
- [ ] **[Database]** Configure basic controller layouts for each game
- [ ] **[Database]** Run seed command and verify data

### Game Service

- [ ] **[Backend]** Create `GameModule` with providers and controllers
- [ ] **[Backend]** Create `GameService` with methods:
  - [ ] `findAll(filters)` - Get all published games with filtering
  - [ ] `findBySlug(slug)` - Get game by slug
  - [ ] `findById(id)` - Get game by ID
  - [ ] `findFeatured()` - Get featured games
  - [ ] `search(query)` - Search games by title/description
  - [ ] `incrementPlayCount(id)` - Increment play counter
  - [ ] `getControllerConfig(id)` - Get controller layout config
- [ ] **[Backend]** Implement filtering by category, player count, premium status
- [ ] **[Backend]** Implement sorting (popularity, newest, A-Z)
- [ ] **[Backend]** Implement pagination for catalog listings

### Game REST API

- [ ] **[Backend]** Create `GamesController` with endpoints:
  - [ ] `GET /games` - List all games with filters and pagination
  - [ ] `GET /games/featured` - Get featured games
  - [ ] `GET /games/search?q=query` - Search games
  - [ ] `GET /games/:slug` - Get game details by slug
  - [ ] `GET /games/:slug/controller-config` - Get controller layout
- [ ] **[Backend]** Implement query DTOs:
  - [ ] `GameFilterDto` (category, minPlayers, maxPlayers, isPremium)
  - [ ] `GameSearchDto` (query, limit, offset)
- [ ] **[Backend]** Implement response DTOs for game data
- [ ] **[Backend]** Add caching for game catalog (Redis or in-memory)

### Frontend - Home Page

- [ ] **[Frontend]** Update `/` (homepage) with marketing layout
- [ ] **[Frontend]** Create hero section with:
  - [ ] Tagline explaining the concept
  - [ ] "Start on This Screen" CTA button
  - [ ] "Join a Game" secondary CTA
- [ ] **[Frontend]** Create "How It Works" section with 3-4 steps
- [ ] **[Frontend]** Create "Featured Games" section:
  - [ ] Fetch featured games from API
  - [ ] Display in horizontal carousel or grid
  - [ ] Show game thumbnails, titles, and player counts
- [ ] **[Frontend]** Add responsive design for mobile/desktop
- [ ] **[Frontend]** Implement device detection to show appropriate CTA
- [ ] **[Frontend]** Add basic SEO meta tags

### Frontend - Game Catalog Page

- [ ] **[Frontend]** Create `/games` route with `GameCatalog` component
- [ ] **[Frontend]** Create `GameCard` component showing:
  - [ ] Thumbnail image
  - [ ] Title
  - [ ] Player count range
  - [ ] Duration estimate
  - [ ] Difficulty badge
  - [ ] Premium badge (if applicable)
  - [ ] Tags
- [ ] **[Frontend]** Implement filter sidebar with:
  - [ ] Category filter (checkboxes)
  - [ ] Player count slider
  - [ ] Free/Premium toggle
  - [ ] Difficulty filter
- [ ] **[Frontend]** Implement search bar with debounced API calls
- [ ] **[Frontend]** Implement sort dropdown (Popular, Newest, A-Z)
- [ ] **[Frontend]** Add pagination or infinite scroll
- [ ] **[Frontend]** Add loading states and skeletons
- [ ] **[Frontend]** Add empty state when no games match filters

### Frontend - Game Detail Page

- [ ] **[Frontend]** Create `/games/[slug]` dynamic route
- [ ] **[Frontend]** Create `GameDetail` component showing:
  - [ ] Cover image
  - [ ] Title and description
  - [ ] Player count, duration, difficulty
  - [ ] Tags
  - [ ] Screenshots/gameplay preview
  - [ ] "How to Play" instructions
- [ ] **[Frontend]** Add "Play on This Screen" CTA button
- [ ] **[Frontend]** Clicking CTA redirects to `/play?game={slug}`
- [ ] **[Frontend]** Add share button (copy link, social media)
- [ ] **[Frontend]** Show "Premium Required" badge if applicable

### Shared Types

- [ ] **[Types]** Define `Game` type
- [ ] **[Types]** Define `GameCategory`, `GameDifficulty` enums
- [ ] **[Types]** Define `GameTag` type
- [ ] **[Types]** Define `ControllerConfig` type
- [ ] **[Types]** Define DTOs for game API responses

### Testing

- [ ] **[Backend]** Write unit tests for GameService
- [ ] **[Backend]** Write e2e tests for game catalog API
- [ ] **[Backend]** Test filtering, search, and pagination
- [ ] **[Frontend]** Write component tests for GameCard
- [ ] **[Frontend]** Write component tests for GameCatalog
- [ ] **[Frontend]** Test filter and search functionality

### Verification

- [ ] **[QA]** Verify game catalog loads with seed data
- [ ] **[QA]** Verify filtering works correctly
- [ ] **[QA]** Verify search returns relevant results
- [ ] **[QA]** Verify game detail page loads correctly
- [ ] **[QA]** Verify pagination works
- [ ] **[QA]** Verify responsive design on mobile and desktop

---

## M0.5.0: Game Selection & Dynamic Controller Configuration

**Goal:** Allow hosts to select games from lobby and dynamically configure controller layouts.

### Session-Game Integration

- [ ] **[Backend]** Update `SessionService` with methods:
  - [ ] `setGame(sessionId, gameId)` - Associate game with session
  - [ ] `clearGame(sessionId)` - Remove game from session
  - [ ] `getSessionGame(sessionId)` - Get current game for session
- [ ] **[Backend]** Validate game selection (player count compatibility)
- [ ] **[Backend]** Update session status when game is selected
- [ ] **[Backend]** Prevent game change when session is in progress

### Extended Session API

- [ ] **[Backend]** Add endpoints to `SessionController`:
  - [ ] `POST /sessions/:code/game` - Set game for session (host only)
  - [ ] `DELETE /sessions/:code/game` - Remove game (host only)
  - [ ] `GET /sessions/:code/game` - Get current game details
- [ ] **[Backend]** Implement DTOs for game selection
- [ ] **[Backend]** Add validation for host-only actions

### WebSocket Events for Game Selection

- [ ] **[Backend]** Implement `select_game` WebSocket event handler:
  - [ ] Validate host permission
  - [ ] Update session with game ID
  - [ ] Emit `game_selected` to all players in room
- [ ] **[Backend]** Implement `game_selected` event emission with game data
- [ ] **[Backend]** Emit controller config to all connected controllers

### Frontend - Console Game Selection

- [ ] **[Frontend]** Update `ConsoleView` lobby to include game browser
- [ ] **[Frontend]** Create `GameSelector` component:
  - [ ] Show mini game catalog
  - [ ] Search and filter functionality
  - [ ] Click to select game
- [ ] **[Frontend]** Display selected game in lobby:
  - [ ] Game title and thumbnail
  - [ ] Player count compatibility check
  - [ ] "Change Game" button (host only)
- [ ] **[Frontend]** Show warning if player count doesn't match game requirements
- [ ] **[Frontend]** Enable "Start Game" button only when:
  - [ ] Game is selected
  - [ ] Player count meets minimum
  - [ ] All players are ready (optional requirement)

### Controller Configuration System

- [ ] **[Types]** Define `ControllerLayout` schema:
  - [ ] Layout type (buttons, joystick, drawing, custom)
  - [ ] Button definitions (id, label, position, size, color)
  - [ ] Joystick configuration (sensitivity, deadzone)
  - [ ] Custom component mapping
- [ ] **[Frontend]** Create `DynamicController` component:
  - [ ] Parse controller config JSON
  - [ ] Render buttons dynamically
  - [ ] Render joystick if configured
  - [ ] Render custom layouts
- [ ] **[Frontend]** Create controller UI components:
  - [ ] `ControllerButton` - Tap button with haptic feedback
  - [ ] `ControllerJoystick` - Touch joystick
  - [ ] `ControllerSlider` - Slider input
  - [ ] `ControllerColorPicker` - Color selection
  - [ ] `ControllerDrawingPad` - Canvas for drawing

### Controller Input Events

- [ ] **[Backend]** Define standard input event format
- [ ] **[Backend]** Create `game_input` WebSocket event handler
- [ ] **[Backend]** Route input events to game logic handler
- [ ] **[Backend]** Validate input against controller config
- [ ] **[Frontend]** Implement input event emission from controller
- [ ] **[Frontend]** Add touch event handlers with debouncing
- [ ] **[Frontend]** Add haptic feedback for button presses (if supported)
- [ ] **[Frontend]** Add visual feedback for all interactions

### Frontend - Controller Auto-Configuration

- [ ] **[Frontend]** Listen for `game_selected` WebSocket event on controller
- [ ] **[Frontend]** Fetch controller config when game changes
- [ ] **[Frontend]** Dynamically switch controller layout
- [ ] **[Frontend]** Preserve controller connection during layout change
- [ ] **[Frontend]** Show loading state during config fetch
- [ ] **[Frontend]** Add smooth transition animations between layouts

### Game State Management

- [ ] **[Backend]** Create base `GameEngine` abstract class
- [ ] **[Backend]** Define game lifecycle methods:
  - [ ] `initialize(session, config)` - Set up game
  - [ ] `start()` - Begin game
  - [ ] `handleInput(playerId, input)` - Process player input
  - [ ] `update(deltaTime)` - Game tick/update loop
  - [ ] `pause()` - Pause game
  - [ ] `resume()` - Resume game
  - [ ] `end()` - End game and compute results
- [ ] **[Backend]** Create `GameStateManager` to manage active games
- [ ] **[Backend]** Implement game instance lifecycle management

### Testing

- [ ] **[Backend]** Write tests for game selection flow
- [ ] **[Backend]** Test controller config retrieval
- [ ] **[Backend]** Test input validation
- [ ] **[Frontend]** Test dynamic controller rendering
- [ ] **[Frontend]** Test game selection UI
- [ ] **[Integration]** Test end-to-end game selection and controller switch

### Verification

- [ ] **[QA]** Verify host can browse and select games in lobby
- [ ] **[QA]** Verify all players see selected game in real-time
- [ ] **[QA]** Verify controller layout changes when game is selected
- [ ] **[QA]** Verify different controller layouts render correctly
- [ ] **[QA]** Verify input events are sent correctly
- [ ] **[QA]** Verify game can be changed before starting

---

## M0.6.0: First Playable Game - "Quick Quiz"

**Goal:** Implement a complete, playable trivia game to demonstrate end-to-end functionality.

### Game Design & Specification

- [ ] **[Planning]** Define Quick Quiz game rules and flow
- [ ] **[Planning]** Define question format and data structure
- [ ] **[Planning]** Design game states: Lobby → Instructions → Question → Answer Reveal → Scoreboard → Next/End
- [ ] **[Planning]** Design controller layout (4 answer buttons)
- [ ] **[Planning]** Design console view for each game state

### Question Database

- [ ] **[Database]** Define `QuizQuestion` model:
  - [ ] `id` (UUID)
  - [ ] `gameId` (FK to Game)
  - [ ] `question` (text)
  - [ ] `options` (JSON array of 4 options)
  - [ ] `correctAnswer` (integer, 0-3)
  - [ ] `difficulty` (enum: EASY, MEDIUM, HARD)
  - [ ] `category` (string)
  - [ ] `timeLimit` (integer, seconds)
- [ ] **[Database]** Run migration for QuizQuestion table
- [ ] **[Database]** Seed 50+ trivia questions across categories:
  - [ ] General knowledge (15 questions)
  - [ ] Science (10 questions)
  - [ ] History (10 questions)
  - [ ] Entertainment (15 questions)

### Quiz Game Engine

- [ ] **[Backend]** Create `QuizGameEngine` extending `GameEngine`
- [ ] **[Backend]** Implement `initialize()`:
  - [ ] Load random set of questions
  - [ ] Initialize player scores
  - [ ] Set round count
- [ ] **[Backend]** Implement `start()`:
  - [ ] Transition to instructions state
  - [ ] Start countdown timer
- [ ] **[Backend]** Implement question flow:
  - [ ] `startQuestion()` - Display question and start timer
  - [ ] `handleAnswer(playerId, answer)` - Record player answer
  - [ ] `endQuestion()` - Stop timer, reveal answers
  - [ ] `calculateScores()` - Award points based on speed and correctness
- [ ] **[Backend]** Implement scoring system:
  - [ ] Correct answer: 1000 points
  - [ ] Speed bonus: up to 500 points (faster = more points)
  - [ ] Incorrect answer: 0 points
- [ ] **[Backend]** Implement game state emissions:
  - [ ] Emit question data (without correct answer)
  - [ ] Emit timer updates
  - [ ] Emit answer reveal (with correct answer)
  - [ ] Emit updated scores

### Quiz WebSocket Events

- [ ] **[Backend]** Implement WebSocket event handlers:
  - [ ] `quiz_answer` - Player submits answer
  - [ ] `quiz_ready_for_next` - Player ready for next question
- [ ] **[Backend]** Implement server events:
  - [ ] `quiz_question_start` - New question begins
  - [ ] `quiz_timer_tick` - Timer countdown
  - [ ] `quiz_question_end` - Question time expired
  - [ ] `quiz_answer_reveal` - Show correct answer
  - [ ] `quiz_scores_update` - Update player scores
  - [ ] `quiz_game_end` - Game finished

### Frontend - Console Quiz View

- [ ] **[Frontend]** Create `QuizConsoleView` component with states:
  - [ ] Instructions state - Game rules
  - [ ] Question state - Display question and options
  - [ ] Waiting state - "Waiting for answers..."
  - [ ] Answer reveal state - Highlight correct answer
  - [ ] Scoreboard state - Show player rankings
  - [ ] End state - Final results
- [ ] **[Frontend]** Create `QuizQuestion` component:
  - [ ] Large question text
  - [ ] 4 answer options displayed prominently
  - [ ] Timer bar showing remaining time
  - [ ] Player answer indicators (who answered)
- [ ] **[Frontend]** Create `QuizScoreboard` component:
  - [ ] Leaderboard with player rankings
  - [ ] Score deltas (+points earned)
  - [ ] Animated transitions
- [ ] **[Frontend]** Add sound effects:
  - [ ] Question start sound
  - [ ] Countdown tick
  - [ ] Answer submitted sound
  - [ ] Correct answer reveal
  - [ ] Score update sound

### Frontend - Controller Quiz View

- [ ] **[Frontend]** Create `QuizControllerView` component
- [ ] **[Frontend]** Create controller layout with 4 answer buttons
- [ ] **[Frontend]** Implement button states:
  - [ ] Active (can tap)
  - [ ] Selected (player's choice)
  - [ ] Correct (after reveal)
  - [ ] Incorrect (after reveal)
  - [ ] Disabled (after answering or time up)
- [ ] **[Frontend]** Show player's current score
- [ ] **[Frontend]** Show question number (e.g., "Question 3/10")
- [ ] **[Frontend]** Add haptic feedback on answer selection
- [ ] **[Frontend]** Show waiting screen between questions

### Game Configuration

- [ ] **[Backend]** Define quiz game config schema:
  - [ ] `questionCount` (default: 10)
  - [ ] `timePerQuestion` (default: 20 seconds)
  - [ ] `categories` (which question categories to include)
  - [ ] `difficulty` (easy, medium, hard, mixed)
- [ ] **[Frontend]** Allow host to configure game settings before start
- [ ] **[Frontend]** Create settings UI in lobby

### Shared Types

- [ ] **[Types]** Define `QuizQuestion` type
- [ ] **[Types]** Define `QuizGameState` type
- [ ] **[Types]** Define quiz-specific event payloads
- [ ] **[Types]** Define `QuizConfig` type

### Testing

- [ ] **[Backend]** Write unit tests for QuizGameEngine
- [ ] **[Backend]** Test scoring calculations
- [ ] **[Backend]** Test question randomization
- [ ] **[Backend]** Test timer functionality
- [ ] **[Frontend]** Test quiz console view rendering
- [ ] **[Frontend]** Test quiz controller interactions
- [ ] **[Integration]** Full game playthrough test with multiple players

### Verification

- [ ] **[QA]** Play complete game with 4 players
- [ ] **[QA]** Verify all players can answer questions
- [ ] **[QA]** Verify timer works correctly
- [ ] **[QA]** Verify scoring is accurate
- [ ] **[QA]** Verify answer reveal shows correct answer
- [ ] **[QA]** Verify final scoreboard displays correctly
- [ ] **[QA]** Test edge cases (no answers, all wrong answers, ties)

---

## M1.0.0: MVP Polish & Production Deployment

**Goal:** Polish the platform for public release with one complete game and essential features.

### UI/UX Polish - Console

- [ ] **[Frontend]** Implement consistent design system:
  - [ ] Define color palette
  - [ ] Define typography scale
  - [ ] Define spacing system
  - [ ] Define component styles
- [ ] **[Frontend]** Create reusable UI components library
- [ ] **[Frontend]** Add page transitions and animations
- [ ] **[Frontend]** Improve lobby UI with better player cards
- [ ] **[Frontend]** Add loading states for all async operations
- [ ] **[Frontend]** Add error boundaries for graceful error handling
- [ ] **[Frontend]** Ensure big-screen readability (test from 3+ meters away)
- [ ] **[Frontend]** Add keyboard navigation support
- [ ] **[Frontend]** Implement responsive design for various screen sizes

### UI/UX Polish - Controller

- [ ] **[Frontend]** Ensure all touch targets are 44x44px minimum
- [ ] **[Frontend]** Add haptic feedback throughout (where supported)
- [ ] **[Frontend]** Optimize for one-handed use
- [ ] **[Frontend]** Add smooth transitions between views
- [ ] **[Frontend]** Prevent accidental zooming and scrolling
- [ ] **[Frontend]** Add "fullscreen" mode prompt
- [ ] **[Frontend]** Test on various device sizes (small phones to tablets)

### Audio System

- [ ] **[Frontend]** Create audio manager for sound effects
- [ ] **[Frontend]** Add background music system with volume control
- [ ] **[Frontend]** Create/source sound effects:
  - [ ] Player joined
  - [ ] Game start countdown
  - [ ] Button press
  - [ ] Correct answer
  - [ ] Wrong answer
  - [ ] Victory fanfare
- [ ] **[Frontend]** Implement user preference for audio on/off
- [ ] **[Frontend]** Implement audio autoplay handling (browser restrictions)

### Performance Optimization

- [ ] **[Frontend]** Implement code splitting for routes
- [ ] **[Frontend]** Lazy load game components
- [ ] **[Frontend]** Optimize images (WebP format, responsive sizes)
- [ ] **[Frontend]** Implement CDN for static assets
- [ ] **[Frontend]** Add service worker for offline support
- [ ] **[Backend]** Implement Redis caching for frequently accessed data
- [ ] **[Backend]** Optimize database queries with proper indexes
- [ ] **[Backend]** Add database connection pooling
- [ ] **[Backend]** Implement rate limiting on all endpoints

### Error Handling & Edge Cases

- [ ] **[Frontend]** Handle network disconnections gracefully
- [ ] **[Frontend]** Implement offline detection with UI feedback
- [ ] **[Frontend]** Add retry logic for failed API calls
- [ ] **[Frontend]** Show helpful error messages (not technical jargon)
- [ ] **[Backend]** Implement comprehensive error logging
- [ ] **[Backend]** Add health check endpoints for monitoring
- [ ] **[Backend]** Handle duplicate session codes (regenerate)
- [ ] **[Backend]** Handle session expiration edge cases

### Security Hardening

- [ ] **[Backend]** Implement rate limiting on session join (prevent code brute-force)
- [ ] **[Backend]** Add CSRF protection
- [ ] **[Backend]** Sanitize all user inputs
- [ ] **[Backend]** Implement helmet.js for security headers
- [ ] **[Backend]** Set up CORS properly for production domains
- [ ] **[Backend]** Enable HTTPS only in production
- [ ] **[Backend]** Implement session code entropy analysis (ensure randomness)
- [ ] **[Backend]** Add IP-based rate limiting for abuse prevention
- [ ] **[Infra]** Set up environment variable validation
- [ ] **[Infra]** Ensure no secrets in codebase (use env vars)

### Analytics & Monitoring

- [ ] **[Backend]** Integrate logging service (Winston/Pino)
- [ ] **[Backend]** Log all critical events (session created, game started, errors)
- [ ] **[Backend]** Set up error tracking (Sentry or similar)
- [ ] **[Frontend]** Integrate privacy-friendly analytics (Plausible or similar)
- [ ] **[Frontend]** Track key metrics:
  - [ ] Sessions created
  - [ ] Players joined
  - [ ] Games played
  - [ ] Average session duration
- [ ] **[Infra]** Set up uptime monitoring
- [ ] **[Infra]** Set up performance monitoring (response times, WebSocket latency)

### Testing & QA

- [ ] **[QA]** Cross-browser testing:
  - [ ] Chrome (desktop & mobile)
  - [ ] Firefox (desktop & mobile)
  - [ ] Safari (desktop & iOS)
  - [ ] Edge (desktop)
- [ ] **[QA]** Device testing:
  - [ ] iOS (iPhone 12+, iPad)
  - [ ] Android (Samsung, Pixel)
  - [ ] Desktop (Windows, Mac, Linux)
- [ ] **[QA]** Network condition testing:
  - [ ] Fast WiFi
  - [ ] Slow 3G
  - [ ] Intermittent connection
- [ ] **[QA]** Load testing:
  - [ ] 10 concurrent sessions
  - [ ] 8 players per session
  - [ ] Multiple games running simultaneously
- [ ] **[QA]** Conduct user acceptance testing with real users
- [ ] **[QA]** Create test plan document
- [ ] **[QA]** Execute full regression testing

### Documentation

- [ ] **[Docs]** Update README with:
  - [ ] Clear project description
  - [ ] Prerequisites
  - [ ] Installation instructions
  - [ ] Running locally
  - [ ] Environment variables guide
- [ ] **[Docs]** Create API documentation (Swagger/OpenAPI)
- [ ] **[Docs]** Document WebSocket events
- [ ] **[Docs]** Create deployment guide
- [ ] **[Docs]** Create troubleshooting guide
- [ ] **[Docs]** Add code comments for complex logic
- [ ] **[Frontend]** Create in-app help/FAQ page
- [ ] **[Frontend]** Add tooltips and onboarding hints

### Legal & Compliance

- [ ] **[Frontend]** Create Privacy Policy page
- [ ] **[Frontend]** Create Terms of Service page
- [ ] **[Frontend]** Add cookie consent banner (if using cookies)
- [ ] **[Frontend]** Add GDPR compliance features (if targeting EU)
- [ ] **[Docs]** Create LICENSE file
- [ ] **[Docs]** Ensure all third-party licenses are documented

### Production Infrastructure

- [ ] **[Infra]** Provision production Supabase database
- [ ] **[Infra]** Set up Redis instance (Upstash or managed Redis)
- [ ] **[Infra]** Configure production environment variables
- [ ] **[Infra]** Set up SSL certificates
- [ ] **[Infra]** Configure CDN for static assets
- [ ] **[Infra]** Set up automated backups for database

### Deployment - Frontend (Vercel)

- [ ] **[Infra]** Connect GitHub repository to Vercel
- [ ] **[Infra]** Configure build settings for Next.js app
- [ ] **[Infra]** Set production environment variables in Vercel
- [ ] **[Infra]** Configure custom domain (if available)
- [ ] **[Infra]** Enable Vercel Analytics
- [ ] **[Infra]** Set up preview deployments for PRs
- [ ] **[Infra]** Test production build deployment

### Deployment - Backend (Railway/Fly.io)

- [ ] **[Infra]** Create production project on hosting platform
- [ ] **[Infra]** Configure Dockerfile for NestJS app
- [ ] **[Infra]** Set production environment variables
- [ ] **[Infra]** Configure WebSocket support
- [ ] **[Infra]** Set up auto-scaling rules
- [ ] **[Infra]** Configure health checks
- [ ] **[Infra]** Test production deployment
- [ ] **[Infra]** Set up CI/CD pipeline for automatic deployments

### Final Verification

- [ ] **[QA]** Full end-to-end test in production environment
- [ ] **[QA]** Verify all environment variables are set correctly
- [ ] **[QA]** Test session creation in production
- [ ] **[QA]** Test player joining in production
- [ ] **[QA]** Play complete game in production
- [ ] **[QA]** Verify WebSocket connections work
- [ ] **[QA]** Check error tracking is working
- [ ] **[QA]** Verify analytics are being recorded
- [ ] **[QA]** Test on real devices (not just emulators)
- [ ] **[QA]** Conduct final security audit

### Launch Preparation

- [ ] **[Marketing]** Prepare launch announcement
- [ ] **[Marketing]** Create demo video/GIF
- [ ] **[Marketing]** Prepare social media posts
- [ ] **[Docs]** Finalize user documentation
- [ ] **[Docs]** Create "Known Issues" document
- [ ] **[Ops]** Set up incident response plan
- [ ] **[Ops]** Set up monitoring alerts
- [ ] **[Ops]** Prepare rollback plan

---

## M1.1.0: Second Game - "Speed Tap"

**Goal:** Add a second game to demonstrate platform versatility and reusable game engine patterns.

### Game Design

- [ ] **[Planning]** Define Speed Tap game concept:
  - [ ] Fast-paced button tapping competition
  - [ ] Multiple rounds with different challenges
  - [ ] Simple mechanic: tap as fast as possible
- [ ] **[Planning]** Design game modes:
  - [ ] Mode 1: Tap Race (most taps in 10 seconds)
  - [ ] Mode 2: Precision Taps (tap exactly on beat)
  - [ ] Mode 3: Simon Says (tap only when prompted)
- [ ] **[Planning]** Design controller layout (single large tap button)
- [ ] **[Planning]** Design console views for each mode

### Speed Tap Game Engine

- [ ] **[Backend]** Create `SpeedTapGameEngine` extending `GameEngine`
- [ ] **[Backend]** Implement game initialization with mode selection
- [ ] **[Backend]** Implement tap counting and validation
- [ ] **[Backend]** Implement round timer system
- [ ] **[Backend]** Implement scoring for each mode
- [ ] **[Backend]** Implement cheat detection (impossibly fast taps)
- [ ] **[Backend]** Handle WebSocket `tap` event from controllers

### Frontend - Console Speed Tap View

- [ ] **[Frontend]** Create `SpeedTapConsoleView` component
- [ ] **[Frontend]** Display real-time tap counters for all players
- [ ] **[Frontend]** Create animated tap visualizations
- [ ] **[Frontend]** Add timer with visual countdown
- [ ] **[Frontend]** Create scoreboard with rankings
- [ ] **[Frontend]** Add sound effects for taps and round completion

### Frontend - Controller Speed Tap View

- [ ] **[Frontend]** Create `SpeedTapControllerView` component
- [ ] **[Frontend]** Design large, responsive tap button
- [ ] **[Frontend]** Add tap counter display
- [ ] **[Frontend]** Implement haptic feedback on tap
- [ ] **[Frontend]** Add visual feedback (button press animation)
- [ ] **[Frontend]** Prevent double-tap issues

### Testing & Verification

- [ ] **[Backend]** Write unit tests for SpeedTapGameEngine
- [ ] **[Integration]** Test with multiple players
- [ ] **[QA]** Verify tap accuracy and responsiveness
- [ ] **[QA]** Test cheat detection
- [ ] **[QA]** Verify scoring is fair across devices
- [ ] **[QA]** Test on various device types (different touch response)

---

## M1.2.0: Premium Features & Subscription System

**Goal:** Implement premium game access and subscription payment flow.

### Database Schema for Subscriptions

- [ ] **[Database]** Define `Subscription` model:
  - [ ] `id`, `userId`, `plan` (FREE, PREMIUM)
  - [ ] `status` (ACTIVE, CANCELED, EXPIRED)
  - [ ] `startDate`, `endDate`
  - [ ] `paymentProvider`, `providerSubscriptionId`
- [ ] **[Database]** Define `Payment` model for transaction history
- [ ] **[Database]** Run migration

### Payment Integration (Stripe)

- [ ] **[Backend]** Set up Stripe account
- [ ] **[Backend]** Install `@stripe/stripe-js` and `stripe` packages
- [ ] **[Backend]** Create `PaymentModule` with Stripe integration
- [ ] **[Backend]** Implement Stripe webhook handler
- [ ] **[Backend]** Create subscription plans in Stripe dashboard
- [ ] **[Backend]** Implement subscription endpoints:
  - [ ] `POST /subscriptions/checkout` - Create Stripe checkout session
  - [ ] `POST /subscriptions/portal` - Stripe customer portal
  - [ ] `POST /webhooks/stripe` - Handle Stripe events
- [ ] **[Backend]** Implement subscription validation middleware

### Premium Game Gating

- [ ] **[Backend]** Add premium check when selecting games
- [ ] **[Backend]** Return error if non-premium user selects premium game
- [ ] **[Frontend]** Show "Premium" badge on premium games
- [ ] **[Frontend]** Show upgrade prompt when selecting premium game
- [ ] **[Frontend]** Create pricing page (`/pricing`)
- [ ] **[Frontend]** Implement checkout flow

### User Account Management

- [ ] **[Frontend]** Create `/account` page showing:
  - [ ] User profile
  - [ ] Subscription status
  - [ ] Favorite games
  - [ ] Play history
- [ ] **[Frontend]** Add "Manage Subscription" link to customer portal
- [ ] **[Backend]** Implement play history tracking
- [ ] **[Backend]** Implement favorites system

### Testing

- [ ] **[Backend]** Test Stripe webhook handling
- [ ] **[Backend]** Test subscription validation
- [ ] **[QA]** Test full payment flow (use Stripe test mode)
- [ ] **[QA]** Verify premium games are gated correctly
- [ ] **[QA]** Test subscription cancellation flow

---

## M1.3.0: Admin Dashboard & Content Management

**Goal:** Create admin interface for managing games, users, and platform analytics.

### Admin Authentication

- [ ] **[Backend]** Implement admin role checks
- [ ] **[Backend]** Create admin-only guards and decorators
- [ ] **[Frontend]** Create `/admin` login page
- [ ] **[Frontend]** Implement admin-only routes with protection

### Admin Dashboard

- [ ] **[Frontend]** Create `/admin/dashboard` with metrics:
  - [ ] Total users
  - [ ] Active sessions (live)
  - [ ] Games played (today/week/month)
  - [ ] Revenue (if premium active)
- [ ] **[Frontend]** Add charts for trends (Chart.js or Recharts)
- [ ] **[Backend]** Create admin analytics endpoints

### Game Management

- [ ] **[Frontend]** Create `/admin/games` page with game list
- [ ] **[Frontend]** Implement game CRUD:
  - [ ] Create new game
  - [ ] Edit game details
  - [ ] Upload thumbnail/cover images
  - [ ] Publish/unpublish games
  - [ ] Set featured status
- [ ] **[Backend]** Create admin game management endpoints
- [ ] **[Backend]** Implement image upload to CDN/S3
- [ ] **[Frontend]** Create form for controller config editing (JSON editor)

### User Management

- [ ] **[Frontend]** Create `/admin/users` page
- [ ] **[Frontend]** Show user list with search and filters
- [ ] **[Frontend]** View user details and play history
- [ ] **[Frontend]** Ban/unban users
- [ ] **[Backend]** Implement user moderation endpoints

### Content Moderation

- [ ] **[Backend]** Implement profanity filter for nicknames
- [ ] **[Backend]** Add reporting system (if user-generated content exists)
- [ ] **[Frontend]** Create moderation queue interface

### Testing

- [ ] **[QA]** Verify only admins can access admin routes
- [ ] **[QA]** Test game creation and publishing flow
- [ ] **[QA]** Verify metrics are accurate
- [ ] **[QA]** Test user management features

---

## M2.0.0: Enhanced Features & Platform Maturity

**Goal:** Add advanced features for better user experience and platform growth.

### User Accounts & Social Features

- [ ] **[Frontend]** Implement OAuth login (Google, Discord)
- [ ] **[Backend]** Integrate OAuth providers with Passport.js
- [ ] **[Frontend]** Allow users to save game favorites
- [ ] **[Backend]** Implement play history tracking
- [ ] **[Frontend]** Create user profile pages
- [ ] **[Frontend]** Add friend system (optional)
- [ ] **[Frontend]** Implement leaderboards (global, per-game)

### Advanced Session Features

- [ ] **[Backend]** Implement session passwords (private sessions)
- [ ] **[Frontend]** Add password input for private sessions
- [ ] **[Backend]** Implement spectator mode
- [ ] **[Frontend]** Allow users to join as spectators
- [ ] **[Backend]** Implement session replay/history
- [ ] **[Frontend]** Add voice chat integration (optional, via third-party)

### Additional Games

- [ ] **[Planning]** Design "Color Rush" racing game
- [ ] **[Backend]** Implement Color Rush game engine
- [ ] **[Frontend]** Build Color Rush views (console + controller)
- [ ] **[Planning]** Design "Draw Together" drawing game
- [ ] **[Backend]** Implement drawing game engine with canvas sync
- [ ] **[Frontend]** Build drawing game views
- [ ] **[QA]** Test all games thoroughly

### Internationalization

- [ ] **[Frontend]** Set up i18n framework (next-intl or react-i18next)
- [ ] **[Frontend]** Extract all strings to translation files
- [ ] **[Frontend]** Translate to 3-5 languages (ES, FR, DE, JP)
- [ ] **[Backend]** Support localized game content
- [ ] **[Frontend]** Add language selector

### Accessibility

- [ ] **[Frontend]** Add ARIA labels to all interactive elements
- [ ] **[Frontend]** Ensure keyboard navigation works everywhere
- [ ] **[Frontend]** Add screen reader support
- [ ] **[Frontend]** Implement high contrast mode
- [ ] **[Frontend]** Add text scaling support
- [ ] **[QA]** Test with screen readers (NVDA, VoiceOver)
- [ ] **[QA]** Test keyboard-only navigation

### Performance & Scale

- [ ] **[Backend]** Implement horizontal scaling for WebSocket servers
- [ ] **[Backend]** Add load balancing
- [ ] **[Infra]** Set up Redis cluster for session state
- [ ] **[Backend]** Implement database read replicas
- [ ] **[Infra]** Set up CDN for global asset delivery
- [ ] **[QA]** Load test with 100+ concurrent sessions

### Advanced Analytics

- [ ] **[Backend]** Track detailed gameplay metrics
- [ ] **[Backend]** Implement funnel analysis (landing → playing)
- [ ] **[Frontend]** Add event tracking for user actions
- [ ] **[Admin]** Create detailed analytics dashboards
- [ ] **[Admin]** Add A/B testing framework

---

## Future Milestones (M3.0+)

### Mobile Apps (Optional)

- React Native apps for iOS and Android
- Push notifications for game invites
- Offline game downloads

### Smart TV Apps (Optional)

- Native apps for Roku, Fire TV, Apple TV
- Voice control integration

### Game SDK

- Public SDK for third-party game developers
- Game marketplace for community-created games
- Revenue sharing model

### Advanced Game Features

- Tournament mode
- Ranked competitive play
- Seasonal events
- Daily challenges
- Achievements and badges

### Infrastructure

- Multi-region deployment
- 99.9% uptime SLA
- Advanced DDoS protection
- Auto-scaling based on traffic

---

## Milestone Completion Checklist

After each milestone, verify:

- [ ] All tasks marked as complete
- [ ] All tests passing (unit, integration, e2e)
- [ ] Code reviewed and merged to main branch
- [ ] Documentation updated
- [ ] Deployed to staging environment
- [ ] QA testing completed
- [ ] Performance benchmarks met
- [ ] Security review completed (for production milestones)
- [ ] Stakeholder demo completed
- [ ] Retrospective conducted
- [ ] Next milestone planning initiated
