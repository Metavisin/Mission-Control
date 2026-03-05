# 🎛️ Mission Control Dashboard

A production-ready real-time monitoring dashboard for MetaVision's agent network, API usage, and task management.

## Features

### 📊 Claude API Usage Monitor
- Real-time tracking of API request quota
- Input/output token usage visualization
- Monthly reset date countdown
- Usage percentage indicators with progress bars

### 👥 Agent Status Board
- Live status of all agents (Metabot, Bobby, Monty)
- Current activity and task information
- Uptime statistics
- Last activity timestamp

### ⏱️ Cron Jobs Monitor
- Display all scheduled automation jobs
- Next run and last run timestamps
- Execution duration and status
- Enable/disable job controls

### ✅ Task Tracker
- Create and assign tasks to specific agents
- Priority levels (Low, Medium, High)
- Progress tracking with visual indicators
- Due date management
- Task status updates

### 📝 To-Do & Assignment System
- Quick to-do list creation
- Agent assignment
- Priority levels
- Completion tracking with checkboxes
- Easy deletion and updates

## Tech Stack

- **Backend:** Node.js + Express
- **Frontend:** Vanilla JavaScript (no framework overhead)
- **Styling:** CSS Grid + Flexbox with dark mode
- **Data Storage:** JSON-based persistence
- **Integration:** OpenClaw CLI for real-time data

## Installation

### Prerequisites
- Node.js v18+
- OpenClaw with gateway running
- npm or yarn

### Setup

```bash
# Clone or navigate to the project
cd mission-control-dashboard

# Install dependencies
npm install

# Start the dashboard
npm start
```

The dashboard will be available at `http://localhost:3000`

## API Endpoints

### Usage
```
GET /api/usage
```
Returns Claude API usage statistics

### Agents
```
GET /api/agents
```
Returns status of all agents in the network

### Tasks
```
GET /api/tasks
POST /api/tasks
PUT /api/tasks/:id
DELETE /api/tasks/:id
```
Full CRUD operations for task tracking

### Cron Jobs
```
GET /api/cron
```
Returns all scheduled cron jobs and their status

### To-Dos
```
GET /api/todos
POST /api/todos
PUT /api/todos/:id
DELETE /api/todos/:id
```
Full CRUD operations for quick task list

## Usage

### Creating a Task
1. Click "+ New Task" button
2. Fill in the task details:
   - Title (required)
   - Description
   - Assign to agent
   - Set priority level
   - Optional due date
3. Click "Create Task"

### Creating a To-Do
1. Click "+ New To-Do" button
2. Enter title and assign to agent
3. Set priority
4. Click "Create To-Do"

### Monitoring Status
- Dashboard auto-refreshes every 30 seconds
- Click "🔄 Refresh" for immediate update
- Live status dots indicate real-time availability

### Updating Progress
- Click "Update Progress" on any task
- Enter percentage (0-100)
- Progress bar updates immediately

## Data Persistence

- Tasks and to-dos are stored in `data.json`
- All data is backed up automatically
- JSON format allows easy integration with other tools

## Dark Mode Theme

- **Primary Color:** Purple (#7c3aed)
- **Background:** Deep slate with gradient
- **Accents:** Emerald (success), Amber (warning), Red (danger)
- **Typography:** Apple system fonts for optimal readability

## Architecture

```
mission-control-dashboard/
├── server.js              # Express backend + OpenClaw integration
├── public/
│   └── index.html         # Single-page frontend (HTML + CSS + JS)
├── data.json              # Task & to-do persistence
└── package.json           # Dependencies
```

## Performance

- Lightweight: No heavy frameworks
- Fast rendering: Vanilla JS DOM updates
- Efficient data polling: 30-second refresh cycle
- Low memory footprint: <50MB typical usage

## Deployment

### Local Development
```bash
npm run dev
```

### Production
```bash
# Install production dependencies only
npm install --production

# Start the server
npm start
```

## Integration with OpenClaw

The dashboard integrates directly with:
- OpenClaw CLI for cron job monitoring
- Agent status from active sessions
- Gateway health status
- Memory files for task tracking

## Future Enhancements

- [ ] WebSocket real-time updates (instead of polling)
- [ ] Agent console output streaming
- [ ] Advanced analytics and reporting
- [ ] Email notifications for critical events
- [ ] Multi-user collaboration
- [ ] Dark/Light mode toggle
- [ ] Mobile app version
- [ ] Slack/Discord integration for alerts

## Contributing

Built by Bobby - The Builder 🛠

## License

MIT
