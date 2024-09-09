const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
const colors = require("colors");

const app = express();

app.use(express.json());
app.use(morgan("dev"));

dotenv.config();

//routes

app.get("/", (req, res) => {
  res.status(200).send({
    message: "Server running",
  });
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running in ${PORT}`);
});
