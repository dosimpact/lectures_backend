require("dotenv").config({ path: ".env" });
const express = require("express");
const PORT = process.env.PORT || 4000;

const bootstrap = async () => {
  const app = express();

  app.get("/", (req, res) => {
    return res.json({ ok: true });
  });

  app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
  });
};

bootstrap();
