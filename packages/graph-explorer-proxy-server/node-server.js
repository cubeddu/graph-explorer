const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const app = express();
const https = require("https");
const fs = require("fs");
const path = require("path");
const pino = require("pino");
const { fromNodeProviderChain } = require("@aws-sdk/credential-providers");
const aws4 = require("aws4");

dotenv.config({ path: "../graph-explorer/.env" });
const milis = 5 * 60 * 1000;
// convert milis to miliseconds
const 

const proxyTimeout = process.env.PROXY_REQUEST_TIMEOUT || 5 * 60 * 1000; // 5 minutes in milliseconds
const refetchMaxRetries = process.env.PROXY_MAX_RETRIES || 1;

const proxyLogger = pino({
  level: process.env.LOG_LEVEL,
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: true,
    },
  },
});

async function getIAMHeaders(options) {
  proxyLogger.debug("IAM on");
  const credentialProvider = fromNodeProviderChain();
  let creds = await credentialProvider();
  if (creds === undefined) {
    throw new Error(
      "IAM is enabled but credentials cannot be found on the credential provider chain."
    );
  }
  const headers = aws4.sign(options, {
    accessKeyId: creds.accessKeyId,
    secretAccessKey: creds.secretAccessKey,
    sessionToken: creds.sessionToken,
  }).headers;

  return headers;
}

const errorHandler = (error, request, response, next) => {
  if (error.extraInfo) {
    proxyLogger.error(error.extraInfo + error.message);
    proxyLogger.debug(error.stack);
  } else {
    proxyLogger.error(error.message);
    proxyLogger.debug(error.stack);
  }

  response.status(error.status || 500).send({
    error: {
      status: error.status || 500,
      message: error.message || "Internal Server Error",
    },
  });
};

(async () => {
  app.use(cors());
  app.use(
    "/defaultConnection",
    express.static(
      path.join(__dirname, "../graph-explorer/defaultConnection.json")
    )
  );
  if (process.env.NEPTUNE_NOTEBOOK !== "false") {
    app.use(
      "/explorer",
      express.static(path.join(__dirname, "../graph-explorer/dist"))
    );
  } else {
    app.use(
      process.env.GRAPH_EXP_ENV_ROOT_FOLDER,
      express.static(path.join(__dirname, "../graph-explorer/dist"))
    );
  }

  const retryFetch = async (url, headers, retryDelay = 10000) => {
    // remove the existing host headers, we want ensure that we are passing the DB endpoint hostname.
    delete headers["host"];
    if (headers["aws-neptune-region"]) {
      data = await getIAMHeaders({
        host: url.hostname,
        port: url.port,
        path: url.pathname + url.search,
        service: "neptune-db",
        region: headers["aws-neptune-region"],
      });
      headers = { ...headers, ...data };
    }
    for (let i = 0; i < refetchMaxRetries; i++) {
      try {
        proxyLogger.debug("Fetching: " + url.href);
        const res = await fetch(url.href, {
          headers: headers,
          signal: AbortSignal.timeout(proxyTimeout - 1000), // timing out the request before the proxy timeout
        });
        if (!res.ok) {
          const result = await res.json();
          proxyLogger.error("!!Request failure!!");
          proxyLogger.error("URL: " + url.href);
          throw new Error("\n" + JSON.stringify(result, null, 2));
        } else {
          proxyLogger.debug("Successful response: " + res.statusText);
          return res;
        }
      } catch (err) {
        if (i === refetchMaxRetries - 1) {
          proxyLogger.error("!!Proxy Retry Fetch Reached Maximum Tries!!");
          throw err;
        } else {
          proxyLogger.debug("Proxy Retry Fetch Count::: " + i);
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
        }
      }
    }
  };

  app.get("/sparql", async (req, res, next) => {
    try {
      const response = await retryFetch(
        new URL(
          `${req.headers["graph-db-connection-url"]}/sparql?query=` +
            encodeURIComponent(req.query.query) +
            "&format=json"
        ),
        req.headers
      );
      const data = await response.json();
      res.send(data);
    } catch (error) {
      next(error);
    }
  });

  app.get("/", async (req, res, next) => {
    try {
      const response = await retryFetch(
        new URL(
          `${req.headers["graph-db-connection-url"]}/?gremlin=` +
            encodeURIComponent(req.query.gremlin)
        ),
        req.headers
      );
      const data = await response.json();
      res.send(data);
    } catch (error) {
      next(error);
    }
  });

  app.get("/openCypher", async (req, res, next) => {
    try {
      const response = await retryFetch(
        new URL(
          `${req.headers["graph-db-connection-url"]}/openCypher?query=` +
            encodeURIComponent(req.query.query)
        ),
        req.headers
      );
      const data = await response.json();
      res.send(data);
    } catch (error) {
      next(error);
    }
  });

  app.get("/pg/statistics/summary", async (req, res, next) => {
    try {
      const response = await retryFetch(
        new URL(
          `${req.headers["graph-db-connection-url"]}/pg/statistics/summary`
        ),
        req.headers
      );
      const data = await response.json();
      res.send(data);
    } catch (err) {
      next();
    }
  });

  app.get("/rdf/statistics/summary", async (req, res, next) => {
    try {
      const response = await retryFetch(
        new URL(
          `${req.headers["graph-db-connection-url"]}/rdf/statistics/summary`
        ),
        req.headers
      );
      const data = await response.json();
      res.send(data);
    } catch (err) {
      next();
    }
  });

  app.get("/logger", (req, res) => {
    let message;
    let level;

    try {
      if (req.headers["level"] === undefined) {
        throw new Error("No log level passed.");
      } else {
        level = req.headers["level"];
      }

      if (req.headers["message"] === undefined) {
        throw new Error("No log message passed.");
      } else {
        message = req.headers["message"].replaceAll("\\", "");
      }

      if (level.toLowerCase() === "error") {
        proxyLogger.error(message);
      } else if (level.toLowerCase() === "warn") {
        proxyLogger.warn(message);
      } else if (level.toLowerCase() === "info") {
        proxyLogger.info(message);
      } else if (level.toLowerCase() === "debug") {
        proxyLogger.debug(message);
      } else if (level.toLowerCase() === "trace") {
        proxyLogger.trace(message);
      } else {
        throw new Error("Tried to log to an unknown level.");
      }

      res.send("Log received.");
    } catch (error) {
      next(error);
    }
  });

  app.use(errorHandler);
  app.timeout = proxyTimeout; // Express default is 120000 (2 minutes)

  // Start the server on port 80 or 443 (if HTTPS is enabled)
  if (process.env.NEPTUNE_NOTEBOOK === "true") {
    app.listen(9250, async () => {
      console.log(
        `\tProxy available at port 9250 for Neptune Notebook instance`
      );
    });
  } else if (
    process.env.PROXY_SERVER_HTTPS_CONNECTION !== "false" &&
    fs.existsSync("../graph-explorer-proxy-server/cert-info/server.key") &&
    fs.existsSync("../graph-explorer-proxy-server/cert-info/server.crt")
  ) {
    https
      .createServer(
        {
          key: fs.readFileSync("./cert-info/server.key"),
          cert: fs.readFileSync("./cert-info/server.crt"),
        },
        app
      )
      .listen(443, async () => {
        proxyLogger.info(`Proxy server located at https://localhost`);
      });
  } else {
    app.listen(80, async () => {
      proxyLogger.info(`Proxy server located at http://localhost`);
    });
  }
})();
