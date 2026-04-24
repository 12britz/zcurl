#!/usr/bin/env node

import chalk from "chalk";
import { parseArgs } from "./args.js";
import { showBanner } from "./banner.js";
import { makeRequest } from "./client.js";
import { formatRequest, formatResponse, formatTiming } from "./formatter.js";
import { loadHistory, saveToHistory, showHistory } from "./history.js";

const args = process.argv.slice(2);

if (args.length === 0) {
  showBanner();
  process.exit(0);
}

const parsed = parseArgs(args);

if (parsed.history) {
  showHistory();
  process.exit(0);
}

if (parsed.replay) {
  const history = loadHistory();
  const last = history[history.length - 1];
  if (!last) {
    console.log(chalk.red("No previous requests found in history."));
    process.exit(1);
  }
  parsed.method = last.method || "GET";
  parsed.url = last.url;
  parsed.headers = last.headers || {};
  parsed.data = last.body || null;
}

const { request, response, timing } = await makeRequest(parsed);

console.log(formatRequest(request));
console.log(formatResponse(response));
console.log(formatTiming(timing));

saveToHistory({
  method: parsed.method,
  url: parsed.url,
  headers: parsed.headers,
  body: parsed.data,
  timestamp: Date.now(),
});