const mongoose = require("mongoose");

const supporterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  totalDonated: {
    type: Number,
    default: 0,
  },
  donationsCount: {
    type: Number,
    default: 0,
  },
  lastDonationDate: {
    type: Date,
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

module.exports = mongoose.model("Supporter", supporterSchema);
