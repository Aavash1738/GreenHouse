const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
const colors = require("colors");
const connectDB = require("./config/db");

const app = express();

app.use(express.json());
app.use(morgan("dev"));

dotenv.config();

connectDB();

//routes

app.use("/api/v1/user", require("./routes/userRoutes"));

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running in ${PORT}`);
});
