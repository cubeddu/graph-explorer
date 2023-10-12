import next from 'next';
import express from 'express';
import https from 'https';
import fs from 'fs';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server.all('*', (req, res) => {
    return handle(req, res);
  });

  if (process.env.NEPTUNE_NOTEBOOK === "true") {
    server.listen(9250, () => {
      console.log(`\tProxy available at port 9250 for Neptune Notebook instance`);
    });
  } else if (
    process.env.PROXY_SERVER_HTTPS_CONNECTION !== "false" &&
    fs.existsSync("../graph-explorer-proxy-server/cert-info/server.key") &&
    fs.existsSync("../graph-explorer-proxy-server/cert-info/server.crt")
  ) {
    https.createServer(
      {
        key: fs.readFileSync("./cert-info/server.key"),
        cert: fs.readFileSync("./cert-info/server.crt"),
      },
      server
    ).listen(443, () => {
      console.log(`Proxy server located at https://localhost`);
    });
  } else {
    server.listen(80, () => {
      console.log(`Proxy server located at http://localhost`);
    });
  }
});
