export function formatJson(obj) {
  try {
    return JSON.stringify(obj, null, 2);
  } catch {
    return String(obj);
  }
}

export function contentType(headers) {
  const ct = headers?.["content-type"] || headers?.["Content-Type"] || "";
  if (ct.includes("json")) return "json";
  if (ct.includes("html")) return "html";
  if (ct.includes("xml")) return "xml";
  if (ct.includes("form")) return "form";
  return "text";
}
