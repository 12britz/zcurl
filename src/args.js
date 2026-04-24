import { URL } from "url";

export function parseArgs(argv) {
  const result = {
    method: "GET",
    url: "",
    headers: {},
    data: null,
    verbose: false,
    replay: false,
    history: false,
    queryParams: {},
    count: 1,
    concurrency: 1,
  };

  let i = 0;
  while (i < argv.length) {
    const arg = argv[i];

    switch (arg) {
      case "-X":
      case "--method":
        result.method = argv[++i]?.toUpperCase() || "GET";
        break;

      case "-H":
      case "--header":
        i++;
        if (argv[i]) {
          const colonIdx = argv[i].indexOf(":");
          if (colonIdx > 0) {
            const key = argv[i].slice(0, colonIdx).trim();
            const val = argv[i].slice(colonIdx + 1).trim();
            result.headers[key] = val;
          }
        }
        break;

      case "-n":
      case "--count":
        i++;
        result.count = parseInt(argv[i], 10) || 1;
        break;

      case "-c":
      case "--concurrency":
        i++;
        result.concurrency = parseInt(argv[i], 10) || 1;
        break;

      case "-d":
      case "--data":
      case "--data-raw":
        i++;
        result.data = argv[i] || "";
        if (result.method === "GET") result.method = "POST";
        break;

      case "-q":
      case "--query":
        i++;
        if (argv[i]) {
          const eqIdx = argv[i].indexOf("=");
          if (eqIdx > 0) {
            result.queryParams[argv[i].slice(0, eqIdx)] = argv[i].slice(eqIdx + 1);
          }
        }
        break;

      case "-v":
      case "--verbose":
        result.verbose = true;
        break;

      case "--replay":
        result.replay = true;
        break;

      case "--history":
        result.history = true;
        break;

      case "-o":
      case "--output":
        i++;
        result.outputFile = argv[i];
        break;

      case "--timeout":
        i++;
        result.timeout = parseInt(argv[i], 10) || 30000;
        break;

      case "--auth":
        i++;
        if (argv[i]) {
          const atIdx = argv[i].indexOf(":");
          if (atIdx > 0) {
            const user = argv[i].slice(0, atIdx);
            const pass = argv[i].slice(atIdx + 1);
            result.headers["Authorization"] = `Basic ${Buffer.from(`${user}:${pass}`).toString("base64")}`;
          } else {
            result.headers["Authorization"] = `Bearer ${argv[i]}`;
          }
        }
        break;

      case "-j":
      case "--json":
        result.headers["Content-Type"] = "application/json";
        result.jsonOutput = true;
        break;

      case "-f":
      case "--form":
        result.headers["Content-Type"] = "application/x-www-form-urlencoded";
        result.form = true;
        break;

      case "--download":
        result.download = true;
        break;

      case "-L":
      case "--location":
        result.followRedirects = true;
        break;

      case "-k":
      case "--insecure":
        result.insecure = true;
        break;

      case "--max-time":
        i++;
        result.timeout = (parseInt(argv[i], 10) || 30) * 1000;
        break;

      case "--help":
      case "-h":
        showHelp();
        process.exit(0);
        break;

      default:
        if (!arg.startsWith("-")) {
          if (!result.url) {
            result.url = arg;
            if (!result.url.startsWith("http")) {
              result.url = "https://" + result.url;
            }
          }
        }
        break;
    }
    i++;
  }

  if (result.data && !result.headers["Content-Type"]) {
    try {
      JSON.parse(result.data);
      result.headers["Content-Type"] = "application/json";
    } catch {
      result.headers["Content-Type"] = "application/x-www-form-urlencoded";
    }
  }

  if (Object.keys(result.queryParams).length > 0 && result.url) {
    const urlObj = new URL(result.url);
    for (const [k, v] of Object.entries(result.queryParams)) {
      urlObj.searchParams.append(k, v);
    }
    result.url = urlObj.toString();
  }

  if (result.count === 1 && result.concurrency > 1) {
    result.count = result.concurrency;
  }

  return result;
}

function showHelp() {
  console.log(`
zcurl — a beautifully colored curl alternative

USAGE:
  zcurl <URL>                          Make a GET request
  zcurl -X POST <URL> -d '{"key":"val"}'   Make a POST request

METHOD:
  -X, --method <METHOD>     HTTP method (GET, POST, PUT, PATCH, DELETE, etc.)

HEADERS:
  -H, --header <K:V>        Set header (e.g., -H "Content-Type: application/json")
  --auth <user:pass|token>  Basic auth (user:pass) or Bearer token

DATA:
  -d, --data <body>         Request body (sets POST if GET)
  -q, --query <K=V>         Add query parameter

CONCURRENCY:
  -n, --count <number>      Total number of requests to make
  -c, --concurrency <num>   Number of concurrent requests

FLAGS:
  -v, --verbose             Show full request and response details
  -j, --json                Force JSON content type and pretty output
  -f, --form                Force form-urlencoded content type
  -L, --location            Follow redirects
  -k, --insecure            Skip TLS verification
  --timeout <ms>            Request timeout in milliseconds
  --max-time <sec>          Request timeout in seconds

OUTPUT:
  -o, --output <file>       Save response body to file
  --download                Download response as file

HISTORY:
  --replay                  Replay the last request
  --history                 Show request history

OTHER:
  -h, --help                Show this help message
`);
}
