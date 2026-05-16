const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const Donation = require("../models/Donation");
const { Creator } = require("../models/Creator");
const { sendNewSupporterEmail } = require("../services/emailService");

// Paystack Webhook (handles everything automatically)
router.post("/webhook", async (req, res) => {
  try {
    const hash = crypto
      .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY)
      .update(JSON.stringify(req.body))
      .digest("hex");

    if (hash !== req.headers["x-paystack-signature"]) {
      return res.status(401).json({ message: "Invalid signature" });
    }

    const event = req.body;

    if (event.event === "charge.success") {
      const paymentData = event.data;
      const metadata = paymentData.metadata?.custom_fields || [];

      const getMetaValue = (name) => {
        const field = metadata.find((f) => f.variable_name === name);
        return field ? field.value : "";
      };

      const creatorUsername = getMetaValue("creator_username");
      const supporterName = getMetaValue("supporter_name") || "Anonymous";
      const supporterMessage = getMetaValue("message") || "";
      const amount = paymentData.amount / 100;
      const supporterEmail = paymentData.customer?.email || "";

      const creator = await Creator.findOne({ username: creatorUsername });
      if (!creator) return res.status(404).json({ message: "Creator not found" });

      // Check duplicate
      const existing = await Donation.findOne({ paymentReference: paymentData.reference });
      if (existing) return res.json({ message: "Already processed" });

      const donation = await Donation.create({
        donorName: supporterName,
        donorEmail: supporterEmail,
        amount,
        currency: "NGN",
        message: supporterMessage,
        isAnonymous: supporterName === "Anonymous",
        paymentMethod: "paystack",
        paymentStatus: "completed",
        paymentReference: paymentData.reference,
        creator: creator._id,
      });

      const tsbFee = amount * 0.05;
      const creatorAmount = amount - tsbFee;

      await Creator.findByIdAndUpdate(creator._id, {
        $inc: {
          "wallet.balance": creatorAmount,
          "wallet.totalEarned": creatorAmount,
        },
      });

      try { await sendNewSupporterEmail(creator, donation); } catch (e) {}

      console.log(`✅ Payment: ₦${amount} from ${supporterName} → @${creatorUsername}`);
    }

    res.status(200).json({ message: "Webhook processed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Quick Verify (responds fast, doesn't re-verify with Paystack)
router.post("/verify", async (req, res) => {
  try {
    const { reference, creatorUsername, supporterName, supporterEmail, amount, message, isAnonymous } = req.body;

    // Check if already processed
    const existing = await Donation.findOne({ paymentReference: reference });
    if (existing) {
      return res.json({
        success: true,
        donation: {
          id: existing._id,
          supporterName: existing.donorName,
          supporterEmail: existing.donorEmail,
          amount: existing.amount,
          message: existing.message,
          isAnonymous: existing.isAnonymous,
        },
      });
    }

    // Find creator
    const creator = await Creator.findOne({ username: creatorUsername });
    if (!creator) return res.status(404).json({ success: false, message: "Creator not found" });

    // Create donation immediately
    const donation = await Donation.create({
      donorName: supporterName,
      donorEmail: supporterEmail,
      amount,
      currency: "NGN",
      message: message || "",
      isAnonymous: isAnonymous || false,
      paymentMethod: "paystack",
      paymentStatus: "completed",
      paymentReference: reference,
      creator: creator._id,
    });

    // Update wallet
    const tsbFee = amount * 0.05;
    const creatorAmount = amount - tsbFee;

    await Creator.findByIdAndUpdate(creator._id, {
      $inc: {
        "wallet.balance": creatorAmount,
        "wallet.totalEarned": creatorAmount,
      },
    });

    // Send email in background
    sendNewSupporterEmail(creator, donation).catch(() => {});

    res.json({
      success: true,
      donation: {
        id: donation._id,
        supporterName: donation.donorName,
        supporterEmail: donation.donorEmail,
        amount: donation.amount,
        message: donation.message,
        isAnonymous: donation.isAnonymous,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
