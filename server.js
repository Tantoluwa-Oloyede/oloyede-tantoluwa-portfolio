const express = require("express");
const path = require("path");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname)));

// ==============================
// EMAIL CONFIGURATION
// ==============================
// NOTE: do not commit real credentials to GitHub.
const EMAIL_USER =
  process.env.NODEMAILER_USER ||
  process.env.EMAIL_USER ||
  "YOUR_EMAIL@gmail.com"; // <- put your email here
const EMAIL_PASS =
  process.env.NODEMAILER_APP_PASSWORD ||
  process.env.EMAIL_PASS ||
  "YOUR_APP_PASSWORD"; // <- put your nodemailer password/app password here
const RECEIVER_EMAIL = process.env.RECEIVER_EMAIL || EMAIL_USER; // <- your inbox for contact form messages

function hasValidEmailConfig() {
  return (
    EMAIL_USER &&
    EMAIL_PASS &&
    !EMAIL_USER.includes("YOUR_EMAIL") &&
    !EMAIL_PASS.includes("YOUR_APP_PASSWORD")
  );
}

function isSafeEmail(value) {
  return typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS
  }
});

app.post("/api/contact", async (req, res) => {
  const { name, email, subject, message } = req.body || {};

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ ok: false, error: "All fields are required." });
  }

  if (!hasValidEmailConfig()) {
    return res.status(500).json({
      ok: false,
      error:
        "Email service is not configured. Set NODEMAILER_USER and NODEMAILER_APP_PASSWORD (or EMAIL_USER and EMAIL_PASS) in .env."
    });
  }

  if (!isSafeEmail(email)) {
    return res.status(400).json({ ok: false, error: "Please enter a valid email address." });
  }

  try {
    await transporter.sendMail({
      from: `"Portfolio Contact" <${EMAIL_USER}>`,
      to: RECEIVER_EMAIL,
      replyTo: `"${name}" <${email}>`,
      subject: `Portfolio Inquiry (${subject}) from ${name}`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        `Project Type: ${subject}`,
        "",
        "Message:",
        message
      ].join("\n"),
      html: `
        <h3>New Portfolio Message</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Project Type:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${String(message).replace(/\n/g, "<br>")}</p>
      `
    });

    return res.status(200).json({ ok: true, message: "Message sent successfully." });
  } catch (error) {
    console.error("Email send error:", error);
    return res.status(500).json({ ok: false, error: "Failed to send email." });
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Portfolio server running at http://localhost:${PORT}`);
  if (!hasValidEmailConfig()) {
    console.warn(
      "Email not configured: set NODEMAILER_USER and NODEMAILER_APP_PASSWORD in .env before testing contact form."
    );
  }
});
