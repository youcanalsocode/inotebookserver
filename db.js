const mongoose = require("mongoose");

const mongoURI = "mongodb://localhost:27017/iNotebooks";

async function connectToMongo() {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Wait until the connection is ready
    await mongoose.connection.readyState;

    console.log("Connected to Mongo Successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1); // Exit process with failure
  }
}

module.exports = connectToMongo;
