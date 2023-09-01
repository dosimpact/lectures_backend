// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { httpRequestCount } from "../../metrics/common.metric";

export default (req, res) => {
  httpRequestCount
    .labels({
      method: req.method,
      route: req.url,
      statusCode: res.statusCode,
    })
    .inc();

  res.status(200).json({ name: "John Doe" });
};
