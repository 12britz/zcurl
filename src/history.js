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

export function showHistory(selectNum = null) {
  const history = loadHistory();
  if (history.length === 0) {
    console.log("No request history found.");
    return null;
  }

  console.log(chalk.cyan.bold("\n  ╭───────────────────────────────────────╮"));
  console.log(chalk.cyan.bold("  │      REQUEST HISTORY                  │"));
  console.log(chalk.cyan.bold("  ╰───────────────────────────────────────╯\n"));

  console.log(chalk.dim("  #    Method    URL                              Date"));

  for (let i = history.length - 1; i >= 0; i--) {
    const entry = history[i];
    const date = new Date(entry.timestamp).toLocaleString();
    const num = String(i + 1).padStart(2);
    const method = entry.method?.padEnd(7) || "GET";
    const url = entry.url?.substring(0, 35) || "";
    
    if (selectNum && (i + 1) === selectNum) {
      console.log(chalk.cyan(` ► ${num}  ${chalk.green(method)} ${chalk.white(url)}  ${chalk.dim(date)}`));
      console.log(chalk.dim("  ────────────────────────────────────────────"));
      console.log(chalk.dim("  Headers:"));
      for (const [k, v] of Object.entries(entry.headers || {})) {
        console.log(chalk.dim(`    ${k}: ${v}`));
      }
      if (entry.body) {
        console.log(chalk.dim("  Body:"));
        console.log(chalk.dim(`    ${entry.body}`));
      }
    } else if (!selectNum) {
      console.log(chalk.dim(`  ${num}  ${chalk.green(method)} ${chalk.dim(url)}  ${chalk.dim(date)}`));
    }
  }

  if (!selectNum) {
    console.log(chalk.dim("\n  Run") + chalk.cyan(" zcurl --history #") + chalk.dim(" to see details (e.g. --history 1)"));
    console.log(chalk.dim("  Run") + chalk.cyan(" zcurl --replay") + chalk.dim(" to replay last request"));
    console.log(chalk.dim("  Run") + chalk.cyan(" zcurl --replay #") + chalk.dim(" to replay specific request"));
  }

  console.log();
  return selectNum ? history[selectNum - 1] : null;
}

export function getHistoryEntry(num) {
  const history = loadHistory();
  if (num < 1 || num > history.length) return null;
  return history[num - 1];
}