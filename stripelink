import express from "express";

const app = express();

app.post("/webhook", express.raw({ type: "application/json" }), (req, res) => {
  console.log("Webhook received!");
  res.sendStatus(200);
});

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(3000, () => console.log("Running"));
