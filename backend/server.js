const express = require("express");
const router = express.Router();
const { Creator } = require("../models/Creator");
const { protect } = require("../middleware/auth");

// ===== PROTECTED ROUTES (must come before /:username) =====

// GET /api/creator/settings
router.get("/settings", protect, async (req, res) => {
  try {
    const creator = await Creator.findById(req.creator._id);
    res.json({
      success: true,
      profile: {
        displayName: creator.displayName || "",
        username: creator.username,
        email: creator.email,
        bio: creator.bio || "",
      },
      payment: {
        bankName: creator.bankDetails?.bankName || "",
        accountNumber: creator.bankDetails?.accountNumber || "",
        accountName: creator.bankDetails?.accountName || "",
        opayNumber: creator.bankDetails?.opayNumber || "",
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/creator/settings
router.put("/settings", protect, async (req, res) => {
  try {
    const { section, data } = req.body;
    const update = {};

    if (section === "profile") {
      if (data.displayName) update.displayName = data.displayName;
      if (data.bio) update.bio = data.bio;
    }
    if (section === "payment") {
      update.bankDetails = {
        bankName: data.bankName || "",
        accountNumber: data.accountNumber || "",
        accountName: data.accountName || "",
        opayNumber: data.opayNumber || "",
      };
    }

    await Creator.findByIdAndUpdate(req.creator._id, update);
    res.json({ success: true, message: "Settings saved" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/creator/balance
router.get("/balance", protect, async (req, res) => {
  try {
    const creator = await Creator.findById(req.creator._id);
    res.json({
      success: true,
      balance: creator.wallet?.balance || 0,
      bankDetails: creator.bankDetails || {},
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/creator/stats
router.get("/stats", protect, async (req, res) => {
  try {
    const Donation = require("../models/Donation");
    const donations = await Donation.find({
      creator: req.creator._id,
      paymentStatus: "completed",
    });

    const now = new Date();
    const todayStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const todayEarnings = donations
      .filter((d) => new Date(d.createdAt) >= todayStart)
      .reduce((sum, d) => sum + d.amount, 0);

    const monthlyEarnings = donations
      .filter((d) => new Date(d.createdAt) >= monthStart)
      .reduce((sum, d) => sum + d.amount, 0);

    const totalEarnings = donations.reduce((sum, d) => sum + d.amount, 0);

    const recentSupporters = donations
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
      .map((d) => ({
        id: d._id,
        name: d.donorName,
        amount: d.amount,
        message: d.message,
        anonymous: d.isAnonymous,
        date: d.createdAt,
      }));

    res.json({
      success: true,
      stats: {
        todayEarnings,
        monthlyEarnings,
        totalEarnings,
        totalSupporters: donations.length,
        recentSupporters,
        earningsChart: [0, 0, 0, 0, 0, 0, 0],
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ===== PUBLIC ROUTE (must be LAST) =====

// GET /api/creator/:username
router.get("/:username", async (req, res) => {
  try {
    const creator = await Creator.findOne({
      username: req.params.username.toLowerCase(),
    }).select("-password -email -__v");

    if (!creator) {
      return res
        .status(404)
        .json({ success: false, message: "Creator not found" });
    }

    res.json({ success: true, creator });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
