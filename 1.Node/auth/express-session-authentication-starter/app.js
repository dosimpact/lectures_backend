const express = require("express");
// const mongoose = require("mongoose");
const session = require("express-session");
var passport = require("passport");
var crypto = require("crypto");
var routes = require("./routes");
// const connection = require("./config/database");

const redis = require("redis");
const FileStore = require("session-file-store")(session);
const RedisStore = require("connect-redis")(session);

// Package documentation - https://www.npmjs.com/package/connect-mongo
// const MongoStore = require("connect-mongo")(session);

// Need to require the entire Passport config module so app.js knows about it
require("./config/passport");

/**
 * -------------- GENERAL SETUP ----------------
 */

// Gives us access to variables set in the .env file via `process.env.VARIABLE_NAME` syntax
require("dotenv").config();

const bootstrap = async () => {
  // redis-cli -h 221.153.254.18 -p 27000 -a dosimpact
  const client = redis.createClient({
    url: "redis://:dosimpact@221.153.254.18:27000",
    legacyMode: true,
  });
  client.on("connect", () => console.log("✔️ Redis Session connected"));
  await client.connect().catch(console.error);

  // Create the Express application
  var app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  /**
   * -------------- SESSION SETUP ----------------
   */
  // TODO

  /**
   * -------------- PASSPORT AUTHENTICATION ----------------
   */
  app.use(passport.initialize());
  app.use(passport.session());

  /**
   * -------------- ROUTES ----------------
   */

  // Imports all of the routes from ./routes/index.js
  app.use(routes);

  /**
   * -------------- SERVER ----------------
   */

  // Server listens on http://localhost:3000
  app.listen(4000);
};
bootstrap();
