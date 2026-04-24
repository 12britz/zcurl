import chalk from "chalk";

const Box = { tl: "┌", tr: "┐", bl: "└", br: "┘", h: "─", v: "│" };
const C = { p: chalk.cyan, s: chalk.green, w: chalk.white, y: chalk.yellow, r: chalk.red, d: chalk.dim };
const W = 52;

export function formatRequest(req) {
  let out = C.d(Box.tl + Box.h.repeat(W) + Box.tr) + "\n";
  out += line(C.p.bold(" REQUEST ")) + "\n";
  const methodColored = C.p(String(req.method).padEnd(7));
  const urlColored = C.w(req.url);
  out += line(methodColored + " " + urlColored) + "\n";
  out += C.d(Box.bl + Box.h.repeat(W) + Box.br) + "\n";

  const hdrs = req.headers || {};
  if (Object.keys(hdrs).length > 0) {
    out += line(C.p.bold(" Headers ")) + "\n";
    for (const k of Object.keys(hdrs)) {
      out += line2(k, hdrs[k]);
    }
  }

  if (req.body) {
    out += line(C.p.bold(" Body ")) + "\n";
    const b = formatBody(req.body, hdrs["Content-Type"]);
    for (const line of b.split("\n").slice(0, 15)) {
      out += line3(line);
    }
  }

  out += C.d(Box.bl + Box.h.repeat(W) + Box.br) + "\n";
  return out;
}

export function formatResponse(res) {
  let out = C.d(Box.tl + Box.h.repeat(W) + Box.tr) + "\n";
  out += line(C.p.bold(" RESPONSE ")) + "\n";
  const statusColored = statusColor(res.status);
  out += line(statusColored + " " + res.statusText) + "\n";
  out += C.d(Box.bl + Box.h.repeat(W) + Box.br) + "\n";

  out += line(C.p.bold(" Headers ")) + "\n";
  const hdrs = res.headers || {};
  for (const k of Object.keys(hdrs)) {
    out += line2(k, hdrs[k]);
  }

  if (res.body) {
    out += line(C.p.bold(" Body ")) + "\n";
    const b = formatBody(res.body, hdrs["content-type"]);
    for (const line of b.split("\n").slice(0, 15)) {
      out += line3(line);
    }
  }

  out += C.d(Box.bl + Box.h.repeat(W) + Box.br) + "\n";
  return out;
}

export function formatTiming(timing) {
  if (!timing) return "";
  let out = "\n" + C.d(Box.tl + Box.h.repeat(W) + Box.tr) + "\n";
  out += line(C.p.bold(" TIMING ")) + "\n";
  out += C.d(Box.bl + Box.h.repeat(W) + Box.br) + "\n";

  const phases = [
    ["DNS", timing.dns],
    ["TCP", timing.tcp],
    ["TLS", timing.tls],
    ["TTFB", timing.ttfb],
    ["DL", timing.download],
    ["Total", timing.total]
  ];
  const maxTime = Math.max(...phases.map(([, v]) => v || 0), 0.001);
  const barWidth = 14;

  for (const [label, ms] of phases) {
    if (!ms) continue;
    const barLen = Math.max(1, Math.round((ms / maxTime) * barWidth));
    const bar = "▓".repeat(barLen) + "░".repeat(barWidth - barLen);
    const color = ms / timing.total > 0.5 ? C.r : ms / timing.total > 0.25 ? C.y : C.s;
    const content = C.d(label.padEnd(6)) + color(bar) + " " + C.w(ms.toFixed(0) + " ms");
    out += line(content) + "\n";
  }

  out += C.d(Box.bl + Box.h.repeat(W) + Box.br) + "\n\n";
  return out;
}

function line(content) {
  const str = String(content);
  if (str.length >= W - 2) {
    return C.d(Box.v) + " " + str.slice(0, W - 2) + C.d(Box.v);
  }
  const pad = W - 3 - str.length;
  return C.d(Box.v) + " " + str + " ".repeat(pad) + C.d(Box.v);
}

function line2(key, val) {
  const k = String(key).slice(0, 20).padEnd(20);
  const v = String(val).slice(0, 28);
  const totalLen = k.length + v.length + 1;
  const pad = Math.max(0, W - 3 - totalLen);
  return C.d(Box.v) + " " + C.p(k) + " " + C.w(v) + " ".repeat(pad) + C.d(Box.v);
}

function line3(text) {
  const t = String(text).slice(0, W - 3);
  const pad = Math.max(0, W - 3 - t.length);
  return C.d(Box.v) + " " + C.w(t) + " ".repeat(pad) + C.d(Box.v);
}

function statusColor(s) {
  if (s < 200) return C.w;
  if (s < 300) return C.s;
  if (s < 400) return C.y;
  return C.r;
}

function formatBody(body, ct) {
  if (!body) return "(empty)";
  const isJson = ct?.includes("json") || body.trim().startsWith("{") || body.trim().startsWith("[");
  if (isJson) {
    try {
      return syntaxJson(JSON.stringify(JSON.parse(body), null, 2));
    } catch {
      return body;
    }
  }
  return body.slice(0, 2000);
}

function syntaxJson(jsonStr) {
  return jsonStr.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
    (match) => {
      let col = C.w;
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          col = C.p;
          match = match.replace(/:$/, "");
          return col(match) + C.d(":");
        } else {
          col = C.y;
        }
      } else if (/true/.test(match)) {
        col = C.s;
      } else if (/false/.test(match)) {
        col = C.r;
      } else if (/null/.test(match)) {
        col = C.d;
      }
      return col(match);
    }
  );
}