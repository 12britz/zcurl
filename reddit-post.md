# 🦌 I built zcurl - A beautifully colored curl alternative with stunning box-style output

Hey everyone! I just published my first npm package and wanted to share it with you all.

**zcurl** is a curl alternative that makes HTTP requests look amazing in your terminal.

## Features
- ✨ Beautiful box-style borders with proper closing lines
- 🎨 JSON syntax highlighting
- ⏱️ Timing stats (DNS, TCP, TLS, TTFB)
- 📜 Request history with replay
- 🚀 Performance testing (concurrent requests)

## Demo
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
│ DNS   ▓▓░░░░░░░░░░░░ 143 ms                                    │
│ TCP   ▓▓▓▓░░░░░░░░░░ 357 ms                                    │
│ TLS   ▓░░░░░░░░░░░░░ 107 ms                                    │
│ TTFB  ▓▓▓▓▓▓▓▓▓▓▓▓▓ 1189 ms                                   │
│ Total ▓▓▓▓▓▓▓▓▓▓▓▓▓ 1190 ms                                   │
└───────────────────────────────────────────────────────────────────┘
```

## Install
```bash
npm install -g @12britz/zcurl
```

## Usage
```bash
# Basic GET
zcurl https://httpbin.org/get

# POST with JSON
zcurl -X POST https://httpbin.org/post -d '{"name":"test"}'

# View history
zcurl --history

# Replay last request
zcurl --replay

# Performance testing - 100 requests, 10 concurrent
zcurl -n 100 -c 10 https://api.example.com/ping
```

## Links
- npm: https://www.npmjs.com/package/@12britz/zcurl
- GitHub: https://github.com/12britz/zcurl

Would love to get feedback from the community! 🎉