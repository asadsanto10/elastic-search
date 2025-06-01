import cookieParser from "cookie-parser";
import cors from "cors";
import apm from "elastic-apm-node";
import express, { Application } from "express";
import { createEsIndex } from "./app/elastic/create-index";
import { createPost } from "./app/elastic/create-post";
import { esClient } from "./app/elastic/es-client";
import { searchPost } from "./app/elastic/search-post";

const port: number | string = process.env.PORT || 5000;

apm.start({
  serviceName: "testService",
  serverUrl: "http://localhost:8200",
  environment: "development",
  captureBody: "all",
});

const indexName = "blog-posts";

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

app.get("/create-index", async (req, res) => {
  const result = await createEsIndex(indexName);
  // console.log(result);
  if (!result) {
    res.status(400).json({ error: "Index already exists or creation failed" });
    return;
  }

  res.json({ message: "index create successfully", result });
});

app.post("/create-post", async (req, res) => {
  const payload = req.body || {
    title: "Introduction to Elasticsearch",
    body: "Elasticsearch is a distributed search and analytics engine...",
    tags: ["search", "elasticsearch", "nodejs"],
    published: true,
  };

  const result = await createPost(indexName, payload);

  if (!result) {
    res.status(400).json({ error: "Post create faield!" });
    return;
  }

  res.json({ message: "Post create successfully", result });
});

app.get("/search", async (req, res) => {
  const query = req.query;
  console.log(query);

  const result = await searchPost(indexName, query);

  const data = result.hits.hits.map((hit: any) => hit._source);

  res.json({ message: "Post get successfully", result: data });
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
