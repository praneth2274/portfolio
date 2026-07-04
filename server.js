require("dotenv").config();
const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const nodemailer = require("nodemailer");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// ─── DATABASE SETUP ───────────────────────────────────────────────────────────
const db = new sqlite3.Database("./messages.db", (err) => {
  if (err) console.error("DB error:", err.message);
  else console.log("✅ Connected to SQLite database.");
});

db.run(`
  CREATE TABLE IF NOT EXISTS messages (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    name      TEXT NOT NULL,
    email     TEXT NOT NULL,
    subject   TEXT NOT NULL,
    message   TEXT NOT NULL,
    received  DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// ─── EMAIL TRANSPORTER ────────────────────────────────────────────────────────
// Uses Gmail. Set GMAIL_USER and GMAIL_PASS (App Password) in .env
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

// ─── ROUTES ───────────────────────────────────────────────────────────────────

// POST /api/contact — receive form submission
app.post("/api/contact", (req, res) => {
  const { name, email, subject, message } = req.body;

  // Basic validation
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: "All fields are required." });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email address." });
  }

  // 1. Store in SQLite
  db.run(
    `INSERT INTO messages (name, email, subject, message) VALUES (?, ?, ?, ?)`,
    [name, email, subject, message],
    function (err) {
      if (err) {
        console.error("DB insert error:", err.message);
        return res.status(500).json({ error: "Failed to save message." });
      }

      const msgId = this.lastID;
      console.log(`📩 Message #${msgId} saved from ${name} <${email}>`);

      // 2. Send notification email to Praneth
      const notifyMail = {
        from: `"Portfolio Contact" <${process.env.GMAIL_USER}>`,
        to: process.env.GMAIL_USER, // send to yourself
        subject: `[Portfolio] New message: ${subject}`,
        html: `
          <h2 style="color:#5b4cf5;">New Portfolio Message</h2>
          <table style="font-family:sans-serif;font-size:15px;border-collapse:collapse;">
            <tr><td style="padding:6px 12px;font-weight:bold;">Name</td><td style="padding:6px 12px;">${name}</td></tr>
            <tr style="background:#f5f5f5;"><td style="padding:6px 12px;font-weight:bold;">Email</td><td style="padding:6px 12px;"><a href="mailto:${email}">${email}</a></td></tr>
            <tr><td style="padding:6px 12px;font-weight:bold;">Subject</td><td style="padding:6px 12px;">${subject}</td></tr>
            <tr style="background:#f5f5f5;"><td style="padding:6px 12px;font-weight:bold;vertical-align:top;">Message</td><td style="padding:6px 12px;">${message.replace(/\n/g, "<br>")}</td></tr>
          </table>
          <p style="color:#999;font-size:12px;margin-top:20px;">Message ID: #${msgId} · Received at ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST</p>
        `,
      };

      // 3. Send auto-reply to sender
      const replyMail = {
        from: `"Praneth S" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: `Thanks for reaching out, ${name}!`,
        html: `
          <div style="font-family:sans-serif;max-width:560px;margin:auto;">
            <h2 style="color:#5b4cf5;">Hey ${name}, thanks for your message! 👋</h2>
            <p style="color:#444;line-height:1.7;">
              I've received your message and will get back to you as soon as possible —
              usually within 24–48 hours.
            </p>
            <blockquote style="border-left:3px solid #5b4cf5;padding-left:1rem;color:#777;margin:1.5rem 0;">
              <strong>${subject}</strong><br>${message.replace(/\n/g, "<br>")}
            </blockquote>
            <p style="color:#444;">Looking forward to connecting!</p>
            <p style="color:#5b4cf5;font-weight:600;">— Praneth S</p>
            <hr style="border:none;border-top:1px solid #eee;margin:2rem 0;">
            <p style="color:#bbb;font-size:12px;">
              B.Tech IT Student · V.S.B College of Engineering Technical Campus<br>
              spraneth38@gmail.com · Namakkal, Tamil Nadu
            </p>
          </div>
        `,
      };

      // Send both emails (non-blocking — respond to user first)
      res.status(200).json({ success: true, id: msgId });

      transporter.sendMail(notifyMail, (e) => {
        if (e) console.error("Notify email error:", e.message);
        else console.log(`📧 Notification sent for message #${msgId}`);
      });
      transporter.sendMail(replyMail, (e) => {
        if (e) console.error("Auto-reply error:", e.message);
        else console.log(`📧 Auto-reply sent to ${email}`);
      });
    }
  );
});

// GET /api/messages — view all stored messages (protect this in production!)
app.get("/api/messages", (req, res) => {
  db.all(`SELECT * FROM messages ORDER BY received DESC`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ total: rows.length, messages: rows });
  });
});

// Health check
app.get("/api/health", (_, res) => res.json({ status: "ok" }));

app.listen(PORT, () => {
  console.log(`🚀 Praneth Portfolio Backend running at http://localhost:${PORT}`);
});
