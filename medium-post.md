---
title: I Built zcurl — The Beautiful curl Alternative You've Been Waiting For
description: A curl alternative with stunning box-style terminal output, JSON highlighting, timing stats, request history, and built-in load testing.
---

# I Built zcurl — The Beautiful curl Alternative You've Been Waiting For

As developers, we spend countless hours testing APIs with curl. Let's be honest — the output is ugly. Plain text, no colors, impossible to read.

I built **zcurl** to solve this. Just add a "Z" to curl and see the magic.

![zcurl demo](https://github.com/12britz/zcurl/raw/main/screenshot.png)

## What is zcurl?

zcurl is a drop-in replacement for curl that produces stunning, readable output in your terminal. It's built with Node.js and published as an npm package.

## Features

### 🎨 Beautiful Box-Style Output
Every request and response is wrapped in clean, properly-closing box borders. No more guessing where one section ends and another begins.

### 🎯 JSON Syntax Highlighting
JSON responses are automatically color-coded — strings in yellow, keys in cyan, numbers in magenta, booleans in green/red. Actually readable!

### ⏱️ Detailed Timing Stats
See exactly where your request time goes:
- DNS lookup
- TCP connection
- TLS handshake
- Time to First Byte (TTFB)
- Content download
- Total time

With visual progress bars showing relative time spent in each phase.

### 📜 Request History & Replay
All requests are automatically saved to `~/.zcurl/history.json`. View history, see details of any entry, and replay with a single command.

```bash
# View all requests
zcurl --history

# See entry #1 details
zcurl --history 1

# Replay last request
zcurl --replay

# Replay entry #3
zcurl --replay 3
```

### 🚀 Built-in Load Testing
Need to stress test an endpoint? No need for separate tools.

```bash
# 100 requests, 10 concurrent
zcurl -n 100 -c 10 https://api.example.com/ping
```

Shows success/fail counts, average response time, and min/max.

## Installation

```bash
npm install -g @12britz/zcurl
```

## Quick Examples

```bash
# Basic GET
zcurl https://httpbin.org/get

# POST with JSON
zcurl -X POST https://httpbin.org/post \
  -d '{"name":"test","value":123}'

# With headers
zcurl -H "Authorization: Bearer token" \
  -H "X-API-Key: key" \
  https://api.example.com

# Query parameters
zcurl https://api.com/users \
  -q page=1 \
  -q limit=50

# Basic auth or Bearer
zcurl --auth user:pass https://api.com
zcurl --auth eyJhbGciOiJ... https://api.com

# Save response
zcurl -o response.json https://api.com/data
```

## Why I Built This

I got tired of copying curl output into JSON formatters or struggling to read response bodies in my terminal. I wanted something that:

1. Works exactly like curl (same flags, same behavior)
2. Looks beautiful out of the box
3. Helps me debug APIs faster

zcurl is that tool.

## The Magic Moment

Just replace `curl` with `zcurl`:

```bash
# Before (curl)
curl https://api.example.com

# After (zcurl)
zcurl https://api.example.com
```

That's it. The same API, beautiful output.

## Get Started

```bash
npm install -g @12britz/zcurl
```

- **npm**: [https://www.npmjs.com/package/@12britz/zcurl](https://www.npmjs.com/package/@12britz/zcurl)
- **GitHub**: [https://github.com/12britz/zcurl](https://github.com/12britz/zcurl)

Try it out and let me know what you think! Issues and PRs welcome. 🚀