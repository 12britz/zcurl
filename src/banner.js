import chalk from "chalk";

const B = { tl: "┌", tr: "┐", bl: "└", br: "┘", h: "─", v: "│" };
const P = chalk.cyan, W = chalk.white, D = chalk.dim;

export function showBanner() {
  const logo = `
  ███████╗███████╗██╗  ██╗   ██╗
  ╚══███╔╝██╔════╝██║  ╚██╗ ██╔╝
    ███╔╝ █████╗  ██║   ╚████╔╝
   ███╔╝  ██╔══╝  ██║    ╚██╔╝
  ███████╗███████╗███████╗██║
  ╚══════╝╚══════╝╚══════╝╚═╝`;

  const lines = logo.split("\n").filter((l) => l.trim());
  const w = 54;

  console.log();
  console.log(D(B.tl + B.h.repeat(w) + B.tr));
  for (const line of lines) {
    console.log(D(B.v) + " ".repeat(w / 2 - 4) + P(line) + " ".repeat(w / 2 + 2) + D(B.v));
  }
  console.log(D(B.v + " ".repeat(w) + B.v));

  console.log(D(B.v) + " ".repeat(8) + P.bold("zcurl") + W("  a beautifully colored curl alternative") + " ".repeat(w - 36) + D(B.v));
  console.log(D(B.bl + B.h.repeat(w) + B.br));
  console.log();

  const commands = [
    ["zcurl <url>", "Make a GET request"],
    ["zcurl -X POST <url> -d '<body>'", "Make a POST request"],
    ["zcurl -H 'Key: Value' <url>", "Send custom headers"],
    ["zcurl --auth <token> <url>", "Send Bearer token"],
    ["zcurl --replay", "Replay last request"],
    ["zcurl --history", "Show request history"],
  ];

  console.log(D(B.tl + B.h.repeat(w) + B.tr));
  for (const [cmd, desc] of commands) {
    console.log(D(B.v) + "  " + P(cmd.padEnd(36)) + D(desc.padEnd(w - 38)) + D(B.v));
  }
  console.log(D(B.bl + B.h.repeat(w) + B.br));
  console.log(D(" ── Run ") + P("zcurl --help") + D(" for all options ──"));
  console.log();
}