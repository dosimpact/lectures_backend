import { NextApiRequest, NextApiResponse } from "next";
import promClient from "prom-client";
import { httpRequestCount } from "./common.metric";

const register = new promClient.Registry();

if (!register.getMetricsAsArray.length) {
  register.registerMetric(httpRequestCount);
  register.setDefaultLabels({ app: "NEXT_APP" });
  promClient.collectDefaultMetrics({ register });
}

export default register;
