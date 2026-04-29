import express from "express";

const app = express();

app.post("/webhook", express.raw({ type: "application/json" }), (req, res) => {
  console.log("Webhook received!");

  let event;
  try {
    event = JSON.parse(req.body);
  } catch (err) {
    console.error("Failed to parse webhook payload:", err.message);
    return res.sendStatus(400);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const email = session.customer_email;
    console.log("Payment successful for:", email);
    // STEP: mark user as paid in database
  }

  res.sendStatus(200);
});

app.get("/", (req, res) => {
  res.send("Server is running");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
