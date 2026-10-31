const express = require("express");
const session = require("express-session");
const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const app = express();
app.use(session({ secret: process.env.SESSION_SECRET || "dev", resave: false, saveUninitialized: false }));
app.get("/", async (req, res) => { req.session.views = (req.session.views || 0) + 1; res.send("Orders " + req.session.views); });
app.listen(process.env.PORT || 8080, "0.0.0.0");
