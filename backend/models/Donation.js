const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema({
  donorName: { type: String, default: "Anonymous" },
  donorEmail: { type: String, default: "anonymous@tsb.com" },
  amount: { type: Number, default: 0 },
  currency: { type: String, default: "NGN" },
  message: { type: String, default: "" },
  isAnonymous: { type: Boolean, default: false },
  paymentMethod: { type: String, default: "opay" },
  paymentStatus: { type: String, default: "pending" },
  paymentReference: { type: String, default: "" },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "Creator" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Donation", donationSchema);
