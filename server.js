const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('.'));

// Brevo SMTP
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Booking route
app.post('/send-booking', async (req, res) => {
  const { name, email, phone, serviceType, date, message } = req.body;

  if (!name || !email || !serviceType) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    await transporter.sendMail({
      from: `"Scotzz Media" <${process.env.EMAIL_USER}>`,
      to: "sinrasu737@gmail.com",
      subject: `New Booking Request: ${serviceType} - ${name}`,
      html: `
        <h2>New Booking Request</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Phone:</b> ${phone}</p>
        <p><b>Service:</b> ${serviceType}</p>
        <p><b>Date:</b> ${date}</p>
        <p><b>Message:</b><br>${message}</p>
      `
    });

    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("EMAIL ERROR:", error);
    res.status(500).json({ message: "Failed to send email", error: error.message });
  }
});

// Fallback route
app.get(/.*/, (req, res) => {
  res.sendFile(__dirname + '/index.html');
});


// Start server (REQUIRED for Render)
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
