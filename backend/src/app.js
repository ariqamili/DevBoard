const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const jobRoutes = require("./routes/jobRoutes");
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const applicationRoutes = require("./routes/applicationRoutes");

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.get("/health", (req, res) => {
  res.json({ status: "DevBoard API is running" });
});

app.use("/api/jobs", jobRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/applications", applicationRoutes);

module.exports = app;
