import { NextApiRequest, NextApiResponse } from "next";
import promClient from "prom-client";
import { httpRequestCount, httpRequestDuration } from "./common.metric";

const PREFIX = "next_app";

const register = new promClient.Registry();

if (!register.getMetricsAsArray.length) {
  register.registerMetric(httpRequestCount);
  register.registerMetric(httpRequestDuration);

  register.setDefaultLabels({ app: PREFIX });

  promClient.collectDefaultMetrics({ register });
}

export default register;

// http_requests_total
// 시간 | method | route | statusCode | app
// 2023.. | GET. | hello / 2000 |  next_app
