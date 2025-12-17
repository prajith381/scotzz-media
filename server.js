const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
// Middleware
app.use(express.static('public')); // Serves your HTML/CSS
app.use(bodyParser.json());

// Email Configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'sinrasu737@gmail.com', // Your email
        pass: 'ugmi ooed rxjn rpgw' // REPLACE THIS with your 16-char App Password
    }
});

// Route to handle booking
app.post('/send-booking', (req, res) => {
    const { name, email, phone, serviceType, date, message } = req.body;

    const mailOptions = {
        from: 'sinrasu737@gmail.com', // Authenticated user
        replyTo: email, // Reply to the visitor
        to: 'sinrasu737@gmail.com',
        subject: `New Booking Request: ${serviceType} - ${name}`,
        html: `
            <h3>New Booking Request from Scotzz Media Website</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Service Type:</strong> ${serviceType}</p>
            <p><strong>Preferred Date:</strong> ${date}</p>
            <p><strong>Message:</strong><br>${message}</p>
        `
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            return res.status(500).json({ message: 'Error sending email' });
        }
        console.log('Email sent: ' + info.response);
        return res.status(200).json({ message: 'Email sent successfully' });
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
