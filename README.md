<div align="center">

```
   ██████╗██╗      █████╗ ██╗    ██╗██████╗ ██╗    ██╗ █████╗ ████████╗ ██████╗██╗  ██╗
  ██╔════╝██║     ██╔══██╗██║    ██║██╔══██╗██║    ██║██╔══██╗╚══██╔══╝██╔════╝██║  ██║
  ██║     ██║     ███████║██║ █╗ ██║██║  ██║██║ █╗ ██║███████║   ██║   ██║     ███████║
  ██║     ██║     ██╔══██║██║███╗██║██║  ██║██║███╗██║██╔══██║   ██║   ██║     ██╔══██║
  ╚██████╗███████╗██║  ██║╚███╔███╔╝██████╔╝╚███╔███╔╝██║  ██║   ██║   ╚██████╗██║  ██║
   ╚═════╝╚══════╝╚═╝  ╚═╝ ╚══╝╚══╝ ╚═════╝  ╚══╝╚══╝ ╚═╝  ╚═╝   ╚═╝    ╚═════╝╚═╝  ╚═╝
```

<br>

### 🦀 CLAWDWATCH LOBSTER EDITION

*"See what they don't want you to see"*

<br>

## 🌐 [LIVE DASHBOARD](https://cloudweaver.github.io/clawdwatch/)

<br>

