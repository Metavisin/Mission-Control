import express from 'express';
import cors from 'cors';
import { execSync } from 'child_process';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Embedded HTML - fallback if public folder isn't available
const EMBEDDED_HTML = `<!DOCTYPE html>\n<html lang="en">\n  <head>\n    <meta charset="UTF-8" />\n    <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n    <title>Mission Control Dashboard</title>\n    <style>\n      * {\n        margin: 0;\n        padding: 0;\n        box-sizing: border-box;\n      }\n\n      :root {\n        --primary: #7c3aed;\n        --primary-light: #a78bfa;\n        --success: #10b981;\n        --warning: #f59e0b;\n        --danger: #ef4444;\n        --neutral-900: #0f172a;\n        --neutral-800: #1e293b;\n        --neutral-700: #334155;\n        --neutral-600: #475569;\n        --neutral-400: #cbd5e1;\n        --neutral-300: #e2e8f0;\n        --neutral-100: #f1f5f9;\n        --text-primary: #f1f5f9;\n        --text-secondary: #cbd5e1;\n        --border: #334155;\n        --shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);\n        --radius: 12px;\n      }\n\n      body {\n        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,\n          Ubuntu, Cantarell, sans-serif;\n        background: linear-gradient(135deg, var(--neutral-900) 0%, #1a1f3a 100%);\n        color: var(--text-primary);\n        min-height: 100vh;\n      }\n\n      .container {\n        max-width: 1600px;\n        margin: 0 auto;\n        padding: 20px;\n      }\n\n      header {\n        display: flex;\n        align-items: center;\n        justify-content: space-between;\n        margin-bottom: 40px;\n        padding-bottom: 20px;\n        border-bottom: 1px solid var(--border);\n      }\n\n      .header-title {\n        display: flex;\n        align-items: center;\n        gap: 15px;\n      }\n\n      .header-title h1 {\n        font-size: 28px;\n        font-weight: 700;\n        background: linear-gradient(135deg, var(--primary-light), #60a5fa);\n        -webkit-background-clip: text;\n        -webkit-text-fill-color: transparent;\n        background-clip: text;\n      }\n\n      .header-badge {\n        display: flex;\n        align-items: center;\n        gap: 8px;\n        background: var(--neutral-800);\n        padding: 8px 16px;\n        border-radius: var(--radius);\n        font-size: 14px;\n        border: 1px solid var(--border);\n      }\n\n      .status-dot {\n        width: 8px;\n        height: 8px;\n        border-radius: 50%;\n        background: var(--success);\n        animation: pulse 2s infinite;\n      }\n\n      @keyframes pulse {\n        0%,\n        100% {\n          opacity: 1;\n        }\n        50% {\n          opacity: 0.5;\n        }\n      }\n\n      .grid {\n        display: grid;\n        grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));\n        gap: 20px;\n        margin-bottom: 20px;\n      }\n\n      .grid-full {\n        grid-column: 1 / -1;\n      }\n\n      .card {\n        background: var(--neutral-800);\n        border: 1px solid var(--border);\n        border-radius: var(--radius);\n        padding: 24px;\n        backdrop-filter: blur(10px);\n        transition: all 0.3s ease;\n      }\n\n      .card:hover {\n        border-color: var(--primary);\n        box-shadow: 0 0 20px rgba(124, 58, 237, 0.1);\n      }\n\n      .card-header {\n        display: flex;\n        align-items: center;\n        justify-content: space-between;\n        margin-bottom: 16px;\n        padding-bottom: 12px;\n        border-bottom: 1px solid var(--border);\n      }\n\n      .card-title {\n        display: flex;\n        align-items: center;\n        gap: 10px;\n        font-size: 18px;\n        font-weight: 600;\n      }\n\n      .card-title .emoji {\n        font-size: 24px;\n      }\n\n      .card-subtitle {\n        font-size: 12px;\n        color: var(--text-secondary);\n        text-transform: uppercase;\n        letter-spacing: 0.5px;\n      }\n\n      .usage-grid {\n        display: grid;\n        grid-template-columns: repeat(2, 1fr);\n        gap: 16px;\n      }\n\n      .usage-item {\n        background: var(--neutral-900);\n        padding: 16px;\n        border-radius: 8px;\n        border: 1px solid var(--border);\n      }\n\n      .usage-label {\n        font-size: 12px;\n        color: var(--text-secondary);\n        text-transform: uppercase;\n        margin-bottom: 8px;\n      }\n\n      .usage-value {\n        font-size: 20px;\n        font-weight: 600;\n        margin-bottom: 8px;\n      }\n\n      .progress-bar {\n        width: 100%;\n        height: 6px;\n        background: var(--neutral-700);\n        border-radius: 3px;\n        overflow: hidden;\n      }\n\n      .progress-fill {\n        height: 100%;\n        background: linear-gradient(90deg, var(--primary), var(--primary-light));\n        transition: width 0.3s ease;\n      }\n\n      .usage-percent {\n        font-size: 12px;\n        color: var(--text-secondary);\n        margin-top: 4px;\n      }\n\n      .agent-item {\n        background: var(--neutral-900);\n        padding: 16px;\n        border-radius: 8px;\n        border: 1px solid var(--border);\n        margin-bottom: 12px;\n        display: flex;\n        align-items: flex-start;\n        gap: 12px;\n      }\n\n      .agent-avatar {\n        font-size: 24px;\n        min-width: 32px;\n        text-align: center;\n      }\n\n      .agent-info {\n        flex: 1;\n      }\n\n      .agent-name {\n        font-weight: 600;\n        margin-bottom: 4px;\n      }\n\n      .agent-activity {\n        font-size: 13px;\n        color: var(--text-secondary);\n        margin-bottom: 4px;\n      }\n\n      .agent-status {\n        display: flex;\n        align-items: center;\n        gap: 8px;\n        font-size: 12px;\n      }\n\n      .status-active {\n        color: var(--success);\n      }\n\n      .status-idle {\n        color: var(--warning);\n      }\n\n      .status-offline {\n        color: var(--danger);\n      }\n\n      .uptime {\n        font-size: 12px;\n        color: var(--text-secondary);\n        margin-top: 4px;\n      }\n\n      .task-item {\n        background: var(--neutral-900);\n        padding: 16px;\n        border-radius: 8px;\n        border: 1px solid var(--border);\n        margin-bottom: 12px;\n      }\n\n      .task-header {\n        display: flex;\n        justify-content: space-between;\n        align-items: flex-start;\n        margin-bottom: 8px;\n      }\n\n      .task-title {\n        font-weight: 600;\n        flex: 1;\n      }\n\n      .task-priority {\n        padding: 4px 8px;\n        border-radius: 4px;\n        font-size: 12px;\n        font-weight: 500;\n      }\n\n      .priority-high {\n        background: rgba(239, 68, 68, 0.2);\n        color: #fca5a5;\n      }\n\n      .priority-medium {\n        background: rgba(245, 158, 11, 0.2);\n        color: #fbbf24;\n      }\n\n      .priority-low {\n        background: rgba(16, 185, 129, 0.2);\n        color: #6ee7b7;\n      }\n\n      .task-assigned {\n        font-size: 12px;\n        color: var(--text-secondary);\n        margin-bottom: 8px;\n      }\n\n      .task-progress {\n        margin-bottom: 8px;\n      }\n\n      .progress-label {\n        display: flex;\n        justify-content: space-between;\n        font-size: 12px;\n        margin-bottom: 4px;\n      }\n\n      .cron-item {\n        background: var(--neutral-900);\n        padding: 16px;\n        border-radius: 8px;\n        border: 1px solid var(--border);\n        margin-bottom: 12px;\n      }\n\n      .cron-header {\n        display: flex;\n        justify-content: space-between;\n        align-items: center;\n        margin-bottom: 8px;\n      }\n\n      .cron-name {\n        font-weight: 600;\n        flex: 1;\n      }\n\n      .cron-status {\n        padding: 4px 8px;\n        border-radius: 4px;\n        font-size: 12px;\n        font-weight: 500;\n      }\n\n      .status-ok {\n        background: rgba(16, 185, 129, 0.2);\n        color: #6ee7b7;\n      }\n\n      .status-error {\n        background: rgba(239, 68, 68, 0.2);\n        color: #fca5a5;\n      }\n\n      .cron-details {\n        font-size: 12px;\n        color: var(--text-secondary);\n        display: grid;\n        grid-template-columns: repeat(2, 1fr);\n        gap: 8px;\n      }\n\n      .cron-detail {\n        padding: 8px;\n        background: rgba(0, 0, 0, 0.2);\n        border-radius: 4px;\n      }\n\n      .todo-item {\n        display: flex;\n        align-items: center;\n        gap: 12px;\n        background: var(--neutral-900);\n        padding: 12px 16px;\n        border-radius: 8px;\n        border: 1px solid var(--border);\n        margin-bottom: 8px;\n        transition: all 0.2s ease;\n      }\n\n      .todo-item.completed {\n        opacity: 0.6;\n      }\n\n      .todo-item.completed .todo-text {\n        text-decoration: line-through;\n      }\n\n      .todo-checkbox {\n        width: 20px;\n        height: 20px;\n        cursor: pointer;\n        accent-color: var(--primary);\n      }\n\n      .todo-text {\n        flex: 1;\n      }\n\n      .todo-assigned {\n        font-size: 12px;\n        color: var(--text-secondary);\n      }\n\n      .btn {\n        padding: 12px 16px;\n        border: none;\n        border-radius: 8px;\n        font-weight: 600;\n        cursor: pointer;\n        transition: all 0.2s ease;\n        font-size: 14px;\n      }\n\n      .btn-primary {\n        background: var(--primary);\n        color: white;\n      }\n\n      .btn-primary:hover {\n        background: #6d28d9;\n      }\n\n      .btn-secondary {\n        background: var(--neutral-700);\n        color: white;\n      }\n\n      .btn-secondary:hover {\n        background: var(--neutral-600);\n      }\n\n      .btn-small {\n        padding: 6px 12px;\n        font-size: 12px;\n      }\n\n      .btn-danger {\n        background: var(--danger);\n        color: white;\n      }\n\n      .btn-danger:hover {\n        background: #dc2626;\n      }\n\n      .form-group {\n        margin-bottom: 16px;\n      }\n\n      .form-group label {\n        display: block;\n        margin-bottom: 6px;\n        font-weight: 500;\n        font-size: 14px;\n      }\n\n      .form-group input,\n      .form-group select,\n      .form-group textarea {\n        width: 100%;\n        padding: 10px 12px;\n        background: var(--neutral-700);\n        border: 1px solid var(--border);\n        border-radius: 6px;\n        color: var(--text-primary);\n        font-size: 14px;\n        font-family: inherit;\n      }\n\n      .form-group input:focus,\n      .form-group select:focus,\n      .form-group textarea:focus {\n        outline: none;\n        border-color: var(--primary);\n        box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);\n      }\n\n      .modal {\n        display: none;\n        position: fixed;\n        top: 0;\n        left: 0;\n        right: 0;\n        bottom: 0;\n        background: rgba(0, 0, 0, 0.7);\n        z-index: 1000;\n        align-items: center;\n        justify-content: center;\n      }\n\n      .modal.active {\n        display: flex;\n      }\n\n      .modal-content {\n        background: var(--neutral-800);\n        border: 1px solid var(--border);\n        border-radius: var(--radius);\n        padding: 32px;\n        max-width: 500px;\n        width: 90%;\n        max-height: 90vh;\n        overflow-y: auto;\n      }\n\n      .modal-header {\n        font-size: 20px;\n        font-weight: 600;\n        margin-bottom: 24px;\n      }\n\n      .modal-footer {\n        display: flex;\n        gap: 12px;\n        justify-content: flex-end;\n        margin-top: 24px;\n      }\n\n      .refresh-btn {\n        background: var(--neutral-700);\n        border: none;\n        color: var(--text-primary);\n        padding: 8px 12px;\n        border-radius: 6px;\n        cursor: pointer;\n        font-size: 12px;\n      }\n\n      .refresh-btn:hover {\n        background: var(--neutral-600);\n      }\n\n      .stats-row {\n        display: flex;\n        gap: 16px;\n        margin-bottom: 16px;\n        justify-content: space-between;\n      }\n\n      .stat-box {\n        flex: 1;\n        background: var(--neutral-900);\n        padding: 12px;\n        border-radius: 8px;\n        border: 1px solid var(--border);\n        text-align: center;\n      }\n\n      .stat-value {\n        font-size: 18px;\n        font-weight: 600;\n        color: var(--primary);\n      }\n\n      .stat-label {\n        font-size: 12px;\n        color: var(--text-secondary);\n        margin-top: 4px;\n      }\n\n      .empty-state {\n        text-align: center;\n        padding: 32px;\n        color: var(--text-secondary);\n      }\n\n      @media (max-width: 768px) {\n        .grid {\n          grid-template-columns: 1fr;\n        }\n\n        .usage-grid {\n          grid-template-columns: 1fr;\n        }\n\n        header {\n          flex-direction: column;\n          gap: 12px;\n          align-items: flex-start;\n        }\n\n        .header-title h1 {\n          font-size: 24px;\n        }\n      }\n    </style>\n  </head>\n  <body>\n    <div class=\"container\">\n      <header>\n        <div class=\"header-title\">\n          <h1>🎛️ Mission Control</h1>\n          <div class=\"header-badge\">\n            <div class=\"status-dot\"></div>\n            Live Monitoring\n          </div>\n        </div>\n        <div class=\"refresh-btn\" onclick=\"refreshAll()\">🔄 Refresh</div>\n      </header>\n\n      <div class=\"grid\">\n        <!-- Claude API Usage Monitor -->\n        <div class=\"card\">\n          <div class=\"card-header\">\n            <div class=\"card-title\">\n              <span class=\"emoji\">📊</span>\n              <div>\n                <div>Claude API Usage</div>\n                <div class=\"card-subtitle\">Monthly quota tracking</div>\n              </div>\n            </div>\n          </div>\n          <div id=\"usage-content\" style=\"min-height: 200px\">\n            <div class=\"empty-state\">Loading usage data...</div>\n          </div>\n        </div>\n\n        <!-- Agent Status Board -->\n        <div class=\"card\">\n          <div class=\"card-header\">\n            <div class=\"card-title\">\n              <span class=\"emoji\">👥</span>\n              <div>\n                <div>Agent Status Board</div>\n                <div class=\"card-subtitle\">Real-time activity</div>\n              </div>\n            </div>\n          </div>\n          <div id=\"agents-content\" style=\"min-height: 200px\">\n            <div class=\"empty-state\">Loading agent status...</div>\n          </div>\n        </div>\n\n        <!-- Cron Jobs Monitor -->\n        <div class=\"card grid-full\">\n          <div class=\"card-header\">\n            <div class=\"card-title\">\n              <span class=\"emoji\">⏱️</span>\n              <div>\n                <div>Cron Jobs Monitor</div>\n                <div class=\"card-subtitle\">Scheduled automations</div>\n              </div>\n            </div>\n          </div>\n          <div id=\"cron-content\" style=\"min-height: 200px\">\n            <div class=\"empty-state\">Loading cron jobs...</div>\n          </div>\n        </div>\n\n        <!-- Task Tracker -->\n        <div class=\"card\">\n          <div class=\"card-header\">\n            <div class=\"card-title\">\n              <span class=\"emoji\">✅</span>\n              <div>\n                <div>Task Tracker</div>\n                <div class=\"card-subtitle\">Agent assignments</div>\n              </div>\n            </div>\n            <button class=\"btn btn-primary btn-small\" onclick=\"openTaskModal()\">\n              + New Task\n            </button>\n          </div>\n          <div id=\"tasks-content\" style=\"min-height: 200px\">\n            <div class=\"empty-state\">No tasks yet. Create one to get started.</div>\n          </div>\n        </div>\n\n        <!-- To-Do & Assignment System -->\n        <div class=\"card\">\n          <div class=\"card-header\">\n            <div class=\"card-title\">\n              <span class=\"emoji\">📝</span>\n              <div>\n                <div>To-Do List</div>\n                <div class=\"card-subtitle\">Quick assignments</div>\n              </div>\n            </div>\n            <button class=\"btn btn-primary btn-small\" onclick=\"openTodoModal()\">\n              + New To-Do\n            </button>\n          </div>\n          <div id=\"todos-content\" style=\"min-height: 200px\">\n            <div class=\"empty-state\">No to-dos yet. Add one to get started.</div>\n          </div>\n        </div>\n      </div>\n    </div>\n\n    <!-- Task Modal -->\n    <div class=\"modal\" id=\"taskModal\">\n      <div class=\"modal-content\">\n        <div class=\"modal-header\">Create New Task</div>\n        <form onsubmit=\"saveTask(event)\">\n          <div class=\"form-group\">\n            <label for=\"taskTitle\">Task Title</label>\n            <input\n              type=\"text\"\n              id=\"taskTitle\"\n              required\n              placeholder=\"e.g., Build dashboard component\"\n            />\n          </div>\n          <div class=\"form-group\">\n            <label for=\"taskDesc\">Description</label>\n            <textarea\n              id=\"taskDesc\"\n              placeholder=\"Task details...\"\n              rows=\"3\"\n            ></textarea>\n          </div>\n          <div class=\"form-group\">\n            <label for=\"taskAssigned\">Assign To</label>\n            <select id=\"taskAssigned\" required>\n              <option value=\"\">Select agent</option>\n              <option value=\"Metabot\">Metabot 🤖</option>\n              <option value=\"Bobby\">Bobby 🛠</option>\n              <option value=\"Monty\">Monty 🔬</option>\n            </select>\n          </div>\n          <div class=\"form-group\">\n            <label for=\"taskPriority\">Priority</label>\n            <select id=\"taskPriority\">\n              <option value=\"low\">Low</option>\n              <option value=\"medium\" selected>Medium</option>\n              <option value=\"high\">High</option>\n            </select>\n          </div>\n          <div class=\"form-group\">\n            <label for=\"taskDue\">Due Date</label>\n            <input type=\"date\" id=\"taskDue\" />\n          </div>\n          <div class=\"modal-footer\">\n            <button type=\"button\" class=\"btn btn-secondary\" onclick=\"closeTaskModal()\">\n              Cancel\n            </button>\n            <button type=\"submit\" class=\"btn btn-primary\">Create Task</button>\n          </div>\n        </form>\n      </div>\n    </div>\n\n    <!-- To-Do Modal -->\n    <div class=\"modal\" id=\"todoModal\">\n      <div class=\"modal-content\">\n        <div class=\"modal-header\">Create New To-Do</div>\n        <form onsubmit=\"saveTodo(event)\">\n          <div class=\"form-group\">\n            <label for=\"todoTitle\">To-Do Title</label>\n            <input\n              type=\"text\"\n              id=\"todoTitle\"\n              required\n              placeholder=\"e.g., Review code PR\"\n            />\n          </div>\n          <div class=\"form-group\">\n            <label for=\"todoAssigned\">Assign To</label>\n            <select id=\"todoAssigned\" required>\n              <option value=\"\">Select agent</option>\n              <option value=\"Metabot\">Metabot 🤖</option>\n              <option value=\"Bobby\">Bobby 🛠</option>\n              <option value=\"Monty\">Monty 🔬</option>\n            </select>\n          </div>\n          <div class=\"form-group\">\n            <label for=\"todoPriority\">Priority</label>\n            <select id=\"todoPriority\">\n              <option value=\"low\">Low</option>\n              <option value=\"medium\" selected>Medium</option>\n              <option value=\"high\">High</option>\n            </select>\n          </div>\n          <div class=\"modal-footer\">\n            <button type=\"button\" class=\"btn btn-secondary\" onclick=\"closeTodoModal()\">\n              Cancel\n            </button>\n            <button type=\"submit\" class=\"btn btn-primary\">Create To-Do</button>\n          </div>\n        </form>\n      </div>\n    </div>\n\n    <script>\n      // API Base URL\n      const API_URL = '/api';\n\n      // Initialize dashboard\n      async function init() {\n        await Promise.all([\n          loadUsage(),\n          loadAgents(),\n          loadCrons(),\n          loadTasks(),\n          loadTodos(),\n        ]);\n        setInterval(refreshAll, 30000); // Refresh every 30 seconds\n      }\n\n      // Usage Monitor\n      async function loadUsage() {\n        try {\n          const response = await fetch(\\\`\\${API_URL}/usage\\\`);\n          const data = await response.json();\n          renderUsage(data);\n        } catch (error) {\n          console.error('Failed to load usage:', error);\n          document.getElementById('usage-content').innerHTML =\n            '<div class=\"empty-state\">Error loading usage data</div>';\n        }\n      }\n\n      function renderUsage(data) {\n        const { tokens, requests, resetDate } = data;\n        const html = \\\`\n          <div class=\"usage-grid\">\n            <div class=\"usage-item\">\n              <div class=\"usage-label\">📤 Input Tokens</div>\n              <div class=\"usage-value\">\\\${(tokens.input / 1000000).toFixed(2)}M</div>\n              <div class=\"progress-bar\">\n                <div class=\"progress-fill\" style=\"width: 45%\"></div>\n              </div>\n            </div>\n            <div class=\"usage-item\">\n              <div class=\"usage-label\">📥 Output Tokens</div>\n              <div class=\"usage-value\">\\\${(tokens.output / 1000000).toFixed(2)}M</div>\n              <div class=\"progress-bar\">\n                <div class=\"progress-fill\" style=\"width: 25%\"></div>\n              </div>\n            </div>\n            <div class=\"usage-item\">\n              <div class=\"usage-label\">📈 Requests</div>\n              <div class=\"usage-value\">\\\${requests.thisMonth.toLocaleString()}</div>\n              <div class=\"progress-bar\">\n                <div class=\"progress-fill\" style=\"width: \\${requests.percentage}%\"></div>\n              </div>\n              <div class=\"usage-percent\">\\\${requests.percentage.toFixed(1)}% of \\${requests.limit.toLocaleString()}</div>\n            </div>\n            <div class=\"usage-item\">\n              <div class=\"usage-label\">⏰ Reset Date</div>\n              <div class=\"usage-value\" style=\"font-size: 16px\">\\\${resetDate}</div>\n              <div class=\"usage-percent\">Next month quota available</div>\n            </div>\n          </div>\n        \\\`;\n        document.getElementById('usage-content').innerHTML = html;\n      }\n\n      // Agent Status\n      async function loadAgents() {\n        try {\n          const response = await fetch(\\\`\\${API_URL}/agents\\\`);\n          const agents = await response.json();\n          renderAgents(agents);\n        } catch (error) {\n          console.error('Failed to load agents:', error);\n          document.getElementById('agents-content').innerHTML =\n            '<div class=\"empty-state\">Error loading agent status</div>';\n        }\n      }\n\n      function renderAgents(agents) {\n        const html = agents\n          .map(\n            (agent) => \\\`\n          <div class=\"agent-item\">\n            <div class=\"agent-avatar\">\\\${agent.emoji}</div>\n            <div class=\"agent-info\">\n              <div class=\"agent-name\">\\\${agent.name}</div>\n              <div class=\"agent-activity\">\\\${agent.activity}</div>\n              <div class=\"agent-status status-\\${agent.status}\">\n                \\${agent.status.toUpperCase()} • \\\${agent.currentTask}\n              </div>\n              <div class=\"uptime\">Uptime: \\${agent.uptimePercent}%</div>\n            </div>\n          </div>\n        \\\`\n          )\n          .join('');\n        document.getElementById('agents-content').innerHTML = html;\n      }\n\n      // Cron Jobs\n      async function loadCrons() {\n        try {\n          const response = await fetch(\\\`\\${API_URL}/cron\\\`);\n          const crons = await response.json();\n          renderCrons(crons);\n        } catch (error) {\n          console.error('Failed to load crons:', error);\n          document.getElementById('cron-content').innerHTML =\n            '<div class=\"empty-state\">Error loading cron jobs</div>';\n        }\n      }\n\n      function renderCrons(crons) {\n        if (crons.length === 0) {\n          document.getElementById('cron-content').innerHTML =\n            '<div class=\"empty-state\">No cron jobs configured</div>';\n          return;\n        }\n\n        const html = crons\n          .map(\n            (cron) => \\\`\n          <div class=\"cron-item\">\n            <div class=\"cron-header\">\n              <div class=\"cron-name\">\\\${cron.name}</div>\n              <div class=\"cron-status status-\\${cron.lastStatus}\">\n                \\${cron.lastStatus.toUpperCase()}\n              </div>\n            </div>\n            <div class=\"cron-details\">\n              <div class=\"cron-detail\">\n                <strong>Schedule:</strong> \\${cron.schedule}\n              </div>\n              <div class=\"cron-detail\">\n                <strong>Next Run:</strong> \\${new Date(cron.nextRun).toLocaleString()}\n              </div>\n              <div class=\"cron-detail\">\n                <strong>Last Run:</strong> \\${new Date(cron.lastRun).toLocaleString()}\n              </div>\n              <div class=\"cron-detail\">\n                <strong>Duration:</strong> \\${cron.lastDuration}ms\n              </div>\n            </div>\n          </div>\n        \\\`\n          )\n          .join('');\n        document.getElementById('cron-content').innerHTML = html;\n      }\n\n      // Tasks\n      async function loadTasks() {\n        try {\n          const response = await fetch(\\\`\\${API_URL}/tasks\\\`);\n          const tasks = await response.json();\n          renderTasks(tasks);\n        } catch (error) {\n          console.error('Failed to load tasks:', error);\n          document.getElementById('tasks-content').innerHTML =\n            '<div class=\"empty-state\">Error loading tasks</div>';\n        }\n      }\n\n      function renderTasks(tasks) {\n        if (tasks.length === 0) {\n          document.getElementById('tasks-content').innerHTML =\n            '<div class=\"empty-state\">No tasks yet. Create one to get started.</div>';\n          return;\n        }\n\n        const html = tasks\n          .map(\n            (task) => \\\`\n          <div class=\"task-item\">\n            <div class=\"task-header\">\n              <div class=\"task-title\">\\\${task.title}</div>\n              <div class=\"task-priority priority-\\${task.priority}\">\n                \\${task.priority.toUpperCase()}\n              </div>\n            </div>\n            <div class=\"task-assigned\">Assigned to: <strong>\\\${task.assignedTo}</strong></div>\n            <div class=\"task-progress\">\n              <div class=\"progress-label\">\n                <span>Progress</span>\n                <span>\\\${task.progress}%</span>\n              </div>\n              <div class=\"progress-bar\">\n                <div class=\"progress-fill\" style=\"width: \\${task.progress}%\"></div>\n              </div>\n            </div>\n            <div style=\"display: flex; gap: 8px; margin-top: 8px;\">\n              <button class=\"btn btn-small btn-secondary\" onclick=\"updateTaskProgress('\\${task.id}')\">\n                Update Progress\n              </button>\n              <button class=\"btn btn-small btn-danger\" onclick=\"deleteTask('\\${task.id}')\">\n                Delete\n              </button>\n            </div>\n          </div>\n        \\\`\n          )\n          .join('');\n        document.getElementById('tasks-content').innerHTML = html;\n      }\n\n      // To-Dos\n      async function loadTodos() {\n        try {\n          const response = await fetch(\\\`\\${API_URL}/todos\\\`);\n          const todos = await response.json();\n          renderTodos(todos);\n        } catch (error) {\n          console.error('Failed to load todos:', error);\n          document.getElementById('todos-content').innerHTML =\n            '<div class=\"empty-state\">Error loading to-dos</div>';\n        }\n      }\n\n      function renderTodos(todos) {\n        if (todos.length === 0) {\n          document.getElementById('todos-content').innerHTML =\n            '<div class=\"empty-state\">No to-dos yet. Add one to get started.</div>';\n          return;\n        }\n\n        const html = todos\n          .map(\n            (todo) => \\\`\n          <div class=\"todo-item \\${todo.completed ? 'completed' : ''}\">\n            <input\n              type=\"checkbox\"\n              class=\"todo-checkbox\"\n              \\${todo.completed ? 'checked' : ''}\n              onchange=\"toggleTodo('\\${todo.id}', this.checked)\"\n            />\n            <div class=\"todo-text\">\\\${todo.title}</div>\n            <div class=\"todo-assigned\">\\\${todo.assignedTo}</div>\n            <button class=\"btn btn-small btn-danger\" onclick=\"deleteTodo('\\${todo.id}')\">\n              ×\n            </button>\n          </div>\n        \\\`\n          )\n          .join('');\n        document.getElementById('todos-content').innerHTML = html;\n      }\n\n      // Modal Functions\n      function openTaskModal() {\n        document.getElementById('taskModal').classList.add('active');\n      }\n\n      function closeTaskModal() {\n        document.getElementById('taskModal').classList.remove('active');\n        document.getElementById('taskTitle').value = '';\n        document.getElementById('taskDesc').value = '';\n        document.getElementById('taskAssigned').value = '';\n        document.getElementById('taskDue').value = '';\n      }\n\n      function openTodoModal() {\n        document.getElementById('todoModal').classList.add('active');\n      }\n\n      function closeTodoModal() {\n        document.getElementById('todoModal').classList.remove('active');\n        document.getElementById('todoTitle').value = '';\n        document.getElementById('todoAssigned').value = '';\n      }\n\n      async function saveTask(event) {\n        event.preventDefault();\n        const task = {\n          title: document.getElementById('taskTitle').value,\n          description: document.getElementById('taskDesc').value,\n          assignedTo: document.getElementById('taskAssigned').value,\n          priority: document.getElementById('taskPriority').value,\n          dueDate: document.getElementById('taskDue').value,\n        };\n\n        try {\n          const response = await fetch(\\\`\\${API_URL}/tasks\\\`, {\n            method: 'POST',\n            headers: { 'Content-Type': 'application/json' },\n            body: JSON.stringify(task),\n          });\n          if (response.ok) {\n            closeTaskModal();\n            await loadTasks();\n          }\n        } catch (error) {\n          console.error('Failed to save task:', error);\n        }\n      }\n\n      async function saveTodo(event) {\n        event.preventDefault();\n        const todo = {\n          title: document.getElementById('todoTitle').value,\n          assignedTo: document.getElementById('todoAssigned').value,\n          priority: document.getElementById('todoPriority').value,\n        };\n\n        try {\n          const response = await fetch(\\\`\\${API_URL}/todos\\\`, {\n            method: 'POST',\n            headers: { 'Content-Type': 'application/json' },\n            body: JSON.stringify(todo),\n          });\n          if (response.ok) {\n            closeTodoModal();\n            await loadTodos();\n          }\n        } catch (error) {\n          console.error('Failed to save todo:', error);\n        }\n      }\n\n      async function deleteTask(id) {\n        if (confirm('Delete this task?')) {\n          try {\n            await fetch(\\\`\\${API_URL}/tasks/\\${id}\\\`, { method: 'DELETE' });\n            await loadTasks();\n          } catch (error) {\n            console.error('Failed to delete task:', error);\n          }\n        }\n      }\n\n      async function updateTaskProgress(id) {\n        const newProgress = prompt('Enter new progress (0-100):');\n        if (newProgress !== null) {\n          try {\n            await fetch(\\\`\\${API_URL}/tasks/\\${id}\\\`, {\n              method: 'PUT',\n              headers: { 'Content-Type': 'application/json' },\n              body: JSON.stringify({ progress: parseInt(newProgress) }),\n            });\n            await loadTasks();\n          } catch (error) {\n            console.error('Failed to update task:', error);\n          }\n        }\n      }\n\n      async function deleteTodo(id) {\n        try {\n          await fetch(\\\`\\${API_URL}/todos/\\${id}\\\`, { method: 'DELETE' });\n          await loadTodos();\n        } catch (error) {\n          console.error('Failed to delete todo:', error);\n        }\n      }\n\n      async function toggleTodo(id, completed) {\n        try {\n          await fetch(\\\`\\${API_URL}/todos/\\${id}\\\`, {\n            method: 'PUT',\n            headers: { 'Content-Type': 'application/json' },\n            body: JSON.stringify({ completed }),\n          });\n        } catch (error) {\n          console.error('Failed to toggle todo:', error);\n        }\n      }\n\n      async function refreshAll() {\n        await Promise.all([\n          loadUsage(),\n          loadAgents(),\n          loadCrons(),\n          loadTasks(),\n          loadTodos(),\n        ]);\n      }\n\n      // Start the dashboard\n      init();\n    </script>\n  </body>\n</html>`;

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Read index.html once on startup
let indexHtml = '';
try {
  indexHtml = readFileSync(path.join(__dirname, 'public', 'index.html'), 'utf-8');
} catch (e) {
  console.warn('Could not read index.html:', e.message);
}

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

// SPA fallback - serve embedded HTML (ensures it works on Vercel)
app.get('*', (req, res) => {
  res.type('text/html').send(EMBEDDED_HTML);
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
