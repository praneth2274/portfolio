// api/contact.js — Vercel Serverless Function
// Deploy this at: /api/contact.js in your project root
//
// Uses: Nodemailer (Gmail) — no database needed for Vercel
// To add a database, use PlanetScale, Supabase, or MongoDB Atlas (all free)

const nodemailer = require("nodemailer");

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { name, email, subject, message } = req.body;

  // Validation
  if (!name || !email || !subject || !message)
    return res.status(400).json({ error: "All fields are required." });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return res.status(400).json({ error: "Invalid email address." });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  try {
    // Notification email to Praneth
    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      subject: `[Portfolio] New message: ${subject}`,
      html: `
        <h2 style="color:#5b4cf5;">New Portfolio Message</h2>
        <table style="font-family:sans-serif;font-size:15px;border-collapse:collapse;">
          <tr><td style="padding:6px 14px;font-weight:bold;">Name</td><td style="padding:6px 14px;">${name}</td></tr>
          <tr style="background:#f5f5f5;"><td style="padding:6px 14px;font-weight:bold;">Email</td><td style="padding:6px 14px;"><a href="mailto:${email}">${email}</a></td></tr>
          <tr><td style="padding:6px 14px;font-weight:bold;">Subject</td><td style="padding:6px 14px;">${subject}</td></tr>
          <tr style="background:#f5f5f5;"><td style="padding:6px 14px;font-weight:bold;vertical-align:top;">Message</td><td style="padding:6px 14px;">${message.replace(/\n/g, "<br>")}</td></tr>
        </table>
        <p style="color:#999;font-size:12px;margin-top:20px;">Received: ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST</p>
      `,
    });

    // Auto-reply to sender
    await transporter.sendMail({
      from: `"Praneth S" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: `Thanks for reaching out, ${name}!`,
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:auto;">
          <h2 style="color:#5b4cf5;">Hey ${name}, thanks for your message! 👋</h2>
          <p style="color:#444;line-height:1.7;">I've received your message and will get back to you as soon as possible — usually within 24–48 hours.</p>
          <blockquote style="border-left:3px solid #5b4cf5;padding-left:1rem;color:#777;margin:1.5rem 0;">
            <strong>${subject}</strong><br>${message.replace(/\n/g, "<br>")}
          </blockquote>
          <p style="color:#5b4cf5;font-weight:600;">— Praneth S</p>
          <hr style="border:none;border-top:1px solid #eee;margin:2rem 0;">
          <p style="color:#bbb;font-size:12px;">B.Tech IT · V.S.B College of Engineering Technical Campus<br>spraneth38@gmail.com · Namakkal, Tamil Nadu</p>
        </div>
      `,
    });

    return res.status(200).json({ success: true });

  } catch (err) {
    console.error("Email error:", err.message);
    return res.status(500).json({ error: "Failed to send email. Check server logs." });
  }
};
