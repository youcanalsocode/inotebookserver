require("dotenv").config();
const connectToMongo = require("./db");
connectToMongo();
const cors = require("cors");
const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
app.use(cors());

app.use(express.json());
//Available routing
app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));

app.get("/", (req, res) => {
  res.send("Hello World! i am connected ot db");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
