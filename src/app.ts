import cookieParser from "cookie-parser";
import cors from "cors";
import apm from "elastic-apm-node";
import express, { Application } from "express";
import { esClient } from "./app/elastic/es-client";

const port: number | string = process.env.PORT || 5000;

apm.start({
  serviceName: "testService",
  serverUrl: "http://localhost:8200",
  environment: "development",
  captureBody: "all",
});

const app: Application = express();
// parser
app.use(cors());
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  res.json({ message: "all ok..." });
});

app.get("/users", (req, res) => {
  const trans = apm.startTransaction("GET /users route");

  let count = 0;

  for (let index = 0; index < 999999999; index++) {
    count += 1;
  }

  res.json({ count });
  trans.end();
});

esClient
  .ping()
  .then(() => {
    console.log("Elastic run...");
  })
  .catch((err: Error) => {
    console.log("Elastic error::" + err);
  });

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
