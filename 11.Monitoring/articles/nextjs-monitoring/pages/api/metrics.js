import { NextApiRequest, NextApiResponse } from "next";
import promClient from "prom-client";
import register from "../../metrics/index";

export default async function handler(req, res, next) {
  res.setHeader("Content-type", register.contentType);
  res.send(await register.metrics());
}
