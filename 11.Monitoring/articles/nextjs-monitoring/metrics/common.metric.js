import promClient from "prom-client";

// api call counter
export const httpRequestCount = new promClient.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "statusCode"],
  registers: [], // Prevent global register registration
});

// api duration
export const httpRequestDuration = new promClient.Gauge({
  name: "http_requests_duration",
  help: "time interval of HTTP requests",
  labelNames: ["method", "route", "statusCode"],
  registers: [], // Prevent global register registration
});
