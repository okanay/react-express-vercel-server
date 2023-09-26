import express from "express";
import morgan from "morgan";
import cors from "cors";

import login from "./login";
import puppeteer from "./puppeteer";

require("dotenv").config();

const app = express();

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "server is active on vercel.",
  });
});

app.use("/login", login);

app.use("/puppeteer", puppeteer);

export default app;
