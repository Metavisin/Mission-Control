# Quick Start Guide 🚀

## 30-Second Setup

```bash
# 1. Navigate to the project
cd /Users/metavision/.openclaw/workspace/mission-control-dashboard

# 2. Install dependencies
npm install

# 3. Start the dashboard
npm start
```

**Done!** Open http://localhost:3000 in your browser.

## What You'll See

### Dashboard Sections

1. **📊 Claude API Usage** (top-left)
   - Monthly token and request tracking
   - Usage percentage indicators
   - Next reset date

2. **👥 Agent Status Board** (top-right)
   - Metabot 🤖 - Main coordinator
   - Bobby 🛠 - Builder/Developer
   - Monty 🔬 - Research/Analysis
   - Real-time activity and uptime

3. **⏱️ Cron Jobs Monitor** (middle, full-width)
   - Polymarket Paper Trader (30-min intervals)
   - Last run status and duration
   - Next scheduled execution

4. **✅ Task Tracker** (bottom-left)
   - Create tasks and assign to agents
   - Track progress 0-100%
   - Set priorities and due dates
   - + New Task button

5. **📝 To-Do List** (bottom-right)
   - Quick assignments
   - Checkbox completion
   - Priority levels
   - + New To-Do button

## Common Tasks

### Create a Task
1. Click **+ New Task**
2. Fill in details:
   - Title: "e.g., Review code PR"
   - Description: (optional)
   - Assign to: Select agent (Metabot, Bobby, or Monty)
   - Priority: Low/Medium/High
   - Due Date: (optional)
3. Click **Create Task**

### Create a To-Do
1. Click **+ New To-Do**
2. Enter title and agent
3. Set priority
4. Done!

### Update Task Progress
1. Find the task
2. Click **Update Progress**
3. Enter 0-100
4. Task bar updates instantly

### Monitor Cron Jobs
- Dashboard shows all scheduled jobs
- Displays next run time and last run status
- Duration helps identify performance issues

### Check API Usage
- View monthly quota percentage
- See token usage breakdown
- Know when quota resets

## Auto-Refresh

Dashboard refreshes every 30 seconds automatically.
Click **🔄 Refresh** for instant update.

## Data Persistence

- All tasks and to-dos saved to `data.json`
- Survives server restarts
- Human-readable JSON format

## Keyboard Shortcuts (Coming Soon)

| Key | Action |
|-----|--------|
| `N` | New Task |
| `T` | New To-Do |
| `R` | Refresh |
| `ESC` | Close Modal |

## Troubleshooting

### Port 3000 already in use?
```bash
# Kill the process
lsof -i :3000
kill -9 <PID>
```

### Dependencies not installed?
```bash
rm -rf node_modules
npm install
```

### Dashboard not loading?
```bash
# Check if server is running
curl http://localhost:3000

# Check logs
tail -f server.log
```

### OpenClaw not found?
```bash
# Make sure OpenClaw gateway is running
openclaw gateway status

# If not running, start it
openclaw gateway start
```

## Next Steps

1. **Start creating tasks** for your agents
2. **Monitor cron jobs** as they run
3. **Track API usage** to avoid overages
4. **Assign to-dos** to keep everyone on track

## Need Help?

Check the full documentation:
- `README.md` - Feature overview
- `DEPLOYMENT.md` - Production setup
- `server.js` - Backend source
- `public/index.html` - Frontend source

---

Built by Bobby - The Builder 🛠
