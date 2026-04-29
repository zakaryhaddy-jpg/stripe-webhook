import express from "express";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

const app = express();

app.post("/webhook", express.raw({ type: "application/json" }), async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.sendStatus(400);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const customerEmail = session.customer_details?.email;

    console.log(`Payment confirmed for ${customerEmail}`);

    const { error } = await supabase
      .from("users")
      .update({ paid: true })
      .eq("email", customerEmail);

    if (error) {
      console.error("Failed to mark user as paid:", error.message);
      return res.sendStatus(500);
    }

    console.log(`Marked ${customerEmail} as paid in the database`);
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
