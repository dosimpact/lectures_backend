require("dotenv").config({ path: ".env" });
const express = require("express");
const GhostAdminAPI = require("@tryghost/admin-api");

const PORT = process.env.PORT || 4000;

const bootstrap = async () => {
  const api = new GhostAdminAPI({
    url: "https://travel.journeyjester.com",
    key: "652e03091229680001b71dad:8a79811ad94e955efef505f93a1c94cf990e9f320077a54507fe3b258b169af1",
    version: "v5.0",
  });

  // console.log(await api.posts.browse());
  // console.log(await api.posts.read({ id: "652955e034b96c0001fc5442" }));
  console.log(await api.posts.read({ id: "652955e034b96c0001fc5442" }));

  const app = express();

  app.get("/", (req, res) => {
    return res.json({ ok: true });
  });

  app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
  });
};

bootstrap();
