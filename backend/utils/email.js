
const nodemailer = require('nodemailer');

// -----------------------------------------------------------------------------
// Email utility with fallback logging for development/testing
// -----------------------------------------------------------------------------

const sendEmail = async (options) => {
  // Log OTP for debugging purposes
  console.log('========================================');
  console.log('EMAIL NOTIFICATION');
  console.log('To:', options.email);
  console.log('Subject:', options.subject);
  console.log('Message:', options.message);
  console.log('========================================');

  // If email credentials are not properly configured, just log and return
  if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS ||
      process.env.EMAIL_USER === 'your-email@gmail.com') {
    console.log('Email credentials not configured. OTP logged above for testing.');
    return { messageId: 'logged-only' };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT) || 465,
      secure: process.env.EMAIL_PORT === '465',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    const mailOptions = {
      from: `"MyShagun" <${process.env.EMAIL_USER}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.html || `<div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #8B4513; margin: 0;">MyShagun</h1>
            <p style="color: #666; margin: 5px 0;">Where Hearts Connect</p>
          </div>
          <div style="font-size: 16px; line-height: 1.6; color: #333;">
            ${options.message.replace(/\n/g, '<br>')}
          </div>
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #999; font-size: 12px;">
            <p>This email was sent from MyShagun. Please do not reply to this email.</p>
          </div>
        </div>
      </div>`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error('Email sending failed:', error.message);
    console.log('OTP was logged above for testing purposes.');
    // Don't throw error - allow OTP login to work even if email fails
    return { messageId: 'email-failed-logged' };
  }
};

module.exports = sendEmail;
