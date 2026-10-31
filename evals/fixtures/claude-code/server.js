const express = require("express");
const app = express();
app.get("/", (req, res) => res.send("Stock tracker"));
app.listen(3000, "localhost", () => console.log("listening on 3000"));
