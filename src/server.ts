import { config as dotenvConfig } from "dotenv";
dotenvConfig();

import * as express from "express";
import * as cors from "cors";
import { config } from "./config";
import { initSlackApp } from "./slack";
import { incomingMessageHandler } from "./routes/incoming";

const app = express();
app.use(express.json());
app.use(cors());
app.use((req, _res, next) => {
  console.log(`(${req.method}) ${req.path}`);
  next();
});
app.use(express.static("static"));

app.post("/incoming", incomingMessageHandler);
app.get("/ping", (_req, res) => res.send("pong"));

app.listen(config.port, "0.0.0.0", () => {
  console.log(`👂 Listening on port ${config.port}`);
});

initSlackApp().catch((error) => {
  console.log("⚠️ Slack app could not be started due to the following error :");
  console.error(error);
});
