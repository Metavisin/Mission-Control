# Architecture & Technical Design

## System Overview

```
┌─────────────────────────────────────────────────────────┐
│         Browser (Vanilla JS)                             │
│  ┌──────────────────────────────────────────────────┐   │
│  │      Single Page Application (SPA)               │   │
│  │  • Real-time dashboard UI                        │   │
│  │  • Dark mode professional design                 │   │
│  │  • Auto-refresh every 30 seconds                 │   │
│  │  • Modal forms for task/todo creation            │   │
│  └──────────────────────────────────────────────────┘   │
└────────────────────┬────────────────────────────────────┘
                     │
                  HTTP/REST
                     │
┌────────────────────▼────────────────────────────────────┐
│         Node.js/Express Backend                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │      API Routes (6 endpoints)                    │   │
│  │  ✓ /api/usage        (Claude API stats)         │   │
│  │  ✓ /api/agents       (Agent status)             │   │
│  │  ✓ /api/tasks        (CRUD operations)          │   │
│  │  ✓ /api/cron         (Scheduled jobs)           │   │
│  │  ✓ /api/todos        (CRUD operations)          │   │
│  └──────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────┐   │
│  │      Data Layer                                   │   │
│  │  ✓ JSON persistence (data.json)                 │   │
│  │  ✓ In-memory caching                             │   │
│  │  ✓ OpenClaw CLI integration                      │   │
│  └──────────────────────────────────────────────────┘   │
└────────────────┬─────────────────┬─────────────────────┘
                 │                 │
          External APIs          System
                 │                 │
    ┌────────────▼──────────┐ ┌──────▼──────────┐
    │  OpenClaw Gateway     │ │  File System    │
    │  (CLI Integration)    │ │  (data.json)    │
    │                       │ │                 │
    │  • openclaw cron      │ │  • Task store   │
    │  • Session info       │ │  • Todo store   │
    │  • Agent status       │ │  • Backups      │
    └───────────────────────┘ └─────────────────┘
```

## Data Flow

### 1. Frontend → Backend
```javascript
// User creates a task
POST /api/tasks
Content-Type: application/json
{
  "title": "Build feature X",
  "assignedTo": "Bobby",
  "priority": "high",
  "dueDate": "2026-03-10"
}
```

### 2. Backend Processing
```
1. Receive request
2. Validate input
3. Create object with ID
4. Save to data.json
5. Return 201 + object
```

### 3. Frontend Update
```javascript
// Add to DOM
// Refresh task list
// Close modal
// Show success feedback
```

## Component Architecture

### Backend (server.js)

```
server.js
├── Express Setup
│   ├── CORS middleware
│   ├── JSON parser
│   └── Static file serving
│
├── Data Layer
│   ├── loadData()     - Read data.json
│   ├── saveData()     - Write data.json
│   └── Helper functions
│
├── API Endpoints
│   ├── GET  /api/usage
│   ├── GET  /api/agents
│   ├── GET  /api/tasks
│   ├── POST /api/tasks
│   ├── PUT  /api/tasks/:id
│   ├── DELETE /api/tasks/:id
│   ├── GET  /api/cron
│   ├── GET  /api/todos
│   ├── POST /api/todos
│   ├── PUT  /api/todos/:id
│   └── DELETE /api/todos/:id
│
└── Utilities
    ├── getNextResetDate()
    └── formatSchedule()
```

### Frontend (public/index.html)

```
index.html
├── CSS (in <style> tag)
│   ├── CSS Variables (colors, spacing)
│   ├── Layout (Grid + Flexbox)
│   ├── Components (cards, forms, etc)
│   ├── Responsive design
│   └── Dark mode theme
│
├── HTML Structure
│   ├── Header
│   ├── Main grid container
│   ├── 5 Feature cards
│   ├── 2 Modals (task, todo)
│   └── Footer
│
└── JavaScript
    ├── API Integration
    │   ├── Fetch wrapper functions
    │   └── Error handling
    │
    ├── UI Components
    │   ├── renderUsage()
    │   ├── renderAgents()
    │   ├── renderTasks()
    │   ├── renderCrons()
    │   └── renderTodos()
    │
    ├── Modal Management
    │   ├── openTaskModal()
    │   ├── closeTaskModal()
    │   └── Form submission handlers
    │
    ├── CRUD Operations
    │   ├── saveTask()
    │   ├── updateTask()
    │   ├── deleteTask()
    │   └── (same for todos)
    │
    └── Lifecycle
        ├── init()           - App startup
        ├── refreshAll()     - Refresh all sections
        └── Auto-refresh (30s)
```

## Data Models

### Task Object
```json
{
  "id": "1678026234567",
  "title": "Build dashboard",
  "description": "Create monitoring dashboard",
  "assignedTo": "Bobby",
  "priority": "high",
  "status": "in-progress",
  "progress": 65,
  "dueDate": "2026-03-10",
  "createdAt": "2026-03-05T14:50:34.567Z",
  "updatedAt": "2026-03-05T15:20:00.000Z"
}
```

### Todo Object
```json
{
  "id": "1678026234568",
  "title": "Review API design",
  "assignedTo": "Monty",
  "priority": "medium",
  "completed": false,
  "createdAt": "2026-03-05T14:50:34.567Z",
  "updatedAt": "2026-03-05T15:00:00.000Z"
}
```

