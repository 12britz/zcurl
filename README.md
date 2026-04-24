# zcurl

A beautifully colored curl alternative — see your HTTP requests and responses with style.

## Features

- Colored output for requests and responses
- JSON syntax highlighting
- Timing stats (DNS, TCP, TTFB, total)
- Request history and replay
- Headers, auth, and data support
- Follow redirects, timeout, and more

## Install

```bash
npm install -g zcurl
```

Or use locally without installing:

```bash
npx zcurl <url>
```

## Usage

```bash
# Basic GET
zcurl https://api.example.com

# POST with JSON body
zcurl -X POST https://api.example.com/data -d '{"name":"test"}'

# With custom headers
zcurl -H "Authorization: Bearer token" -H "X-API-Key: key" https://api.example.com

# Query parameters
zcurl https://api.example.com -q page=1 -q limit=10

# Basic auth or Bearer token
zcurl --auth user:pass https://api.example.com
zcurl --auth your-token https://api.example.com
```

## Options

| Flag | Description |
|-----|-------------|
| `-X, --method` | HTTP method (GET, POST, PUT, DELETE, etc.) |
| `-H, --header` | Custom header (key:value) |
| `-d, --data` | Request body |
| `-q, --query` | Query parameter (key=value) |
| `-j, --json` | Force JSON content-type |
| `-f, --form` | Force form-urlencoded |
| `-L, --location` | Follow redirects |
| `-k, --insecure` | Skip TLS verification |
| `--timeout` | Timeout in ms |
| `--auth` | Basic auth (user:pass) or Bearer token |
| `--replay` | Replay last request |
| `--history` | Show request history |
| `-o, --output` | Save response to file |

## Examples

```bash
# GET request
zcurl https://httpbin.org/get

# POST with JSON
zcurl -X POST https://httpbin.org/post \
  -d '{"username":"admin","password":"secret"}' \
  -H "Content-Type: application/json"

# Delete request
zcurl -X DELETE https://api.example.com/item/123

# Download file
zcurl -o file.zip https://example.com/file.zip
```

## Demo

```
  ────────────────────── ▼ RESPONSE ▼ ──────────────────────
  ❯ 200  OK

  ── Headers ──
  content-type             application/json
  server                   nginx

  ── Body ──
  {
    "args": {},
    "data": "...",
    "json": {
      "name": "test",
      "value": 123
    }
  }

  Size: 489 B

  ─────────────────────── ⏱ TIMING ⏱ ───────────────────────
  DNS Lookup             ████ 164 ms
  TCP Connect            █████████ 409 ms
  First Byte (TTFB)      ████████████████████ 1365 ms
  Total                  ██████████████████████████ 1369 ms
```

## License

MIT