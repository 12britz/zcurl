import chalk from "chalk";

const P = chalk.cyan, S = chalk.green, W = chalk.white, D = chalk.dim, Bc = chalk.blue, Y = chalk.yellow, R = chalk.red, M = chalk.magenta;

export function formatRequest(req) {
  let out = "";
  out += P("> " + req.method) + " " + W(req.url) + "\n";
  
  const hdrs = req.headers || {};
  for (const [k, v] of Object.entries(hdrs)) {
    out += P("> ") + P(k) + ": " + W(v) + "\n";
  }
  
  if (req.body) {
    out += "\n" + formatBody(req.body, hdrs["Content-Type"]) + "\n";
  }
  
  return out;
}

export function formatResponse(res) {
  let out = "";
  out += statusLine(res.status, res.statusText) + "\n";
  
  const hdrs = res.headers || {};
  for (const [k, v] of Object.entries(hdrs)) {
    out += P("< ") + P(k) + ": " + W(v) + "\n";
  }
  
  if (res.body) {
    out += "\n" + formatBody(res.body, hdrs["content-type"]) + "\n";
  }
  
  const size = Buffer.byteLength(res.body || "", "utf-8");
  out += D("Total: ") + W(formatBytes(size)) + "\n";
  
  return out;
}

export function formatTiming(timing) {
  if (!timing) return "";
  
  let out = "\n" + D("Timing:") + "\n";
  
  const phases = [
    ["DNS", timing.dns],
    ["TCP", timing.tcp],
    ["TLS", timing.tls],
    ["TTFB", timing.ttfb],
    ["Download", timing.download],
    ["Total", timing.total],
  ];
  
  const maxTime = Math.max(...phases.map(([, v]) => v || 0), 0.001);
  const barWidth = 20;
  
  for (const [label, ms] of phases) {
    if (!ms) continue;
    const barLen = Math.max(1, Math.round((ms / maxTime) * barWidth));
    const bar = "▓".repeat(barLen) + "░".repeat(barWidth - barLen);
    const color = ms / timing.total > 0.5 ? R : ms / timing.total > 0.25 ? Y : S;
    out += D(label.padEnd(10)) + color(bar) + " " + W(ms.toFixed(0) + " ms") + "\n";
  }
  
  return out + "\n";
}

function statusLine(status, text) {
  let color;
  if (status < 200) color = W;
  else if (status < 300) color = S;
  else if (status < 400) color = Y;
  else color = R;
  
  return P("< HTTP/1.1 ") + color(String(status)) + " " + W(text);
}

function formatBody(body, ct) {
  if (!body) return D("(empty)");
  
  const isJson = ct?.includes("json") || (body.trim().startsWith("{") || body.trim().startsWith("["));
  if (isJson) {
    try {
      return syntaxJson(JSON.stringify(JSON.parse(body), null, 2));
    } catch { return body; }
  }
  return body.slice(0, 3000);
}

function syntaxJson(json) {
  return json.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
    (m) => {
      let c = W;
      if (/^"/.test(m)) {
        if (/:$/.test(m)) {
          c = P;
          m = m.replace(/:$/, "");
          return c(m) + D(":");
        }
        c = Y;
      } else if (/true/.test(m)) c = S;
      else if (/false/.test(m)) c = R;
      else if (/null/.test(m)) c = D;
      else c = M;
      return c(m);
    }
  );
}

function formatBytes(bytes) {
  if (bytes === 0) return "0 B";
  const k = 1024, sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}