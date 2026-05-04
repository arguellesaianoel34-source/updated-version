# EmailJS Setup Guide for VibeGlobally

This guide will help you configure EmailJS to receive contact form submissions via email.

## What is EmailJS?

EmailJS is a client-side email service that allows you to send emails directly from your website without needing a backend server. It's perfect for contact forms and supports various email providers like Gmail, Outlook, Yahoo, and more.

## Step 1: Create an EmailJS Account

1. Go to [EmailJS Dashboard](https://dashboard.emailjs.com)
2. Sign up for a free account (allows 200 emails/month)
3. Verify your email address

## Step 2: Add an Email Service

1. In the EmailJS dashboard, click on **"Email Services"** in the left sidebar
2. Click **"Add New Service"**
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the authentication steps for your chosen provider
5. Once connected, you'll see your **Service ID** (e.g., `service_abc123`)
6. **Copy this Service ID** - you'll need it later

## Step 3: Create an Email Template

1. Click on **"Email Templates"** in the left sidebar
2. Click **"Create New Template"**
3. Give it a name like "Contact Form Submission"
4. Use the following template structure:

### Template Subject:
```
New Contact Form Submission from {{from_name}}
```

### Template Body:
```
You have received a new contact form submission from VibeGlobally website.

Contact Details:
-----------------
Name: {{from_name}}
Email: {{from_email}}
Phone: {{phone}}
Company: {{company}}
Service Interest: {{service}}

Message:
-----------------
{{message}}

---
This email was sent from the VibeGlobally contact form.
Reply to: {{reply_to}}
```

5. Click **"Save"**
6. **Copy the Template ID** (e.g., `template_xyz789`)

### Important Template Variables

Make sure your template includes these variables:
- `{{to_email}}` - Recipient email (lyndon@vibeglobally.ph)
- `{{from_name}}` - Sender's name
- `{{from_email}}` - Sender's email
- `{{phone}}` - Sender's phone number
- `{{company}}` - Sender's company
- `{{service}}` - Service they're interested in
- `{{message}}` - Their message
- `{{reply_to}}` - Reply-to email address

## Step 4: Get Your Public Key

1. Click on **"Account"** in the left sidebar
2. Go to **"API Keys"** section
3. You'll see your **Public Key** (e.g., `abcdefghijklmnop`)
4. **Copy this Public Key**

## Step 5: Configure in VibeGlobally Admin

1. Log in to your VibeGlobally admin panel
2. Go to **"Email Settings"** in the sidebar
3. Enter the following information:
   - **Service ID**: Paste the Service ID from Step 2
   - **Template ID**: Paste the Template ID from Step 3
   - **Public Key**: Paste the Public Key from Step 4
   - **Recipient Email**: Enter `lyndon@vibeglobally.ph` (or your preferred email)
4. Click **"Save Settings"**

## Step 6: Test Your Configuration

1. In the admin Email Settings page, click **"Send Test Email"**
2. Fill in the test form:
   - **Recipient Email**: Your email address
   - **Recipient Name**: Your name
   - **Message**: A test message
3. Click **"Send Test Email"**
4. Check your inbox (and spam folder) for the test email
5. If successful, your configuration is complete!

## Troubleshooting

### Email Not Received

1. **Check Spam Folder**: EmailJS emails sometimes go to spam initially
2. **Verify Service Connection**: Go to EmailJS dashboard → Email Services and ensure your service is connected
3. **Check Template Variables**: Make sure all variables in your template match the ones listed above
4. **Review EmailJS Logs**: In the EmailJS dashboard, go to "Email History" to see if emails were sent successfully
5. **Check Monthly Limit**: Free accounts have 200 emails/month limit

### Configuration Errors

- **"Service ID not found"**: Double-check you copied the correct Service ID
- **"Template not found"**: Verify the Template ID is correct
- **"Invalid Public Key"**: Make sure you copied the Public Key exactly as shown

### Common Issues

1. **Gmail Blocking**: If using Gmail, you may need to enable "Less secure app access" or use an App Password
2. **Rate Limiting**: Don't send too many test emails in quick succession
3. **Browser Console Errors**: Open browser developer tools (F12) to see detailed error messages

## Email Providers Supported

EmailJS supports many email providers:
- Gmail
- Outlook / Hotmail
- Yahoo Mail
- Custom SMTP
- And many more

## Pricing

- **Free Plan**: 200 emails/month
- **Paid Plans**: Start at $7/month for 1,000 emails
- Visit [EmailJS Pricing](https://www.emailjs.com/pricing/) for details

## Security Notes

- Your Public Key is safe to use in client-side code
- Never share your Private Key (if you have one)
- EmailJS automatically prevents spam and abuse
- All emails are sent through EmailJS servers, not directly from your website

## Support

- EmailJS Documentation: https://www.emailjs.com/docs/
- EmailJS Support: https://www.emailjs.com/support/

---

**Need Help?**
Contact the VibeGlobally technical team at lyndon@vibeglobally.ph
