const nodemailer = require("nodemailer");
const crypto = require("crypto");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  family: 4,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.log("❌ Email error:", error.message);
  } else {
    console.log("✅ Email server ready");
  }
});

const sendVerificationEmail = async (creator, token) => {
  const verifyUrl = `http://localhost:5173/verify-email/${token}`;

  const mailOptions = {
    from: `"TSB" <${process.env.EMAIL_USER}>`,
    to: creator.email,
    subject: "Verify Your TSB Account ✨",
    html: `
      <div style="max-width: 600px; margin: 0 auto; font-family: 'Segoe UI', Arial, sans-serif; background: #0f0f1a; color: #e0e0e0; border-radius: 16px; overflow: hidden;">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #6c5ce7, #a855f7); padding: 40px 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to TSB! 🚀</h1>
          <h3 style="color: #d8b4fe; margin: 10px 0 0 0; font-size: 16px;">The Support Button</h3>
          <p style="color: #d8b4fe; margin: 10px 0 0 0; font-size: 16px;">Your creative journey starts here</p>
        </div>

        <!-- Body -->
        <div style="padding: 40px 30px;">
          <h2 style="color: #a855f7; margin: 0 0 20px 0;">Hey ${creator.displayName || creator.username}! 👋</h2>
          
          <p style="font-size: 16px; line-height: 1.6; color: #c0c0c0; margin: 0 0 20px 0;">
            Thanks for joining <strong style="color: white;">The Support Button (T.S.B)</strong>. We're excited to help you receive support from your biggest fans.
          </p>
          
          <p style="font-size: 16px; line-height: 1.6; color: #c0c0c0; margin: 0 0 30px 0;">
            To get started, verify your email by clicking the button below:
          </p>

          <!-- Verify Button -->
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verifyUrl}" 
               style="display: inline-block; padding: 16px 48px; 
                      background: linear-gradient(135deg, #6c5ce7, #a855f7); 
                      color: white; text-decoration: none; border-radius: 50px; 
                      font-size: 18px; font-weight: bold; letter-spacing: 0.5px;">
              Verify My Email
            </a>
          </div>

          <p style="font-size: 14px; color: #888; margin: 20px 0 0 0; text-align: center;">
            Or copy this link:<br>
            <a href="${verifyUrl}" style="color: #a855f7; word-break: break-all;">${verifyUrl}</a>
          </p>

          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #1e1e2e;">
            <p style="font-size: 14px; color: #666;">
              ⚡ Your support link: <strong style="color: #a855f7;">tsb.com/${creator.username}</strong>
            </p>
            <p style="font-size: 14px; color: #666;">
              📤 Share it on your socials and start receiving support from your fans!
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div style="background: #0a0a14; padding: 20px 30px; text-align: center;">
          <p style="font-size: 12px; color: #555; margin: 0;">
            © ${new Date().getFullYear()} TSB - The Support Button. Made with ❤️ for creators.
          </p>
          <p style="font-size: 11px; color: #444; margin: 5px 0 0 0;">
            If you didn't create this account, you can ignore this email.
          </p>
        </div>
      </div>
    `,
  };

  return await transporter.sendMail(mailOptions);
};

const sendNewSupporterEmail = async (creator, supporter) => {
  const mailOptions = {
    from: `"TSB" <${process.env.EMAIL_USER}>`,
    to: creator.email,
    subject: supporter.isAnonymous
      ? "Someone just supported you! 💝"
      : `${supporter.donorName} just supported you! 💝`,
    html: `
      <div style="max-width: 600px; margin: 0 auto; font-family: 'Segoe UI', Arial, sans-serif; background: #0f0f1a; color: #e0e0e0; border-radius: 16px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #ec4899, #f43f5e); padding: 40px 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">New Support! 💝</h1>
        </div>
        <div style="padding: 40px 30px; text-align: center;">
          <p style="font-size: 18px; color: #c0c0c0; margin: 0 0 10px 0;">
            ${supporter.isAnonymous ? "An anonymous fan" : `<strong style="color: white;">${supporter.donorName}</strong>`} just supported you!
          </p>
          <div style="background: #1e1e2e; padding: 25px; border-radius: 12px; margin: 20px 0;">
            <p style="font-size: 42px; color: #4ade80; margin: 0; font-weight: bold;">₦${supporter.amount.toLocaleString()}</p>
          </div>
          ${supporter.message ? `<p style="font-style: italic; color: #888; font-size: 16px;">"${supporter.message}"</p>` : ""}
          <a href="http://localhost:5173/dashboard" style="display: inline-block; padding: 14px 40px; background: #6c5ce7; color: white; text-decoration: none; border-radius: 50px; margin-top: 20px; font-weight: bold;">View Dashboard</a>
        </div>
      </div>
    `,
  };
  return await transporter.sendMail(mailOptions);
};

const sendWithdrawalEmail = async (creator, withdrawal) => {
  const mailOptions = {
    from: `"TSB" <${process.env.EMAIL_USER}>`,
    to: creator.email,
    subject: "Withdrawal Request Received 💰",
    html: `
      <div style="max-width: 600px; margin: 0 auto; font-family: 'Segoe UI', Arial, sans-serif; background: #0f0f1a; color: #e0e0e0; border-radius: 16px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #22c55e, #10b981); padding: 40px 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">Withdrawal Requested 💰</h1>
        </div>
        <div style="padding: 40px 30px; text-align: center;">
          <div style="background: #1e1e2e; padding: 25px; border-radius: 12px; margin: 20px 0;">
            <p style="color: #888; margin: 0 0 5px 0;">Amount</p>
            <p style="font-size: 36px; color: #4ade80; margin: 0; font-weight: bold;">₦${withdrawal.amount.toLocaleString()}</p>
            <p style="color: #888; margin: 10px 0 0 0;">via ${withdrawal.paymentMethod === "opay" ? "OPay" : "Bank Transfer"}</p>
          </div>
          <p style="color: #888; font-size: 14px;">You'll receive your money within 24 hours. We'll notify you once it's processed.</p>
        </div>
      </div>
    `,
  };
  return await transporter.sendMail(mailOptions);
};

module.exports = {
  sendVerificationEmail,
  sendNewSupporterEmail,
  sendWithdrawalEmail,
};
