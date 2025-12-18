# ARCHITECTURE & PROCESS DOCUMENTATION: AI MEETING SAAS

## 1. Target Structure (Monorepo)
We are transforming the current structure into a scalable Monorepo.
- **Root:** Orchestration (Docker, Nginx).
- **apps/web:** The User Interface (Next.js).
- **apps/bot-engine:** The Worker Service (Node.js + Playwright + FFmpeg).

**Target Directory Map:**
```text
/ (root)
├── package.json             # Workspaces config
├── docker-compose.yml       # Orchestrates Web + Worker + Redis + Nginx
├── apps/
│   ├── web/                 # (Moved from 'final-product')
│   └── bot-engine/          # (New Headless Browser Service)
├── nginx/                   # Proxy configuration
└── redis/                   # Redis data/config
2. Infrastructure Process
Orchestration: docker-compose.yml runs all services in a shared network.

Redis: Acts as the message broker. Must start first.

Bot Engine (Worker):

Runs in a Docker container with Chrome Stable, XVFB, and FFmpeg.

Entrypoint: Starts Xvfb :99 (virtual screen) -> Starts Node.js app.

Resources: Requires shm_size: 2gb to prevent Chrome crashes.

3. Communication Logic (Producer-Consumer)
User Action: User submits a meeting URL in apps/web.

Producer: apps/web validates the URL and pushes a job to Redis Queue (meeting-jobs).

Consumer: apps/bot-engine listens to the queue. When a job arrives:

It launches a Headless Browser on Display :99.

It spawns FFmpeg to record Display :99 and System Audio.

4. Navigation Strategy Pattern
The Bot Engine must implement the Strategy Pattern to handle different platforms.

Universal Flow:

Router: Detect platform (Google / Zoom / Yandex) by URL.

Pre-flight: Open Browser Context (Incognito/Guest).

Navigation:

Google Meet: Handle "Turn off Mic/Cam" buttons via selectors. Click "Join".

Zoom: Force Web Client (rewrite URL to /wc/join). Handle "Agree to Cookies".

Yandex Telemost: Use Text-Based Selectors (e.g., getByText('Продолжить'), getByText('Присоединиться')) as classes are obfuscated.

Recording:

Start FFmpeg capturing X11 display and PulseAudio monitor.

Wait for meeting end (check for "Leave" button presence).

Finalization: Upload .mp4 file -> Notify apps/web via Webhook/Redis.