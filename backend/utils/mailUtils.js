const transporter = require('../config/mail');

exports.sendMail = async (to, subject, text) => {
  const mailOptions = {
    from: process.env.MAIL_USER,
    to,
    subject,
    text,
  };
  return transporter.sendMail(mailOptions);
};
