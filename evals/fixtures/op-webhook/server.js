const express = require("express");
const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const app = express();
const paid = new Set();

app.post("/api/webhooks/stripe", express.raw({ type: "application/json" }), (req, res) => {
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, req.headers["stripe-signature"], process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send("Bad signature");
  }
  if (event.type === "checkout.session.completed") paid.add(event.data.object.id);
  res.json({ received: true });
});

app.get("/", (req, res) => res.send("Paid orders: " + paid.size));
app.listen(process.env.PORT || 8080, "0.0.0.0");
