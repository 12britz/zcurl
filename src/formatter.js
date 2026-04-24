import chalk from "chalk";

const Box = { tl: "┌", tr: "┐", bl: "└", br: "┘", h: "─", v: "│" };
const C = { p: chalk.cyan, s: chalk.green, w: chalk.white, y: chalk.yellow, r: chalk.red, d: chalk.dim };
let W = 52;

export function computeWidth(req, res) {
  const check = (str) => { W = Math.max(W, str.replace(/\x1B\[[0-9;]*[mGK]/g, "").length + 1); };
  
  if (req) {
    check(req.method + " " + req.url);
    const h = req.headers || {};
    for (const k of Object.keys(h)) check(k.padEnd(22) + " " + String(h[k]));
    if (req.body) {
      const b = fmtBody(req.body, h["Content-Type"]);
      for (const ln of b.split("\n").slice(0, 15)) check(ln);
    }
  }
  
  if (res) {
    check(String(res.status) + " " + res.statusText);
    const rh = res.headers || {};
    for (const k of Object.keys(rh)) check(k.padEnd(22) + " " + String(rh[k]));
    if (res.body) {
      const b = fmtBody(res.body, rh["content-type"]);
      for (const ln of b.split("\n").slice(0, 15)) check(ln);
    }
  }
}

// Build row: compute plain length first, add styled, then close
function row(plain, styled) {
  const p = plain || "";
  const pLen = p.replace(/\x1B\[[0-9;]*[mGK]/g, "").length;
  const pad = Math.max(0, W - 1 - pLen);
  return C.d(Box.v) + " " + (styled || C.w(p)) + " ".repeat(pad) + C.d(Box.v);
}

export function formatRequest(req) {
  let o = C.d(Box.tl + Box.h.repeat(W) + Box.tr) + "\n";
  o += row(" REQUEST ", C.p.bold(" REQUEST ")) + "\n";
  o += row(req.method + " " + req.url, C.p(req.method) + " " + C.w(req.url)) + "\n";
  o += C.d(Box.bl + Box.h.repeat(W) + Box.br) + "\n";

  const h = req.headers || {};
  if (Object.keys(h).length) {
    o += row(" Headers ", C.p.bold(" Headers ")) + "\n";
    for (const k of Object.keys(h)) {
      const kv = k.padEnd(22) + " " + String(h[k]);
      o += row(kv, C.p(k.padEnd(22)) + " " + C.w(String(h[k]))) + "\n";
    }
  }

  if (req.body) {
    o += row(" Body ", C.p.bold(" Body ")) + "\n";
    const b = fmtBody(req.body, h["Content-Type"]);
    for (const ln of b.split("\n").slice(0, 15)) o += row(ln, C.w(ln)) + "\n";
  }

  o += C.d(Box.bl + Box.h.repeat(W) + Box.br) + "\n";
  return o;
}

export function formatResponse(res) {
  let o = C.d(Box.tl + Box.h.repeat(W) + Box.tr) + "\n";
  o += row(" RESPONSE ", C.p.bold(" RESPONSE ")) + "\n";
  const sc = res.status < 300 ? C.s : res.status < 400 ? C.y : C.r;
  o += row(String(res.status) + " " + res.statusText, sc(String(res.status)) + " " + C.w(res.statusText)) + "\n";
  o += C.d(Box.bl + Box.h.repeat(W) + Box.br) + "\n";

  o += row(" Headers ", C.p.bold(" Headers ")) + "\n";
  const rh = res.headers || {};
  for (const k of Object.keys(rh)) {
    const kv = k.padEnd(22) + " " + String(rh[k]);
    o += row(kv, C.p(k.padEnd(22)) + " " + C.w(String(rh[k]))) + "\n";
  }

  if (res.body) {
    o += row(" Body ", C.p.bold(" Body ")) + "\n";
    const b = fmtBody(res.body, rh["content-type"]);
    for (const ln of b.split("\n").slice(0, 15)) o += row(ln, C.w(ln)) + "\n";
  }

  o += C.d(Box.bl + Box.h.repeat(W) + Box.br) + "\n";
  return o;
}

export function formatTiming(t) {
  if (!t) return "";
  let o = "\n" + C.d(Box.tl + Box.h.repeat(W) + Box.tr) + "\n";
  o += row(" TIMING ", C.p.bold(" TIMING ")) + "\n";
  o += C.d(Box.bl + Box.h.repeat(W) + Box.br) + "\n";

  const ph = [["DNS", t.dns], ["TCP", t.tcp], ["TLS", t.tls], ["TTFB", t.ttfb], ["DL", t.download], ["Total", t.total]];
  const mx = Math.max(...ph.map(([, v]) => v || 0), 0.001);
  const bw = 14;

  for (const [l, ms] of ph) {
    if (!ms) continue;
    const bl = Math.max(1, Math.round((ms / mx) * bw));
    const bar = "▓".repeat(bl) + "░".repeat(bw - bl);
    const col = ms / t.total > 0.5 ? C.r : ms / t.total > 0.25 ? C.y : C.s;
    const content = l.padEnd(6) + bar + " " + ms.toFixed(0) + " ms";
    o += row(content, C.d(l.padEnd(6)) + col(bar) + " " + C.w(ms.toFixed(0) + " ms")) + "\n";
  }

  o += C.d(Box.bl + Box.h.repeat(W) + Box.br) + "\n\n";
  return o;
}

function fmtBody(b, ct) {
  if (!b) return "(empty)";
  const j = ct?.includes("json") || b.trim().startsWith("{") || b.trim().startsWith("[");
  if (j) try { return syntax(JSON.stringify(JSON.parse(b), null, 2)); } catch { return b; }
  return b.slice(0, 2000);
}

function syntax(json) {
  return json.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
    (m) => {
      let c = C.w;
      if (/^"/.test(m)) {
        if (/:$/.test(m)) { c = C.p; m = m.replace(/:$/, ""); return c(m) + C.d(":"); }
        c = C.y;
      } else if (/true/.test(m)) c = C.s;
      else if (/false/.test(m)) c = C.r;
      else if (/null/.test(m)) c = C.d;
      return c(m);
    }
  );
}