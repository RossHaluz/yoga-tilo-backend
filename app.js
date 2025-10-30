const cors = require("cors");
const dotenv = require("dotenv");
const express = require("express");

dotenv.config();

const payRoute = require("./routers/pay");
const app = express();

app.use(express.json());

app.use(cors());
app.use("/api/wayforpay", payRoute);

app.use((req, res) => {
  return res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server Error" } = err;
  return res.status(status).json({ message });
});

module.exports = { app };
