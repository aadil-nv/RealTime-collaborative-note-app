const mongoose = require("mongoose");
require("colors");

let dbInstance;

const connectDB = async () => {
  try {
    if (process.env.MONGODB_URL) {
      dbInstance = await mongoose.connect(process.env.MONGODB_URL);
      console.log("Database connected successfully!".bgYellow.bold);
    } else {
      throw new Error("MONGODB_URL not defined");
    }
  } catch (error) {
    console.error("DB connection failed: ".red + error);
    process.exit(1);
  }
};

module.exports = { connectDB, dbInstance };
