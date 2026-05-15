const express = require("express");
const router = express.Router();
const { Withdrawal } = require("../models/Creator");
const { Creator } = require("../models/Creator");
const { protect } = require("../middleware/auth");
const { sendWithdrawalEmail } = require("../services/emailService");

// POST /api/withdrawals/request
router.post("/request", protect, async (req, res) => {
  try {
    const { amount, paymentMethod, bankDetails } = req.body;

    if (!amount || amount < 3000) {
      return res.status(400).json({ success: false, message: "Minimum withdrawal is ₦3,000" });
    }

    const creator = await Creator.findById(req.creator._id);
    if (creator.wallet.balance < amount) {
      return res.status(400).json({ success: false, message: "Insufficient balance" });
    }

    const withdrawal = await Withdrawal.create({
      creator: req.creator._id,
      amount,
      paymentMethod,
      bankDetails,
      status: "pending",
    });

    // Deduct from balance
    creator.wallet.balance -= amount;
    creator.wallet.pendingWithdrawal += amount;
    await creator.save();

    // Send email in background
    sendWithdrawalEmail(creator, withdrawal).catch((err) =>
      console.log("Withdrawal email failed:", err.message)
    );

    res.status(201).json({ success: true, withdrawal });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/withdrawals/history
router.get("/history", protect, async (req, res) => {
  try {
    const withdrawals = await Withdrawal.find({ creator: req.creator._id })
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({ success: true, withdrawals });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
