# 🔥 zcurl - A beautifully colored curl alternative for your terminal

I've been working on this for a while and finally got it published. It's a curl alternative with stunning box-style output that makes API testing actually enjoyable.

## Why zcurl?

As developers, we spend hours testing APIs. The standard curl output is... not pretty. I wanted something that makes you actually want to look at your API responses.

## Features

- **Box borders** - Clean, proper-closing rectangles for every section
- **JSON highlighting** - Syntax colored output that actually pops
- **Timing breakdown** - See DNS, TCP, TLS, TTFB individually
- **History & Replay** - Save requests and replay them anytime
- **Load testing** - Built-in concurrent request support

## Output Preview

```
┌───────────────────────────────────────────────────────────────────┐
│  REQUEST                                                          │
│ POST https://httpbin.org/post                                     │
└───────────────────────────────────────────────────────────────────┘
│  Headers                                                          │
│ Content-Type           application/json                            │
├───────────────────────────────────────────────────────────────────┤
│  Body                                                             │
│ {                                                                 │
│   "name": "test",                                                │
│   "value": 123                                                   │
│ }                                                                 │
└───────────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────────┐
│  TIMING                                                          │
│ DNS   ▓▓░░░░░░░░░░░ 143 ms                                     │
│ TCP   ▓▓▓▓░░░░░░░░░ 357 ms                                     │
│ TLS   ▓░░░░░░░░░░░░ 107 ms                                     │
│ TTFB  ▓▓▓▓▓▓▓▓▓▓▓▓▓ 1189 ms                                 │
│ Total ▓▓▓▓▓▓▓▓▓▓▓▓▓ 1190 ms                                 │
└───────────────────────────────────────────────────────────────────┘
```

## Install

```bash
npm install -g @12britz/zcurl
```

## Quick Examples

```bash
# Basic request
zcurl https://httpbin.org/get

# POST with body
zcurl -X POST https://httpbin.org/post -d '{"hello":"world"}'

# With headers
zcurl -H "Authorization: Bearer token" https://api.example.com

# Load test - 100 requests, 10 at a time
zcurl -n 100 -c 10 https://api.example.com/ping

# View history
zcurl --history

# Replay a request
zcurl --replay 5  # replay entry #5
```

## What makes it different?

- **No config needed** - Works out of the box
- **History saved locally** - `~/.zcurl/history.json`
- **Single binary** - No dependencies to manage
- **Color aware** - Automatically adjusts to your terminal

## Links

- **npm:** https://www.npmjs.com/package/@12britz/zcurl
- **GitHub:** https://github.com/12britz/zcurl

Would love to hear what you think! Issues and PRs welcome. 🚀