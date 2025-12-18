const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const sendBookingHandler = require('./api/send-booking');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static('.')); // Serve static files from root
app.use(bodyParser.json());

// Load env vars if dotenv is available (optional but good for local dev)
try {
  require('dotenv').config();
} catch (e) {
  // dotenv not installed, relying on system env or user manual set
}

// Route to handle booking - Mirrors Vercel's /api/send-booking
app.post('/api/send-booking', async (req, res) => {
  console.log("Receive booking request locally...");
  await sendBookingHandler(req, res);
});

// Fallback for root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\n🚀 Server running locally on http://localhost:${PORT}`);
  console.log(`👉 API Endpoint: http://localhost:${PORT}/api/send-booking`);
  console.log(`⚠️  IMPORTANT: Ensure EMAIL_USER and EMAIL_PASS are set in your environment variables for Brevo.`);
});
