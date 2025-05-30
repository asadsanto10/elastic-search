import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application } from "express";

const port: number | string = process.env.PORT || 5000;

const app: Application = express();
// parser
app.use(cors());
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ message: "all ok..." });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
