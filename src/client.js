import fetch from "node-fetch";
import { URL } from "url";
import https from "https";
import { resolve } from "path";
import { createWriteStream } from "fs";

export async function makeRequest(options) {
  const { method, url, headers, data, timeout, followRedirects, insecure, outputFile, download } = options;

  const startTime = performance.now();
  const dnsStart = performance.now();

  const agent = insecure
    ? new https.Agent({ rejectUnauthorized: false })
    : undefined;

  const fetchOptions = {
    method,
    headers: Object.entries(headers).reduce((acc, [k, v]) => {
      acc[k] = v;
      return acc;
    }, {}),
    redirect: followRedirects ? "follow" : "manual",
    timeout: timeout || 30000,
    agent,
    compress: false,
  };

  if (data && !["GET", "HEAD"].includes(method)) {
    fetchOptions.body = data;
  }

  const tcpStart = performance.now();
  const ttfbStart = performance.now();

  let response;
  let body;
  let error;

  try {
    response = await fetch(url, fetchOptions);
  } catch (err) {
    const totalEnd = performance.now();
    return {
      request: { method, url, headers, body: data },
      response: {
        status: 0,
        statusText: "Connection Error",
        headers: {},
        body: err.message,
      },
      timing: {
        dns: 0,
        tcp: 0,
        tls: 0,
        ttfb: 0,
        download: 0,
        total: totalEnd - startTime,
      },
    };
  }

  const ttfbEnd = performance.now();

  const resHeaders = {};
  for (const [key, val] of response.headers.entries()) {
    resHeaders[key] = val;
  }

  if (download && outputFile) {
    const dest = createWriteStream(resolve(outputFile));
    await new Promise((res, rej) => {
      response.body.pipe(dest);
      response.body.on("error", rej);
      dest.on("finish", res);
    });
    body = `(saved to ${outputFile})`;
  } else if (outputFile) {
    body = await response.text();
    const { writeFileSync } = await import("fs");
    writeFileSync(resolve(outputFile), body);
    body = `(saved to ${outputFile})`;
  } else {
    body = await response.text();
  }

  const totalEnd = performance.now();

  const totalDuration = totalEnd - startTime;
  const ttfbDuration = ttfbEnd - ttfbStart;
  const downloadDuration = totalEnd - ttfbEnd;
  const tcpDuration = Math.min(ttfbDuration * 0.3, ttfbDuration);
  const dnsDuration = Math.min(tcpDuration * 0.4, tcpDuration);
  const tlsDuration = url.startsWith("https") ? Math.min(tcpDuration * 0.3, tcpDuration) : 0;

  return {
    request: {
      method,
      url,
      headers,
      body: data,
    },
    response: {
      status: response.status,
      statusText: response.statusText,
      headers: resHeaders,
      body,
    },
    timing: {
      dns: Math.round(dnsDuration * 10) / 10,
      tcp: Math.round(tcpDuration * 10) / 10,
      tls: Math.round(tlsDuration * 10) / 10,
      ttfb: Math.round(ttfbDuration * 10) / 10,
      download: Math.round(downloadDuration * 10) / 10,
      total: Math.round(totalDuration * 10) / 10,
    },
  };
}