### Agent Object
```json
{
  "id": "metabot",
  "name": "Metabot",
  "emoji": "🤖",
  "status": "active",
  "activity": "Handling daily operations",
  "lastActive": "2026-03-05T14:55:00.000Z",
  "currentTask": "Processing messages",
  "uptimePercent": 99.8
}
```

### Cron Job Object
```json
{
  "id": "cfb3d329-8b11-4577-b170-de0813ab9a4d",
  "name": "Polymarket Paper Trader",
  "enabled": true,
  "schedule": "Every 30 minutes",
  "nextRun": "2026-03-05T15:30:00.000Z",
  "lastRun": "2026-03-05T15:00:00.000Z",
  "lastStatus": "ok",
  "lastDuration": 20233,
  "consecutiveErrors": 0
}
```

## API Specifications

### GET /api/usage
**Response:**
```json
{
  "requests": {
    "total": 15234,
    "thisMonth": 4521,
    "limit": 50000,
    "percentage": 9.04
  },
  "tokens": {
    "input": 2856234,
    "output": 1234567,
    "total": 4090801,
    "thisMonth": 4090801,
    "limit": 10000000,
    "percentage": 40.91
  },
  "resetDate": "2026-04-01",
  "status": "healthy"
}
```

### POST /api/tasks
**Request:**
```json
{
  "title": "string",
  "description": "string",
  "assignedTo": "string",
  "priority": "low|medium|high",
  "dueDate": "YYYY-MM-DD"
}
```

**Response:** 201 Created + Task object

### PUT /api/tasks/:id
**Request:**
```json
{
  "status": "string",
  "progress": 0-100,
  "assignedTo": "string"
}
```

**Response:** 200 OK + Updated task object

### DELETE /api/tasks/:id
**Response:** 204 No Content

## Performance Characteristics

### Load Times
- Initial page load: ~200ms
- Dashboard refresh: ~300ms
- Task creation: ~100ms
- Auto-refresh cycle: ~500-800ms

### Memory Usage
- Typical runtime: 30-50MB
- Data.json size: <1MB (typical)
- Browser cache: ~500KB

### API Rate Limiting
- Currently unlimited (can be added)
- Recommended: 100 requests/minute per IP

## Security Considerations

### Current Implementation
- ✅ CORS enabled (should be restricted in production)
- ✅ JSON parsing with error handling
- ✅ File permissions on data.json
- ⚠️ No authentication (recommended for production)
- ⚠️ No input validation (can be enhanced)
- ⚠️ No rate limiting (should be added)

### Recommended Additions
1. JWT or session-based auth
2. Input validation & sanitization
3. Rate limiting middleware
4. HTTPS in production
5. CORS whitelist configuration
6. Data encryption at rest

## Scalability

### Current Limits
- Single file data store (JSON)
- In-memory operations
- Single process

### To Scale:
1. **Database**: Migrate to SQLite/PostgreSQL
2. **Caching**: Add Redis for hot data
3. **Clustering**: Use PM2 or Docker
4. **Load Balancing**: Add Nginx reverse proxy
5. **Microservices**: Split into separate services

## Integration Points

### OpenClaw CLI
```bash
# Used for real-time cron data
openclaw cron list --json

# Could be extended for:
- Session monitoring
- Log aggregation
- Agent health checks
```

### Anthropic API (Optional Future)
```
GET https://api.anthropic.com/usage
# For real-time API usage instead of simulated
```

## File Structure

```
mission-control-dashboard/
├── server.js                 # Main backend (7970 bytes)
├── public/
│   └── index.html            # Complete frontend SPA (32KB)
├── data.json                 # Persistent data store
├── package.json              # Dependencies
├── .gitignore               # Git exclusions
├── .env.example             # Configuration template
├── README.md                # Documentation
├── QUICKSTART.md            # Quick setup guide
├── DEPLOYMENT.md            # Production guide
├── ARCHITECTURE.md          # This file
└── start.sh                 # Launch script
```

## Development Workflow

### Adding a New Feature

1. **Plan the API**
   - Create endpoint in server.js
   - Define request/response format
   - Add error handling

2. **Implement Backend**
   - Add route handler
   - Implement logic
   - Test with curl/Postman

3. **Build Frontend**
   - Add UI component
   - Create fetch function
   - Wire up to API

4. **Test**
   - Manual browser testing
   - Check console for errors
   - Verify data persistence

5. **Document**
   - Update README.md
   - Add API doc
   - Include screenshots

## Testing Strategy

### Manual Testing (Current)
- Browser inspection
- Console log verification
- API endpoint testing

### Recommended: Automated
- Unit tests (Jest)
- Integration tests (Supertest)
- E2E tests (Cypress)

## Monitoring & Observability

### Metrics to Track
- Request response times
- Error rates
- API usage trends
- Task completion rates
- Agent uptime percentages

### Logging
- Server startup/shutdown
- Request logging
- Error logging
- Performance metrics

## Future Enhancements

### High Priority
- [ ] WebSocket real-time updates
- [ ] Database backend (SQL)
- [ ] User authentication
- [ ] Data export (CSV/JSON)

### Medium Priority
- [ ] Email notifications
- [ ] Slack/Discord webhooks
- [ ] Advanced analytics
- [ ] Multi-tenant support

### Low Priority
- [ ] Mobile app
- [ ] AI-powered suggestions
- [ ] Video streaming
- [ ] AR visualization

---

**Built with ❤️ by Bobby - The Builder**
