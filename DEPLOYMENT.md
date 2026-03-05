# Deployment Guide

## Local Development

### Quick Start
```bash
npm install
npm start
```
Dashboard will be available at `http://localhost:3000`

## Production Deployment

### Option 1: systemd Service (Linux/Mac)

Create `/Users/metavision/Library/LaunchAgents/ai.metavision.dashboard.plist`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>ai.metavision.dashboard</string>
    <key>ProgramArguments</key>
    <array>
        <string>/usr/local/bin/node</string>
        <string>/Users/metavision/.openclaw/workspace/mission-control-dashboard/server.js</string>
    </array>
    <key>WorkingDirectory</key>
    <string>/Users/metavision/.openclaw/workspace/mission-control-dashboard</string>
    <key>StandardOutPath</key>
    <string>/Users/metavision/.openclaw/workspace/mission-control-dashboard/logs/dashboard.log</string>
    <key>StandardErrorPath</key>
    <string>/Users/metavision/.openclaw/workspace/mission-control-dashboard/logs/dashboard.error.log</string>
    <key>KeepAlive</key>
    <true/>
    <key>RunAtLoad</key>
    <true/>
    <key>EnvironmentVariables</key>
    <dict>
        <key>PORT</key>
        <string>3000</string>
        <key>NODE_ENV</key>
        <string>production</string>
    </dict>
</dict>
</plist>
```

Then:
```bash
launchctl load ~/Library/LaunchAgents/ai.metavision.dashboard.plist
```

### Option 2: PM2 Process Manager

```bash
npm install -g pm2

# Start with PM2
pm2 start server.js --name "mission-control"

# Auto-start on reboot
pm2 startup
pm2 save
```

### Option 3: Docker

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t mission-control-dashboard .
docker run -p 3000:3000 -v $(pwd)/data.json:/app/data.json mission-control-dashboard
```

## Nginx Reverse Proxy (Optional)

```nginx
upstream dashboard {
    server localhost:3000;
}

server {
    listen 80;
    server_name dashboard.metavision.local;

    location / {
        proxy_pass http://dashboard;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Environment Variables

Create `.env` file:

```env
PORT=3000
NODE_ENV=production
OPENCLAW_GATEWAY_URL=ws://127.0.0.1:18789
```

## Monitoring

### Check if running:
```bash
curl http://localhost:3000
```

### View logs:
```bash
# systemd
log stream --predicate 'process == "node"'

# PM2
pm2 logs mission-control

# Direct
tail -f logs/dashboard.log
```

## Backup

### Automated Backup
Create `backup.sh`:

```bash
#!/bin/bash
BACKUP_DIR="/Users/metavision/.openclaw/workspace/mission-control-dashboard/backups"
mkdir -p "$BACKUP_DIR"
cp data.json "$BACKUP_DIR/data.json.$(date +%s).backup"
```

Add to crontab:
```
0 2 * * * /Users/metavision/.openclaw/workspace/mission-control-dashboard/backup.sh
```

## Scaling

### Multiple Instances
Use PM2 cluster mode:
```bash
pm2 start server.js -i max --name "dashboard"
```

### Load Balancing
With Nginx:
```nginx
upstream dashboard {
    server localhost:3000;
    server localhost:3001;
    server localhost:3002;
}
```

## Security

1. **Use HTTPS in production:**
   - Get Let's Encrypt certificate
   - Configure Nginx with SSL

2. **Add authentication:**
   - Implement JWT or session-based auth
   - Update API endpoints to check tokens

3. **Rate limiting:**
   - Add express-rate-limit middleware
   - Prevent brute force attacks

4. **CORS:**
   - Restrict allowed origins
   - Don't allow `*` in production

## Troubleshooting

### Port already in use
```bash
lsof -i :3000
kill -9 <PID>
```

### Permission issues
```bash
chmod +x start.sh
sudo chown -R $(whoami) /Users/metavision/.openclaw/workspace/mission-control-dashboard
```

### OpenClaw not accessible
```bash
# Check gateway status
openclaw gateway status

# Verify connectivity
curl http://127.0.0.1:18789
```
