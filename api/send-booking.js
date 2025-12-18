const nodemailer = require('nodemailer');

// ✅ Vercel Serverless Function
module.exports = async (req, res) => {
    // CORS Configuration
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    // Handle OPTIONS request (Preflight)
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Only allow POST
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { name, email, phone, serviceType, date, message } = req.body;

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.error("Missing Environment Variables");
        return res.status(500).json({ message: "Server misconfiguration: Missing email credentials." });
    }

    // Brevo/Sendinblue SMTP Config
    const transporter = nodemailer.createTransport({
        host: "smtp-relay.brevo.com", // Brevo SMTP Host
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER, // Your Brevo Login Email
            pass: process.env.EMAIL_PASS, // Your Brevo API Key / SMTP Key
        },
    });

    const mailOptions = {
        from: `"Scotzz Media Website" <${process.env.EMAIL_USER}>`, // Must be a verified sender in Brevo
        replyTo: email,
        to: "sinrasu737@gmail.com", // Your personal email to receive bookings
        subject: `New Booking Request: ${serviceType} - ${name}`,
        html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #d4af37;">New Booking Request</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Service Type:</strong> ${serviceType}</p>
        <p><strong>Preferred Date:</strong> ${date}</p>
        <div style="background: #f9f9f9; padding: 15px; border-left: 4px solid #d4af37; margin-top: 20px;">
          <strong>Message:</strong><br>${message}
        </div>
      </div>
    `
    };

    try {
        await transporter.sendMail(mailOptions);
        return res.status(200).json({ message: "Email sent successfully" });
    } catch (error) {
        console.error("EMAIL ERROR:", error);
        return res.status(500).json({ message: "Failed to send email", error: error.message });
    }
};
