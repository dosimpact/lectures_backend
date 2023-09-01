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