[![Status](https://img.shields.io/badge/STATUS-ACTIVE-red?style=flat-square&labelColor=000)](https://github.com/Franzferdinan51/clawdwatch-lobster-edition)
[![Dashboard](https://img.shields.io/badge/DASHBOARD-LIVE-brightgreen?style=flat-square&labelColor=000)](https://cloudweaver.github.io/clawdwatch/)
[![HTTP API](https://img.shields.io/badge/HTTP%20API-Port%203444-blue?style=flat-square&labelColor=000)](https://github.com/Franzferdinan51/clawdwatch-lobster-edition)
[![LM Studio](https://img.shields.io/badge/LM%20Studio-MCP%20Ready-purple?style=flat-square&labelColor=000)](https://lmstudio.ai)
[![License](https://img.shields.io/badge/LICENSE-MIT-green?style=flat-square&labelColor=000)](LICENSE)

---

## 🎯 Lobster Edition Features

### HTTP API Server (Port 3444)
Built-in HTTP API for programmatic access:
```bash
curl http://localhost:3444/status      # Health check
curl http://localhost:3444/osint       # Latest OSINT data
curl http://localhost:3444/conflict    # Conflict status
curl http://localhost:3444/flights     # Flight tracking
curl http://localhost:3444/ships       # Ship tracking
curl http://localhost:3444/snapshot    # Get snapshot
curl http://localhost:3444/regions     # List regions
```

### LM Studio MCP Integration
Connect to Clawdwatch via LM Studio's MCP bridge:
- Configure MCP to use HTTP API at `http://localhost:3444`
- Full OSINT data access from any LM Studio model
- See [LM Studio MCP Setup](#lm-studio-mcp-setup)

### OpenClaw Integration
Native OpenClaw skill for AI agent access:
```bash
npm run snapshot -- --json --regions middle_east
```
See `skill/SKILL.md` for full OpenClaw integration.

### AI Provider Support
Multiple AI backends supported for intelligence analysis:
- OpenAI
- Anthropic
- Ollama
- And more via OpenClaw

---

## 🌟 What's Working NOW

| Source | Status | Data |
|--------|--------|------|
| ✈️ **Flight Tracking** | ✅ LIVE | OpenSky Network — 200+ flights in real-time |
| 🎖️ **Military Detection** | ✅ LIVE | NATO callsigns, RAF, USAF, and more |
| 📰 **News Aggregation** | ✅ LIVE | Al Jazeera, AP News — multi-source headlines |
| 🌍 **Internet Blackouts** | ✅ LIVE | Monitors 15 countries for outages |
| 📱 **Telegram Alerts** | ✅ LIVE | Push notifications for military/emergency aircraft |
| 🌐 **Social Monitoring** | ✅ LIVE | Reddit OSINT feeds |
| 🚢 **Ship Tracking** | ✅ READY | AIS integration framework |
| 🛰️ **Satellite Imagery** | ✅ READY | Sentinel Hub integration |
| 🌐 **HTTP API** | ✅ LIVE | Port 3444 for programmatic access |
| 🤖 **LM Studio MCP** | ✅ READY | Connect via HTTP API |

---

## 🚀 Quick Start

### Clone & Install
```bash
git clone https://github.com/Franzferdinan51/clawdwatch-lobster-edition.git
cd clawdwatch-lobster-edition
npm install
cp .env.example .env
```

### Run Modes

**CLI Mode (Watch)**
```bash
npm run watch
```

**HTTP API Server**
```bash
npm run start    # Starts on port 3444
```

**Snapshot**
```bash
npm run snapshot -- --json --regions middle_east
```

**List Regions**
```bash
npm run regions -- --json
```

---

## 🌐 HTTP API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /status` | Health check & service info |
| `GET /osint` | Latest OSINT summary |
| `GET /conflict` | Conflict status details |
| `GET /flights` | Current flight data |
| `GET /ships` | Current ship data |
| `GET /snapshot` | Get snapshot data |
| `GET /regions` | List available regions |

---

## 🔧 LM Studio MCP Setup

1. Open LM Studio
2. Go to Settings → MCP Servers
3. Add a new server configuration:
   - **Name**: Clawdwatch
   - **Type**: HTTP
   - **URL**: `http://localhost:3444`
4. Save and connect

Or configure via `mcp.json`:
```json
{
  "mcpServers": {
    "clawdwatch": {
      "url": "http://localhost:3444"
    }
  }
}
```

---

## 🤖 OpenClaw Integration

Add to your OpenClaw workspace:
```bash
npx clawhub install clawdwatch
```

Or use directly:
```bash
npm run snapshot -- --json --regions middle_east,eastern_europe
```

---

## 📱 Telegram Alerts

1. Message [@BotFather](https://t.me/BotFather) → `/newbot`
2. Copy your bot token
3. Get chat ID from [@userinfobot](https://t.me/userinfobot)
4. Add to `.env`:
```
TELEGRAM_BOT_TOKEN=your_token
TELEGRAM_CHAT_ID=your_chat_id
```

---

## ⚙️ Configuration

```bash
# .env file

# Region: middle_east | europe | usa | asia
WATCH_REGION=middle_east

# Telegram Alerts
TELEGRAM_BOT_TOKEN=your_token
TELEGRAM_CHAT_ID=your_chat_id

# Optional APIs
TWITTER_BEARER_TOKEN=xxx
SENTINEL_HUB_CLIENT_ID=xxx
SENTINEL_HUB_CLIENT_SECRET=xxx
AISSTREAM_API_KEY=xxx
```

---

## 🛠️ Scripts

| Script | Description |
|--------|-------------|
| `npm run watch` | Run CLI in watch mode |
| `npm run snapshot` | Get OSINT snapshot |
| `npm run regions` | List available regions |
| `npm run start` | Start HTTP API server |
| `npm run http` | Start HTTP API (alias) |
| `npm run build` | Compile TypeScript |
| `npm run dev` | Development with hot reload |

---

## 📡 Intelligence Sources

| Source | Type | Coverage |
|--------|------|----------|
| OpenSky Network | Flight | Global |
| Al Jazeera | News | MENA |
| AP News | News | Global |
| Reddit | Social | Global |
| Twitter/X | Social | Global |
| Sentinel Hub | Satellite | Global |
| AIS Stream | Naval | Global |

---

## 🌍 Monitored Locations

**Nuclear & Military Sites:**
- Bushehr Nuclear Plant
- Isfahan Nuclear Site
- Natanz Enrichment Facility
- Bandar Abbas Naval Base

**Strategic Waterways:**
- Strait of Hormuz
- Persian Gulf
- Gulf of Oman
- Red Sea

**US Military Bases:**
- Al Udeid Air Base (Qatar)
- Al Dhafra Air Base (UAE)

---

## 🔄 Upstream Sync

This fork syncs from upstream [cloudweaver/clawdwatch](https://github.com/cloudweaver/clawdwatch):
```bash
git remote add upstream https://github.com/cloudweaver/clawdwatch
git fetch upstream
git merge upstream/main
```

---

## 🤝 Contributing

PRs welcome! Please sync from upstream before submitting.

---

## 📄 License

MIT

---

## ⚠️ Disclaimer

Clawdwatch aggregates **publicly available** information only. It does not access classified data, hack systems, or break any laws. This tool is for **informational purposes** — always verify critical information through official channels.

---

<div align="center">

*In the fog of war, be the one who sees clearly.*

🦀

</div>
