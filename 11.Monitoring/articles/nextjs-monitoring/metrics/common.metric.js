import promClient from "prom-client";

export const httpRequestCount = new promClient.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "statusCode"],
  registers: [], // Prevent global register registration
});
