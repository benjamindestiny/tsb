const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const Donation = require("../models/Donation");
const { Creator } = require("../models/Creator");
const { sendNewSupporterEmail } = require("../services/emailService");

// Paystack Webhook
router.post("/webhook", async (req, res) => {
  try {
    // Verify Paystack signature
    const hash = crypto
      .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY)
      .update(JSON.stringify(req.body))
      .digest("hex");

    if (hash !== req.headers["x-paystack-signature"]) {
      return res.status(401).json({ message: "Invalid signature" });
    }

    const event = req.body;

    // Only process successful payments
    if (event.event === "charge.success") {
      const paymentData = event.data;
      const metadata = paymentData.metadata?.custom_fields || [];

      // Extract metadata
      const getMetaValue = (name) => {
        const field = metadata.find((f) => f.variable_name === name);
        return field ? field.value : "";
      };

      const creatorUsername = getMetaValue("creator_username");
      const supporterName = getMetaValue("supporter_name") || "Anonymous";
      const supporterMessage = getMetaValue("message") || "";
      const amount = paymentData.amount / 100; // Convert from kobo to Naira
      const supporterEmail = paymentData.customer?.email || "";

      // Find creator
      const creator = await Creator.findOne({ username: creatorUsername });
      if (!creator) {
        console.log("Creator not found:", creatorUsername);
        return res.status(404).json({ message: "Creator not found" });
      }

      // Create donation record
      const donation = await Donation.create({
        donorName: supporterName,
        donorEmail: supporterEmail,
        amount: amount,
        currency: paymentData.currency || "NGN",
        message: supporterMessage,
        isAnonymous: supporterName === "Anonymous",
        paymentMethod: "paystack",
        paymentStatus: "completed",
        paymentReference: paymentData.reference,
        creator: creator._id,
      });

      // Update creator wallet (TSB takes 5%)
      const tsbFee = amount * 0.05;
      const creatorAmount = amount - tsbFee;

      await Creator.findByIdAndUpdate(creator._id, {
        $inc: {
          "wallet.balance": creatorAmount,
          "wallet.totalEarned": creatorAmount,
        },
      });

      // Send email to creator
      try {
        await sendNewSupporterEmail(creator, donation);
      } catch (emailErr) {
        console.log("Notification email failed:", emailErr.message);
      }

      console.log(`✅ Payment received: ₦${amount.toLocaleString()} from ${supporterName} → @${creatorUsername}`);
    }

    res.status(200).json({ message: "Webhook processed" });
  } catch (error) {
    console.error("Webhook error:", error.message);
    res.status(500).json({ message: "Webhook processing failed" });
  }
});

// Verify Payment (called from frontend)
router.post("/verify", async (req, res) => {
  try {
    const { reference } = req.body;

    // Verify with Paystack
    const https = require("https");
    const options = {
      hostname: "api.paystack.co",
      port: 443,
      path: `/transaction/verify/${reference}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    };

    const paystackRequest = new Promise((resolve, reject) => {
      const req = https.request(options, (paystackRes) => {
        let data = "";
        paystackRes.on("data", (chunk) => (data += chunk));
        paystackRes.on("end", () => resolve(JSON.parse(data)));
      });
      req.on("error", reject);
      req.end();
    });

    const verification = await paystackRequest;

    if (verification.status && verification.data.status === "success") {
      const paymentData = verification.data;
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

      // Find creator
      const creator = await Creator.findOne({ username: creatorUsername });
      if (!creator) {
        return res.status(404).json({ success: false, message: "Creator not found" });
      }

      // Check if donation already exists
      const existingDonation = await Donation.findOne({
        paymentReference: reference,
      });

      if (!existingDonation) {
        // Create donation
        const donation = await Donation.create({
          donorName: supporterName,
          donorEmail: supporterEmail,
          amount: amount,
          currency: paymentData.currency || "NGN",
          message: supporterMessage,
          isAnonymous: supporterName === "Anonymous",
          paymentMethod: "paystack",
          paymentStatus: "completed",
          paymentReference: reference,
          creator: creator._id,
        });

        // Update creator wallet (TSB takes 5%)
        const tsbFee = amount * 0.05;
        const creatorAmount = amount - tsbFee;

        await Creator.findByIdAndUpdate(creator._id, {
          $inc: {
            "wallet.balance": creatorAmount,
            "wallet.totalEarned": creatorAmount,
          },
        });

        // Send email
        try {
          await sendNewSupporterEmail(creator, donation);
        } catch (emailErr) {
          console.log("Email failed:", emailErr.message);
        }

        return res.json({
          success: true,
          message: "Payment verified successfully!",
          donation: {
            id: donation._id,
            supporterName: donation.donorName,
            supporterEmail: donation.donorEmail,
            amount: donation.amount,
            message: donation.message,
            isAnonymous: donation.isAnonymous,
          },
        });
      }

      // Donation already exists
      return res.json({
        success: true,
        message: "Payment already verified",
        donation: {
          id: existingDonation._id,
          supporterName: existingDonation.donorName,
          supporterEmail: existingDonation.donorEmail,
          amount: existingDonation.amount,
          message: existingDonation.message,
          isAnonymous: existingDonation.isAnonymous,
        },
      });
    }

    res.status(400).json({ success: false, message: "Payment verification failed" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
