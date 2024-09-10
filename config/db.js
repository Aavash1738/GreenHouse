const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB Server Connected");
  } catch (error) {
    console.log("MongoDB Server Issue");
  }
};

module.exports = connectDB;
