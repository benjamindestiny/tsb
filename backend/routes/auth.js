const router = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { Creator } = require("../models/Creator");
const { sendVerificationEmail } = require("../services/emailService");

// Register
router.post("/register", async (req, res) => {
  try {
    const { username, email, password, displayName } = req.body;

    // Check if user exists
    const existing = await Creator.findOne({ $or: [{ email }, { username }] });
    if (existing) {
      return res
        .status(400)
        .json({ error: "Username or email already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate verification token (still create but mark as verified)
    const verificationToken = crypto.randomBytes(32).toString("hex");

    // Create creator (AUTO-VERIFIED for now)
    const creator = await Creator.create({
      username,
      email,
      password: hashedPassword,
      displayName,
      isVerified: true, // AUTO-VERIFY
      verificationToken,
      verificationTokenExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    // Try to send verification email in background (won't block registration)
    sendVerificationEmail(creator, verificationToken).catch((err) => {
      console.log("Verification email failed:", err.message);
    });

    // Generate full access token immediately
    const token = jwt.sign(
      { id: creator._id, verified: true },
      process.env.JWT_SECRET || "secret123",
      { expiresIn: "30d" },
    );

    res.status(201).json({
      success: true,
      message: "Account created successfully!",
      token,
      creator: {
        id: creator._id,
        username: creator.username,
        email: creator.email,
        displayName: creator.displayName,
        isVerified: true,
      },
    });
  } catch (error) {
    console.error("REGISTRATION ERROR:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// Verify Email
router.get("/verify-email/:token", async (req, res) => {
  try {
    const { token } = req.params;

    const creator = await Creator.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: new Date() },
    });

    if (!creator) {
      return res
        .status(400)
        .json({ error: "Invalid or expired verification link" });
    }

    creator.isVerified = true;
    creator.verificationToken = "";
    creator.verificationTokenExpires = null;
    await creator.save();

    res.json({
      success: true,
      message: "Email verified successfully! Welcome to TSB!",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Resend Verification Email
router.post("/resend-verification", async (req, res) => {
  try {
    const { email } = req.body;

    const creator = await Creator.findOne({ email, isVerified: false });
    if (!creator) {
      return res
        .status(400)
        .json({ error: "No unverified account found with this email" });
    }

    const verificationToken = crypto.randomBytes(32).toString("hex");
    creator.verificationToken = verificationToken;
    creator.verificationTokenExpires = new Date(
      Date.now() + 24 * 60 * 60 * 1000,
    );
    await creator.save();

    sendVerificationEmail(creator, verificationToken).catch((err) => {
      console.log("Resend verification email failed:", err.message);
    });

    res.json({ success: true, message: "Verification email resent!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const creator = await Creator.findOne({ email }).select("+password");
    if (!creator) return res.status(401).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, creator.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    // Verification check disabled - users can login without email verification
    // if (!creator.isVerified) {
    //   return res.status(403).json({
    //     error: "Please verify your email before logging in",
    //     needsVerification: true,
    //     email: creator.email,
    //   });
    // }

    const token = jwt.sign(
      { id: creator._id, verified: true },
      process.env.JWT_SECRET || "secret123",
      { expiresIn: "30d" },
    );

    res.json({
      success: true,
      token,
      creator: {
        id: creator._id,
        username: creator.username,
        email: creator.email,
        displayName: creator.displayName,
        isVerified: true,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
