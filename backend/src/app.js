const express = require("express");
const cors = require("cors");
const jobRoutes = require("./routes/jobRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "DevBoard API is running" });
});

app.use("/api/jobs", jobRoutes);
app.use("/api/auth", authRoutes);

module.exports = app;
