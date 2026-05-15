const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema({
  donorName: {
    type: String,
    required: true,
  },
  donorEmail: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: "NGN",
  },
  message: {
    type: String,
    default: "",
  },
  isAnonymous: {
    type: Boolean,
    default: false,
  },
  paymentMethod: {
    type: String,
    enum: ["paystack", "opay", "bank_transfer"],
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "pending",
  },
  paymentReference: {
    type: String,
    default: "",
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Creator",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Donation", donationSchema);
