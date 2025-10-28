
const nodemailer = require('nodemailer');

// -----------------------------------------------------------------------------
// IMPORTANT: You need to configure your email service provider in your .env file.
// For example, using Gmail:
//
// EMAIL_HOST=smtp.gmail.com
// EMAIL_PORT=587
// EMAIL_USER=your-email@gmail.com
// EMAIL_PASS=your-gmail-app-password
//
// Make sure to generate an "App Password" for your Gmail account if you have 2FA enabled.
// -----------------------------------------------------------------------------

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_PORT === '465', // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"MyShagun" <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html: options.html,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
