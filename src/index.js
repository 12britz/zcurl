#!/usr/bin/env node

import chalk from "chalk";
import { parseArgs } from "./args.js";
import { showBanner } from "./banner.js";
import { makeRequest } from "./client.js";
import { formatRequest, formatResponse, formatTiming, computeWidth } from "./formatter.js";
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

if (parsed.count > 1) {
  const results = [];
  const concurrency = Math.max(1, parsed.concurrency || 1);
  const total = parsed.count;
  const queue = Array.from({ length: total }, (_, i) => i);
  
  process.stdout.write(chalk.cyan(`\n🚀 Dispatching ${total} requests (${concurrency} concurrent)...\n`));

  const workers = Array.from({ length: Math.min(concurrency, total) }, async () => {
    while (queue.length > 0) {
      const id = queue.shift();
      try {
        const res = await makeRequest(parsed);
        results.push({ id, status: res.response.status, timing: res.timing });
        process.stdout.write(chalk.green("✔"));
      } catch (err) {
        results.push({ id, status: 0, error: err.message });
        process.stdout.write(chalk.red("✘"));
      }
    }
  });

  await Promise.all(workers);
  process.stdout.write("\n\n");

  const success = results.filter(r => r.status >= 200 && r.status < 300).length;
  const failed = total - success;
  const timings = results.filter(r => r.timing).map(r => r.timing.total);
  const avgTime = timings.length ? (timings.reduce((a, b) => a + b, 0) / timings.length) : 0;
  const minTime = timings.length ? Math.min(...timings) : 0;
  const maxTime = timings.length ? Math.max(...timings) : 0;

  console.log(chalk.bold.cyan("── CONCURRENCY SUMMARY ──"));
  console.log(`${chalk.white("Total Requests:  ")} ${total}`);
  console.log(`${chalk.white("Success:         ")} ${chalk.green(success)}`);
  console.log(`${chalk.white("Failed:          ")} ${chalk.red(failed)}`);
  console.log(`${chalk.white("Average Time:    ")} ${chalk.yellow(avgTime.toFixed(2) + " ms")}`);
  console.log(`${chalk.white("Min / Max:       ")} ${chalk.dim(minTime.toFixed(2))} / ${chalk.dim(maxTime.toFixed(2))} ms`);
  console.log(chalk.bold.cyan("─────────────────────────\n"));
  
  process.exit(0);
}

const { request, response, timing } = await makeRequest(parsed);

computeWidth(request, response);

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