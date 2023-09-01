// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import {
  httpRequestCount,
  httpRequestDuration,
} from "../../metrics/common.metric";

const randomeSleep = (ms) =>
  new Promise((res, rej) => {
    const p = Math.random();
    if (p >= 0.2) rej();

    return setTimeout(res, Math.random() * ms);
  });

const hello = async (req, res) => {
  let isSuccess = true;
  const startTime = performance.now();
  let elapsedTime;
  try {
    // some api
    await randomeSleep(2);
  } catch (error) {
    isSuccess = false;
  } finally {
    const endTime = performance.now();
    elapsedTime = endTime - startTime;
  }

  httpRequestDuration
    .labels({
      method: req.method,
      route: req.url,
      statusCode: isSuccess ? 200 : 400,
    })
    .set(elapsedTime);

  httpRequestCount
    .labels({
      method: req.method,
      route: req.url,
      statusCode: isSuccess ? 200 : 400,
    })
    .inc();

  if (isSuccess) {
    return res.status(200).json({ name: isSuccess ? "John Doe" : "fail" });
  } else {
    return res.status(400).json({ message: "fail" });
  }
};

export default hello;
