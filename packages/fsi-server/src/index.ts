import * as http from "http";
import * as process from "process";

import * as Koa from "koa";

import { createApp } from "./server";
import { dbApi } from "./db";
 
const doServer = async () => {
  const app = await createApp(new Koa(), { dbApi });
  const server = http.createServer(app.callback());
  server.listen(3010, () => {
    console.log("Listening on http://localhost:3010");
  });
};

doServer().catch((err) => {
  console.error(err);
  process.exit(1);
});
