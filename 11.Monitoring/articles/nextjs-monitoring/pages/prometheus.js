import { register, collectDefaultMetrics } from "prom-client";

// Create a custom counter metric for counting HTTP requests
const httpRequestCount = new Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "statusCode"],
});

// Initialize Prometheus metrics collection
collectDefaultMetrics();

// Export a middleware function to expose a /metrics endpoint
export default function (req, res) {
  res.set("Content-Type", register.contentType);
  res.end(register.metrics());
}

// Export the custom counter metric for use in your application
export { httpRequestCount };
