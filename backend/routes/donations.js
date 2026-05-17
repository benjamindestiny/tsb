const express = require("express");
const router = express.Router();
const Donation = require("../models/Donation");
const { Creator } = require("../models/Creator");
const { protect } = require("../middleware/auth");

// POST /api/donations/support/:username
router.post("/support/:username", async (req, res) => {
  try {
    const {
      donorName,
      donorEmail,
      supporterName,  // Accept old name too
      supporterEmail, // Accept old name too
      amount,
      message,
      isAnonymous,
      paymentMethod,
      paymentReference,
    } = req.body;

    // Use whichever field was sent
    const name = donorName || supporterName || "Anonymous";
    const email = donorEmail || supporterEmail || "anonymous@tsb.com";

    // Find the creator
    const creator = await Creator.findOne({ username: req.params.username });
    if (!creator) {
      return res.status(404).json({ success: false, message: "Creator not found" });
    }

    // Create donation
    const donation = await Donation.create({
      creator: creator._id,
      donorName: isAnonymous ? "Anonymous" : name,
      donorEmail: email,
      amount,
      message: message || "",
      isAnonymous: isAnonymous || false,
      paymentMethod,
      paymentReference,
      paymentStatus: "pending",
    });

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
