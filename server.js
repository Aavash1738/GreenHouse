const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./config/db");

const app = express();

dotenv.config();
connectDB();

app.use(express.json());
app.use(morgan("dev"));

// API routes
app.use("/api/v1/user", require("./routes/userRoutes"));
app.use("/api/v1/admin", require("./routes/adminRoutes"));

// Serve static files from React frontend build
app.use(express.static(path.join(__dirname, "client", "build")));

// Handle React routing, return index.html for unknown routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
