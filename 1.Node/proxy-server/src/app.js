require("dotenv").config({ path: ".env" });
const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const cors = require("cors");
const morgan = require('morgan')

const PORT = process.env.PORT || 4000;

const bootstrap = async () => {
  const app = express();

  app.set("trust proxy", true);

  app.use(morgan('dev'));
  app.use(cors());

  app.set("trust proxy", true);
  app.get("/", (req, res) => {
    return res.json({ ok: true });
  });

  app.use(
    "/problem/3190",
    createProxyMiddleware({
      target: "https://www.acmicpc.net",
      changeOrigin: true,
      pathRewrite: {
        "^/problem/3190": "/problem/3190",
      },
    }),
  );

  app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
  });
};

bootstrap();
