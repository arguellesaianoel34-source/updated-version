# Email Notification Setup

The contact form now sends email notifications to `lyndon@vibeglobally.ph` when someone submits the form.

## Setup Instructions

### 1. Install Dependencies

```bash
cd artifacts/api-server
npm install
# or
pnpm install
```

### 2. Configure Environment Variables

Create a `.env` file in the `artifacts/api-server` directory with your Brevo SMTP credentials:

```env
# Brevo SMTP Configuration
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=your-brevo-email@example.com
SMTP_PASSWORD=your-brevo-smtp-key
FROM_NAME=VibeGlobally
FROM_EMAIL=lyndon@vibeglobally.ph
```

### 3. Get Brevo SMTP Credentials

1. Log in to your Brevo account at https://app.brevo.com
2. Go to **Settings** → **SMTP & API**
3. Generate a new SMTP key if you don't have one
4. Copy your credentials:
   - **SMTP Server**: smtp-relay.brevo.com
   - **Port**: 587
   - **Login**: Your Brevo account email
   - **SMTP Key**: The generated key

### 4. Build and Run the API Server

```bash
# Build the server
npm run build

# Start the server
npm run start

# Or for development with auto-reload
npm run dev
```

The server will run on port 8080 by default.

### 5. Test the Email Functionality

Submit a test contact form on your website. You should receive an email at `lyndon@vibeglobally.ph` with:
- Contact name
- Email address
- Phone number (if provided)
- Company (if provided)
- Service interest (if selected)
- Message content
- Timestamp

## Email Features

✅ **Professional HTML email template** with VibeGlobally branding
✅ **Plain text fallback** for email clients that don't support HTML
✅ **Reply-To header** set to the contact's email for easy responses
✅ **Formatted subject line** with contact name and service interest
✅ **All form fields** included in the email
✅ **Timestamp** of when the form was submitted

## Troubleshooting

### Email not sending?

1. **Check SMTP credentials**: Make sure your Brevo SMTP key is correct
2. **Check environment variables**: Ensure `.env` file is in the correct location
3. **Check Brevo account**: Verify your account is active and not suspended
4. **Check server logs**: Look for error messages in the console
5. **Test SMTP connection**: Use the SMTP Settings page in the admin panel

### Email going to spam?

1. **Verify sender domain**: Make sure `lyndon@vibeglobally.ph` is verified in Brevo
2. **Add SPF/DKIM records**: Configure DNS records for your domain
3. **Check Brevo reputation**: Ensure your Brevo account has good sending reputation

## Production Deployment

For production, make sure to:

1. Set environment variables in your hosting platform
2. Use secure SMTP credentials (don't commit `.env` to git)
3. Monitor email delivery in Brevo dashboard
4. Set up email alerts for failed deliveries

## Support

If you need help:
- Check Brevo documentation: https://help.brevo.com/
- Review server logs for error messages
- Test SMTP settings in the admin panel
