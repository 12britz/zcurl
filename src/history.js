import chalk from "chalk";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { homedir } from "os";
import { join } from "path";

const HISTORY_DIR = join(homedir(), ".zcurl");
const HISTORY_FILE = join(HISTORY_DIR, "history.json");
const MAX_HISTORY = 100;

export function loadHistory() {
  if (!existsSync(HISTORY_FILE)) return [];
  try {
    const data = readFileSync(HISTORY_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function saveToHistory(entry) {
  const history = loadHistory();

  history.push({
    ...entry,
    timestamp: Date.now(),
  });

  if (history.length > MAX_HISTORY) {
    history.splice(0, history.length - MAX_HISTORY);
  }

  if (!existsSync(HISTORY_DIR)) {
    mkdirSync(HISTORY_DIR, { recursive: true });
  }

  writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2));
}

export function showHistory() {
  const history = loadHistory();
  if (history.length === 0) {
    console.log("No request history found.");
    return;
  }

  console.log(`\n  Request History (${history.length} entries)\n`);

  for (let i = history.length - 1; i >= 0; i--) {
    const entry = history[i];
    const date = new Date(entry.timestamp).toLocaleString();
    console.log(
      `  ${String(i + 1).padStart(3)}  ${entry.method.padEnd(7)} ${entry.url}  ${chalk.dim(date)}`
    );
  }

  console.log();
}
