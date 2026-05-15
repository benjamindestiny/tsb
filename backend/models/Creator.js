const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const creatorSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true, lowercase: true, minlength: 3 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6, select: false },
  displayName: { type: String, default: "" },
  bio: { type: String, default: "" },
  avatar: { type: String, default: "" },
  socialLinks: [{ platform: String, url: String, label: String }],
  opayNumber: { type: String, default: "" },
  totalEarned: { type: Number, default: 0 },
  monthlyGoal: { type: Number, default: 0 },
  showRecentSupporters: { type: Boolean, default: true },
  isVerified: { type: Boolean, default: false },
  verificationToken: { type: String, default: "" },
  verificationTokenExpires: { type: Date },
  wallet: {
    balance: { type: Number, default: 0 },
    totalEarned: { type: Number, default: 0 },
    pendingWithdrawal: { type: Number, default: 0 },
  },
  bankDetails: {
    bankName: { type: String, default: "" },
    accountNumber: { type: String, default: "" },
    accountName: { type: String, default: "" },
    opayNumber: { type: String, default: "" },
  },
  createdAt: { type: Date, default: Date.now },
});

// pre-save hook removed - password hashed in route

creatorSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const Creator = mongoose.model("Creator", creatorSchema);

const withdrawalSchema = new mongoose.Schema({
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "Creator", required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ["pending", "processing", "completed", "rejected"], default: "pending" },
  paymentMethod: { type: String, enum: ["bank_transfer", "opay"], required: true },
  bankDetails: { bankName: String, accountNumber: String, accountName: String },
  adminNote: { type: String, default: "" },
  processedAt: Date,
  createdAt: { type: Date, default: Date.now },
});

const Withdrawal = mongoose.model("Withdrawal", withdrawalSchema);

module.exports = { Creator, Withdrawal };
