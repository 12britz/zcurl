import chalk from "chalk";
import { formatJson, contentType } from "./utils.js";

export function formatRequest(req) {
  const lines = [];

  lines.push("");
  lines.push(separator("REQUEST", "▲"));

  const methodColor = methodToColor(req.method);
  lines.push(
    `  ${chalk.dim("❯")} ${methodColor(req.method.padEnd(7))} ${chalk.white(req.url)}`
  );

  const headerKeys = Object.keys(req.headers || {});
  if (headerKeys.length > 0) {
    lines.push("");
    lines.push(`  ${chalk.dim("── Headers ──")}`);
    for (const [key, val] of Object.entries(req.headers)) {
      lines.push(
        `  ${chalk.cyan(key.padEnd(24))} ${chalk.white(maskSensitive(key, val))}`
      );
    }
  }

  if (req.body) {
    lines.push("");
    lines.push(`  ${chalk.dim("── Body ──")}`);
    const formatted = formatBody(req.body, req.headers?.["Content-Type"]);
    for (const line of formatted.split("\n")) {
      lines.push(`  ${line}`);
    }
  }

  lines.push("");
  return lines.join("\n");
}

export function formatResponse(res) {
  const lines = [];

  lines.push(separator("RESPONSE", "▼"));

  const statusColor = statusToColor(res.status);
  lines.push(
    `  ${chalk.dim("❯")} ${statusColor(`${res.status}`.padEnd(4))} ${chalk.white(res.statusText)}`
  );

  lines.push("");
  lines.push(`  ${chalk.dim("── Headers ──")}`);
  const resHeaders = res.headers || {};
  for (const [key, val] of Object.entries(resHeaders)) {
    lines.push(
      `  ${chalk.cyan(key.padEnd(24))} ${chalk.white(val)}`
    );
  }

  if (res.body !== undefined && res.body !== null && res.body !== "") {
    lines.push("");
    lines.push(`  ${chalk.dim("── Body ──")}`);
    const formatted = formatBody(res.body, resHeaders["content-type"]);
    for (const line of formatted.split("\n")) {
      lines.push(`  ${line}`);
    }
  }

  const size = res.body ? Buffer.byteLength(res.body, "utf-8") : 0;
  lines.push("");
  lines.push(
    `  ${chalk.dim("Size:")} ${chalk.white(formatBytes(size))}`
  );

  lines.push("");
  return lines.join("\n");
}

export function formatTiming(timing) {
  if (!timing) return "";

  const lines = [];
  lines.push(separator("TIMING", "⏱"));

  const phases = [
    ["DNS Lookup", timing.dns],
    ["TCP Connect", timing.tcp],
    ["TLS Handshake", timing.tls],
    ["First Byte (TTFB)", timing.ttfb],
    ["Content Download", timing.download],
    ["Total", timing.total],
  ];

  const maxBarWidth = 30;
  const maxTime = Math.max(...phases.map(([, v]) => v || 0), 0.001);

  for (const [label, ms] of phases) {
    if (ms === undefined || ms === null) continue;
    const barWidth = Math.max(1, Math.round((ms / maxTime) * maxBarWidth));
    const bar = "█".repeat(barWidth);
    const barColor = ms / timing.total > 0.5 ? chalk.red : ms / timing.total > 0.25 ? chalk.yellow : chalk.green;
    lines.push(
      `  ${chalk.dim(label.padEnd(22))} ${barColor(bar)} ${chalk.white(ms.toFixed(0) + " ms")}`
    );
  }

  lines.push("");
  return lines.join("\n");
}

function separator(title, icon) {
  const width = 58;
  const content = ` ${icon} ${title} ${icon} `;
  const padSide = Math.floor((width - content.length) / 2);
  const left = "─".repeat(Math.max(0, padSide));
  const right = "─".repeat(Math.max(0, width - content.length - padSide));
  return chalk.dim(`  ${left}${chalk.bold(content)}${right}`);
}

function methodToColor(method) {
  const colors = {
    GET: chalk.green,
    POST: chalk.yellow,
    PUT: chalk.blue,
    PATCH: chalk.magenta,
    DELETE: chalk.red,
    HEAD: chalk.gray,
    OPTIONS: chalk.gray,
  };
  return colors[method] || chalk.white;
}

function statusToColor(status) {
  if (status < 200) return chalk.white;
  if (status < 300) return chalk.green;
  if (status < 400) return chalk.yellow;
  return chalk.red;
}

function formatBody(body, ct) {
  if (!body) return chalk.dim("(empty)");

  const isJson = ct?.includes("json") || isJsonString(body);

  if (isJson) {
    try {
      const parsed = JSON.parse(body);
      const formatted = JSON.stringify(parsed, null, 2);
      return syntaxHighlightJson(formatted);
    } catch {
      return body;
    }
  }

  if (ct?.includes("html")) {
    return chalk.dim(body.substring(0, 500));
  }

  if (ct?.includes("xml")) {
    return chalk.dim(body.substring(0, 500));
  }

  return body.substring(0, 2000);
}

function isJsonString(str) {
  if (typeof str !== "string") return false;
  const trimmed = str.trim();
  return (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
    (trimmed.startsWith("[") && trimmed.endsWith("]"));
}

function syntaxHighlightJson(json) {
  return json.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
    (match) => {
      let color = chalk.white;
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          color = chalk.cyan;
          match = match.replace(/:$/, "");
          return color(match) + chalk.dim(":");
        } else {
          color = chalk.yellow;
        }
      } else if (/true/.test(match)) {
        color = chalk.green;
      } else if (/false/.test(match)) {
        color = chalk.red;
      } else if (/null/.test(match)) {
        color = chalk.gray;
      } else {
        color = chalk.magenta;
      }
      return color(match);
    }
  );
}

function maskSensitive(key, value) {
  const sensitive = ["authorization", "cookie", "set-cookie", "x-api-key", "token"];
  if (sensitive.includes(key.toLowerCase())) {
    if (value.length > 8) {
      return value.slice(0, 4) + "••••" + value.slice(-4);
    }
    return "••••";
  }
  return value;
}

function formatBytes(bytes) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}
