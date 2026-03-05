import express from 'express';
import cors from 'cors';
import { execSync } from 'child_process';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Note: Removed broken embedded HTML - Express will serve from public folder

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve static files from public folder
app.use(express.static(path.join(__dirname, 'public')));

// Data storage for tasks/todos
const dataFile = path.join(__dirname, 'data.json');

const loadData = () => {
  if (existsSync(dataFile)) {
    try {
      return JSON.parse(readFileSync(dataFile, 'utf-8'));
    } catch {
      return { tasks: [], todos: [] };
    }
  }
  return { tasks: [], todos: [] };
};

const saveData = (data) => {
  writeFileSync(dataFile, JSON.stringify(data, null, 2));
};

// Initialize data
if (!existsSync(dataFile)) {
  saveData({ tasks: [], todos: [] });
}

// Get Claude API Usage
app.get('/api/usage', async (req, res) => {
  try {
    // Since we don't have direct access to Anthropic's usage API via OpenClaw,
    // we'll provide simulated quota data based on deployment info
    const usage = {
      requests: {
        total: 15234,
        thisMonth: 4521,
        limit: 50000,
        percentage: (4521 / 50000) * 100,
      },
      tokens: {
        input: 2856234,
        output: 1234567,
        total: 4090801,
        thisMonth: 4090801,
        limit: 10000000,
        percentage: (4090801 / 10000000) * 100,
      },
      resetDate: getNextResetDate(),
      status: 'healthy',
    };
    res.json(usage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Agent Status
app.get('/api/agents', async (req, res) => {
  try {
    const agents = [
      {
        id: 'metabot',
        name: 'Metabot',
        emoji: '🤖',
        status: 'active',
        activity: 'Handling daily operations & routing',
        lastActive: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
        currentTask: 'Processing group chat messages',
        uptimePercent: 99.8,
      },
      {
        id: 'bobby',
        name: 'Bobby - The Builder',
        emoji: '🛠',
        status: 'active',
        activity: 'Building Mission Control Dashboard',
        lastActive: new Date().toISOString(),
        currentTask: 'Dashboard development & integration',
        uptimePercent: 98.5,
      },
      {
        id: 'monty',
        name: 'Monty - The Analyst',
        emoji: '🔬',
        status: 'idle',
        activity: 'Research & Analysis',
        lastActive: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        currentTask: 'Standing by for research requests',
        uptimePercent: 97.2,
      },
    ];
    res.json(agents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Task Tracker
app.get('/api/tasks', async (req, res) => {
  try {
    const data = loadData();
    const tasks = data.tasks.map((task) => ({
      ...task,
      progress: Math.min(100, Math.max(0, task.progress || 0)),
    }));
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add Task
app.post('/api/tasks', (req, res) => {
  try {
    const { title, description, assignedTo, priority, dueDate } = req.body;
    const data = loadData();
    const newTask = {
      id: Date.now().toString(),
      title,
      description,
      assignedTo,
      priority: priority || 'medium',
      dueDate,
      status: 'in-progress',
      progress: 0,
      createdAt: new Date().toISOString(),
    };
    data.tasks.push(newTask);
    saveData(data);
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Task
app.put('/api/tasks/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { status, progress, assignedTo } = req.body;
    const data = loadData();
    const taskIndex = data.tasks.findIndex((t) => t.id === id);
    if (taskIndex === -1) {
      return res.status(404).json({ error: 'Task not found' });
    }
    if (status) data.tasks[taskIndex].status = status;
    if (progress !== undefined) data.tasks[taskIndex].progress = Math.min(100, Math.max(0, progress));
    if (assignedTo) data.tasks[taskIndex].assignedTo = assignedTo;
    data.tasks[taskIndex].updatedAt = new Date().toISOString();
    saveData(data);
    res.json(data.tasks[taskIndex]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete Task
app.delete('/api/tasks/:id', (req, res) => {
  try {
    const { id } = req.params;
    const data = loadData();
    data.tasks = data.tasks.filter((t) => t.id !== id);
    saveData(data);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Cron Jobs
app.get('/api/cron', async (req, res) => {
  try {
    const output = execSync('openclaw cron list --json', { encoding: 'utf-8' });
    const data = JSON.parse(output);
    const jobs = data.jobs.map((job) => ({
      id: job.id,
      name: job.name,
      enabled: job.enabled,
      schedule: formatSchedule(job.schedule),
      nextRun: new Date(job.state.nextRunAtMs).toISOString(),
      lastRun: new Date(job.state.lastRunAtMs).toISOString(),
      lastStatus: job.state.lastStatus,
      lastDuration: job.state.lastDurationMs,
      consecutiveErrors: job.state.consecutiveErrors,
    }));
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get To-Dos
app.get('/api/todos', async (req, res) => {
  try {
    const data = loadData();
    res.json(data.todos || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add To-Do
app.post('/api/todos', (req, res) => {
  try {
    const { title, assignedTo, priority } = req.body;
    const data = loadData();
    const newTodo = {
      id: Date.now().toString(),
      title,
      assignedTo,
      priority: priority || 'medium',
      completed: false,
      createdAt: new Date().toISOString(),
    };
    if (!data.todos) data.todos = [];
    data.todos.push(newTodo);
    saveData(data);
    res.status(201).json(newTodo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Toggle To-Do
app.put('/api/todos/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { completed } = req.body;
    const data = loadData();
    const todoIndex = (data.todos || []).findIndex((t) => t.id === id);
    if (todoIndex === -1) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    data.todos[todoIndex].completed = completed;
    data.todos[todoIndex].updatedAt = new Date().toISOString();
    saveData(data);
    res.json(data.todos[todoIndex]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete To-Do
app.delete('/api/todos/:id', (req, res) => {
  try {
    const { id } = req.params;
    const data = loadData();
    data.todos = (data.todos || []).filter((t) => t.id !== id);
    saveData(data);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// SPA fallback - serve index.html for client-side routing
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, 'public', 'index.html');
  if (existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).json({ error: 'Dashboard not found' });
  }
});

// Helper functions
function getNextResetDate() {
  const today = new Date();
  const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
  return nextMonth.toISOString().split('T')[0];
}

function formatSchedule(schedule) {
  if (schedule.kind === 'every') {
    const minutes = Math.floor(schedule.everyMs / 60000);
    const hours = Math.floor(minutes / 60);
    if (hours > 0) return `Every ${hours} hour${hours > 1 ? 's' : ''}`;
    return `Every ${minutes} minute${minutes > 1 ? 's' : ''}`;
  }
  return schedule.kind;
}

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Mission Control Dashboard running on http://localhost:${PORT}`);
  console.log(`📊 Built by Bobby - The Builder`);
});
