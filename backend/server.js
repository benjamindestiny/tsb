const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.log("❌ MongoDB connection failed:", err.message));

app.use("/api/auth", require("./routes/auth"));
app.use("/api/donations", require("./routes/donations"));
app.use("/api/creator", require("./routes/creator"));
app.use("/api/withdrawals", require("./routes/withdrawals"));
app.use("/api/payments", require("./routes/payments"));

app.get("/", (req, res) => {
  res.json({ message: "tsb Server is running!", status: "success" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 tsb Server running on port ${PORT}`);
});
