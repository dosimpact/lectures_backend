const log4jsConfig = {
  appenders: {
    app: {
      type: "console",
    },
    infoFile: {
      type: "file",
      filename: "./log/info.log",
      maxLogSize: 524288,
      numBackups: 3,
      compress: true,
    },
    info: {
      type: "logLevelFilter",
      level: "INFO",
      appender: "infoFile",
    },
    errorFile: {
      type: "file",
      filename: "./log/errors.log",
      maxLogSize: 524288,
      numBackups: 3,
      compress: true,
    },
    errors: {
      type: "logLevelFilter",
      level: "ERROR",
      appender: "errorFile",
    },
  },
  categories: {
    default: {
      appenders: ["app", "errors", "info"],
      level: "info",
    },
  },
};

const path = require("path");
const log4js = require("log4js");

// log4js.configure(path.join(__dirname, "log4js.json")); // configure file
log4js.configure(log4jsConfig);

const logger = require("log4js").getLogger("testCategory");
logger.info("info test");
logger.warn("warn test");
logger.error("error test");
