import chalk from "chalk";

const B = { tl: "┌", tr: "┐", bl: "└", br: "┘", h: "─", v: "│", lt: "├", rt: "┤", x: "┼" };
const P = chalk.cyan, S = chalk.green, W = chalk.white, D = chalk.dim, Bc = chalk.blue, Y = chalk.yellow, R = chalk.red, M = chalk.magenta;

const WIDTH = 56;

export function formatRequest(req) {
  let out = "";
  out += D(B.tl + B.h.repeat(WIDTH) + B.tr) + "\n";
  out += D(B.v) + "  " + P.bold("REQUEST") + D(" ").repeat(WIDTH - 12) + D(B.v) + "\n";
  out += D(B.v) + "  " + methodColor(req.method) + W(req.url) + D(" ").repeat(Math.max(0, WIDTH - 12 - req.url.length)) + D(B.v) + "\n";
  out += D(B.lt + B.h.repeat(WIDTH) + B.rt) + "\n";

  const hdrs = req.headers || {};
  const hkeys = Object.keys(hdrs);
  if (hkeys.length) {
    out += sectionBox("Headers", WIDTH);
    for (const k of hkeys) out += contentRow(k, hdrs[k], WIDTH);
  }

  if (req.body) {
    out += sectionBox("Body", WIDTH);
    const b = formatBody(req.body, hdrs["Content-Type"]);
    for (const l of b.split("\n").slice(0, 20)) out += contentRow("", l, WIDTH);
  }

  out += D(B.bl + B.h.repeat(WIDTH) + B.br) + "\n";
  return out;
}

export function formatResponse(res) {
  let out = "";
  out += D(B.tl + B.h.repeat(WIDTH) + B.tr) + "\n";
  out += D(B.v) + "  " + P.bold("RESPONSE") + D(" ").repeat(WIDTH - 11) + D(B.v) + "\n";
  out += D(B.v) + "  " + statusColor(res.status) + W(" " + res.statusText) + D(" ").repeat(Math.max(0, WIDTH - 14 - String(res.status).length)) + D(B.v) + "\n";
  out += D(B.lt + B.h.repeat(WIDTH) + B.rt) + "\n";

  out += sectionBox("Headers", WIDTH);
  const hdrs = res.headers || {};
  for (const k of Object.keys(hdrs)) out += contentRow(k, hdrs[k], WIDTH);

  if (res.body) {
    out += sectionBox("Body", WIDTH);
    const b = formatBody(res.body, hdrs["content-type"]);
    for (const l of b.split("\n").slice(0, 20)) out += contentRow("", l, WIDTH);
  }

  out += contentRow("Size", formatBytes(Buffer.byteLength(res.body || "", "utf-8")), WIDTH);
  out += D(B.bl + B.h.repeat(WIDTH) + B.br) + "\n";
  return out;
}

export function formatTiming(timing) {
  if (!timing) return "";
  let out = "";
  out += D(B.tl + B.h.repeat(WIDTH) + B.tr) + "\n";
  out += D(B.v) + "  " + P.bold("TIMING") + D(" ").repeat(WIDTH - 10) + D(B.v) + "\n";
  out += D(B.lt + B.h.repeat(WIDTH) + B.rt) + "\n";

  const phases = [["DNS Lookup", timing.dns], ["TCP Connect", timing.tcp], ["TLS Handshake", timing.tls], ["First Byte (TTFB)", timing.ttfb], ["Content Download", timing.download], ["Total", timing.total]];
  const maxT = Math.max(...phases.map(([, v]) => v || 0), 0.001);
  const bw = 18;

  for (const [lbl, ms] of phases) {
    if (!ms) continue;
    const barW = Math.max(1, Math.round((ms / maxT) * bw));
    const bar = "▓".repeat(barW) + "░".repeat(bw - barW);
    const col = ms / timing.total > 0.5 ? R : ms / timing.total > 0.25 ? Y : S;
    const row = D(B.v) + " " + D(lbl.padEnd(20)) + col(bar) + " " + W(ms.toFixed(0) + " ms");
    out += row + D(" ").repeat(Math.max(0, WIDTH - row.length + 1)) + D(B.v) + "\n";
  }

  out += D(B.bl + B.h.repeat(WIDTH) + B.br) + "\n\n";
  return out;
}

function sectionBox(title, w) {
  return D(B.lt + B.h.repeat(w) + B.rt) + "\n" + 
         D(B.v) + " " + P.bold(title) + D(" ").repeat(w - title.length - 2) + D(B.v) + "\n";
}

function contentRow(k, v, w) {
  if (k) {
    const content = P(k.slice(0,20).padEnd(20)) + " " + W(String(v).slice(0, 31));
    const line = D(B.v) + " " + content + D(" ").repeat(Math.max(0, w - 3 - content.length)) + D(B.v);
    return line + "\n";
  } else {
    const content = W(String(v).slice(0, w - 3));
    const line = D(B.v) + " " + content + D(" ").repeat(Math.max(0, w - 3 - content.length)) + D(B.v);
    return line + "\n";
  }
}

function methodColor(m) {
  const c = { GET: S, POST: Y, PUT: Bc, PATCH: M, DELETE: R, HEAD: D, OPTIONS: D };
  return (c[m] || W)(m.padEnd(7));
}

function statusColor(s) {
  const col = s < 200 ? W : s < 300 ? S : s < 400 ? Y : R;
  return col(String(s).padEnd(5));
}

function formatBody(body, ct) {
  if (!body) return "(empty)";
  const isJ = ct?.includes("json") || (body.trim().startsWith("{") || body.trim().startsWith("["));
  if (isJ) try { return syntaxJson(JSON.stringify(JSON.parse(body), null, 2)); } catch { return body; }
  return body.slice(0, 1500);
}

function syntaxJson(json) {
  return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g, (m) => {
    let c = W;
    if (/^"/.test(m)) { if (/:$/.test(m)) { c = P; m = m.replace(/:$/, ""); return c(m) + D(":"); } else c = Y; }
    else if (/true/.test(m)) c = S; else if (/false/.test(m)) c = R; else if (/null/.test(m)) c = D; else c = M;
    return c(m);
  });
}

function formatBytes(b) {
  if (b === 0) return "0 B";
  const k = 1024, s = ["B", "KB", "MB", "GB"];
  return parseFloat((b / Math.pow(k, Math.floor(Math.log(b) / Math.log(k)))).toFixed(1)) + " " + s[Math.floor(Math.log(b) / Math.log(k))];
}