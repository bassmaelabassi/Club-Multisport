// mail.js
// Configuration Nodemailer

// Exemple de squelette
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: process.env.MAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

module.exports = transporter; 