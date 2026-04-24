import chalk from "chalk";

export function showBanner() {
  const logo = `
  ███████╗███████╗██╗  ██╗   ██╗
  ╚══███╔╝██╔════╝██║  ╚██╗ ██╔╝
    ███╔╝ █████╗  ██║   ╚████╔╝
   ███╔╝  ██╔══╝  ██║    ╚██╔╝
  ███████╗███████╗███████╗██║
  ╚══════╝╚══════╝╚══════╝╚═╝`;

  const lines = logo.split("\n").filter((l) => l.trim());

  console.log();
  for (const line of lines) {
    console.log(chalk.cyan(line));
  }

  console.log();
  console.log(
    chalk.bold.white("  zcurl"),
    chalk.dim(" — a beautifully colored curl alternative")
  );
  console.log();

  const commands = [
    ["zcurl <url>", "Make a GET request"],
    ["zcurl -X POST <url> -d '<body>'", "Make a POST request"],
    ["zcurl -H 'Key: Value' <url>", "Send custom headers"],
    ["zcurl --auth <token> <url>", "Send Bearer token"],
    ["zcurl --replay", "Replay last request"],
    ["zcurl --history", "Show request history"],
  ];

  for (const [cmd, desc] of commands) {
    console.log(
      chalk.white("  ❯"),
      chalk.cyan(cmd.padEnd(40)),
      chalk.dim(desc)
    );
  }

  console.log();
  console.log(chalk.dim("  Run"), chalk.cyan("zcurl --help"), chalk.dim("for all options"));
  console.log();
}
