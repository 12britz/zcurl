import chalk from "chalk";

const B = { tl: "┌", tr: "┐", bl: "└", br: "┘", h: "─", v: "│" };
const P = chalk.cyan, W = chalk.white, D = chalk.dim;

export function showBanner() {
  const logo = `
  ███████╗ ██████╗██╗   ██╗██████╗ ██╗     
  ╚══███╔╝██╔════╝██║   ██║██╔══██╗██║     
    ███╔╝ ██║     ██║   ██║██████╔╝██║     
   ███╔╝  ██║     ██║   ██║██╔══██╗██║     
  ███████╗╚██████╗╚██████╔╝██║  ██║███████╗
  ╚══════╝ ╚═════╝ ╚═════╝ ╚═╝  ╚═╝╚══════╝`;

  const lines = logo.split("\n").filter((l) => l.trim().length > 0);
  const w = 62;

  console.log();
  console.log(D(B.tl + B.h.repeat(w) + B.tr));
  
  const maxLineLen = Math.max(...lines.map(l => l.length));
  const leftPad = Math.floor((w - maxLineLen) / 2);
  
  for (const line of lines) {
    const plainLine = " ".repeat(leftPad) + line;
    const padRight = Math.max(0, w - plainLine.length);
    console.log(D(B.v) + P(plainLine) + " ".repeat(padRight) + D(B.v));
  }
  
  console.log(D(B.v + " ".repeat(w) + B.v));

  const titleLeft = " ".repeat(10);
  const titleText = titleLeft + "zcurl  a beautifully colored curl alternative";
  const titlePad = Math.max(0, w - titleText.length);
  console.log(D(B.v) + titleLeft + P.bold("zcurl") + W("  a beautifully colored curl alternative") + " ".repeat(titlePad) + D(B.v));
  
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
    const leftStr = "  " + cmd.padEnd(36);
    const plain = leftStr + desc;
    const padRight = Math.max(0, w - plain.length);
    console.log(D(B.v) + "  " + P(cmd.padEnd(36)) + D(desc) + " ".repeat(padRight) + D(B.v));
  }
  console.log(D(B.bl + B.h.repeat(w) + B.br));
  console.log(D(" ── Run ") + P("zcurl --help") + D(" for all options ──"));
  console.log();
}