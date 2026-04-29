import express from "express";

const app = express();

app.post("/webhook", express.raw({ type: "application/json" }), (req, res) => {
  console.log("Webhook received!");
  res.sendStatus(200);
});

app.get("/", (req, res) => {
  res.send("Server is running");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
