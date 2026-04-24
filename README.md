# zcurl 🎨

A beautifully colored curl alternative with stunning box-style output. Make HTTP requests that look amazing in your terminal.

<p align="center">
  <img width="600" alt="zcurl demo" src="https://github.com/user-attachments/assets/b6f63207-03c3-493c-ae24-7c0b1350b75a" />
</p>

---

## Why zcurl?

- ✨ **Beautiful output** - Box-style borders with proper closing lines
- 🎨 **Syntax highlighting** - JSON colors that pop
- ⏱️ **Timing stats** - See DNS, TCP, TLS, TTFB breakdown
- 📜 **Request history** - Save and replay past requests
- 🚀 **Performance testing** - Run concurrent requests

---

## Install

```bash
# Install globally (scoped package)
npm install -g @12britz/zcurl

# Or use without installing
npx @12britz/zcurl <url>

# After install, use 'zcurl' command
zcurl https://httpbin.org/get
```

---
<img width="960" height="1088" alt="zcurl" src="https://github.com/user-attachments/assets/d32599be-1b57-45f6-a95a-87cbc57e956a" />

## Quick Start

```bash
# Basic GET request
zcurl https://httpbin.org/get

# POST with JSON body
zcurl -X POST https://httpbin.org/post -d '{"name":"test","value":123}'
```

---

## Features

### 📝 Request Builder
| Flag | Description | Example |
|------|-------------|---------|
| `-X, --method` | HTTP method | `zcurl -X POST <url>` |
| `-H, --header` | Custom header | `zcurl -H "Authorization: Bearer token" <url>` |
| `-d, --data` | Request body | `zcurl -d '{"key":"value"}' <url>` |
| `-q, --query` | Query parameter | `zcurl -q page=1 -q limit=10 <url>` |
| `--auth` | Auth header | `zcurl --auth user:pass <url>` or `zcurl --auth token` |

### 🎯 Output Options
| Flag | Description | Example |
|------|-------------|---------|
| `-j, --json` | Force JSON | `zcurl -j <url>` |
| `-f, --form` | Form data | `zcurl -f <url>` |
| `-o, --output` | Save to file | `zcurl -o response.json <url>` |
| `--download` | Download file | `zcurl --download <url>` |

### 🔒 Security
| Flag | Description | Example |
|------|-------------|---------|
| `-k, --insecure` | Skip TLS verify | `zcurl -k <url>` |
| `-L, --location` | Follow redirects | `zcurl -L <url>` |
| `--timeout` | Request timeout | `zcurl --timeout 5000 <url>` |

### ⏱️ Performance
| Flag | Description | Example |
|------|-------------|---------|
| `-n, --count` | Total requests | `zcurl -n 100 <url>` |
| `-c, --concurrency` | Concurrent | `zcurl -c 10 <url>` |

### 📚 History
| Flag | Description | Example |
|------|-------------|---------|
| `--history` | View all history | `zcurl --history` |
| `--history #` | See entry #N | `zcurl --history 1` |
| `--replay` | Replay last | `zcurl --replay` |
| `--replay #` | Replay #N | `zcurl --replay 3` |

---

## Examples

### Basic GET
```bash
zcurl https://httpbin.org/get
```

### POST with JSON
```bash
zcurl -X POST https://httpbin.org/post \
  -d '{"username":"admin","password":"secret"}' \
  -H "Content-Type: application/json"
```

### Custom Headers
```bash
zcurl -H "Authorization: Bearer sk-12345" \
  -H "X-API-Version: v2" \
  https://api.example.com
```

### Query Parameters
```bash
zcurl https://api.example.com/users \
  -q page=1 \
  -q limit=50 \
  -q sort=name
```

### Basic Auth
```bash
zcurl --auth admin:secret https://api.example.com
```

### Bearer Token
```bash
zcurl --auth eyJhbGciOiJIUzI1NiIs... https://api.example.com
```

### Save Response
```bash
zcurl -o response.json https://api.example.com/data
```

### Performance Testing
```bash
# 100 requests, 10 concurrent
zcurl -n 100 -c 10 https://api.example.com/ping
```

### View History
```bash
# List all requests
zcurl --history

# See entry #1 details (headers, body)
zcurl --history 1
```

### Replay Request
```bash
# Replay the last request
zcurl --replay

# Replay entry #2
zcurl --replay 2

# Replay with modifications
zcurl --replay -X PUT -d '{"updated":"data"}'
```

---

## Demo Output

```
┌───────────────────────────────────────────────────────────────────┐
│  REQUEST                                                          │
│ GET https://httpbin.org/get                                    │
└───────────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────────┐
│  RESPONSE                                                         │
│ 200 OK                                                            │
└───────────────────────────────────────────────────────────────────┘
│  Headers                                                         │
│ access-control-allow-credentials true                             │
│ access-control-allow-origin *                                    │
│ content-type           application/json                          │
├───────────────────────────────────────────────────────────────────┤
│  Body                                                            │
│ {                                                                │
│   "args": {},                                                    │
│   "headers": {                                                   │
│     "Accept": "*/*",                                             │
│     "Host": "httpbin.org"                                        │
│   },                                                            │
│   "origin": "122.172.80.151",                                    │
│   "url": "https://httpbin.org/get"                                │
│ }                                                                │
└───────────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────────┐
│  TIMING                                                          │
│ DNS   ▓▓░░░░░░░░░░░░ 143 ms                                     │
│ TCP   ▓▓▓▓░░░░░░░░░░ 357 ms                                     │
│ TLS   ▓░░░░░░░░░░░░░ 107 ms                                     │
│ TTFB  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓ 1189 ms                                    │
│ Total ▓▓▓▓▓▓▓▓▓▓▓▓▓▓ 1190 ms                                    │
└───────────────────────────────────────────────────────────────────┘
```

---

## License

MIT
