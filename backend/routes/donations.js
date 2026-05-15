const express = require("express");
const router = express.Router();
const Donation = require("../models/Donation");
const { Creator } = require("../models/Creator");
const { protect } = require("../middleware/auth");
const { sendNewSupporterEmail } = require("../services/emailService");

// POST /api/donations/support/:username
router.post("/support/:username", async (req, res) => {
  try {
    const {
      supporterName,
      supporterEmail,
      amount,
      message,
      isAnonymous,
      paymentMethod,
      paymentReference,
    } = req.body;

    // Find the creator
    const creator = await Creator.findOne({ username: req.params.username });

    if (!creator) {
      return res.status(404).json({
        success: false,
        message: "Creator not found",
      });
    }

    // Create donation
    const donation = await Donation.create({
      creator: creator._id,
      supporterName: isAnonymous ? "Anonymous" : supporterName,
      supporterEmail,
      amount,
      message: message || "",
      isAnonymous: isAnonymous || false,
      paymentMethod,
      paymentReference,
      paymentStatus: "completed",
    });

    // Send email notification
    try {
      await sendNewSupporterEmail(creator, donation);
    } catch (emailErr) {
      console.log("Notification email failed:", emailErr.message);
    }

    // Update creator wallet balance
    await Creator.findByIdAndUpdate(creator._id, {
      $inc: {
        "wallet.balance": amount,
        "wallet.totalEarned": amount,
      },
    });

    res.status(201).json({
      success: true,
      donation,
      message: "Thank you for your support! 🎉",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Donation failed",
      error: error.message,
    });
  }
});

// GET /api/donations/my-supporters
router.get("/my-supporters", protect, async (req, res) => {
  try {
    const donations = await Donation.find({
      creator: req.creator._id,
      paymentStatus: "completed",
    })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      success: true,
      count: donations.length,
      donations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch supporters",
      error: error.message,
    });
  }
});

module.exports = router;
