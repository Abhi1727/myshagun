# Email Configuration for OTP Login

The OTP (One-Time Password) login feature requires email configuration to send OTPs to users. Follow these steps to set up email functionality:

## Gmail Setup (Recommended for Development)

1. **Enable 2-Factor Authentication** on your Gmail account:
   - Go to https://myaccount.google.com/security
   - Enable 2-Step Verification

2. **Generate an App Password**:
   - Visit https://myaccount.google.com/apppasswords
   - Select "Mail" as the app
   - Select "Other" as the device and name it "MyShagun"
   - Click "Generate"
   - Copy the 16-character password

3. **Update your `.env` file** in the backend directory:
   ```
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-16-character-app-password
   ```

## Other Email Providers

### SendGrid
```
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASS=your-sendgrid-api-key
```

### Outlook/Hotmail
```
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_USER=your-email@outlook.com
EMAIL_PASS=your-password
```

### Custom SMTP Server
```
EMAIL_HOST=your-smtp-server.com
EMAIL_PORT=587 (or 465 for SSL)
EMAIL_USER=your-username
EMAIL_PASS=your-password
```

## Testing the Setup

1. Start your backend server:
   ```bash
   cd backend
   npm start
   ```

2. Try the OTP login feature:
   - Go to the login page
   - Click "Login With OTP"
   - Enter a registered email address
   - Check your inbox for the OTP code

## Troubleshooting

### "Invalid login" or "Authentication failed"
- Double-check your EMAIL_USER and EMAIL_PASS in the .env file
- Make sure you're using an App Password (not your regular Gmail password)
- Verify 2FA is enabled on your Gmail account

### "Connection timeout"
- Check your firewall settings
- Verify the EMAIL_HOST and EMAIL_PORT are correct
- Try using port 465 with secure: true

### OTP not received
- Check your spam folder
- Verify the user's email exists in the users table
- Check backend console logs for errors

## Security Notes

- Never commit your `.env` file to version control
- Use App Passwords instead of regular passwords
- For production, consider using dedicated email services like SendGrid, AWS SES, or Mailgun
- Rotate your email credentials regularly
