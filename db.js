const mongoose = require("mongoose");

const mongoURI = "mongodb://localhost:27017/iNotebooks";

async function connectToMongo() {
  try {
    await mongoose.connect(mongoURI, {});

    console.log("Connected to Mongo Successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1); // Exit process with failure
  }
}

module.exports = connectToMongo;
