# EmailJS Quick Start Guide

## 🚀 Get Your Contact Form Working in 5 Minutes

### Step 1: Create EmailJS Account (2 min)
1. Go to https://dashboard.emailjs.com
2. Sign up with your email
3. Verify your email address

### Step 2: Connect Your Email (1 min)
1. Click **"Email Services"** → **"Add New Service"**
2. Choose **Gmail** (or your preferred provider)
3. Click **"Connect Account"** and authorize
4. **Copy the Service ID** (looks like `service_abc123`)

### Step 3: Create Email Template (1 min)
1. Click **"Email Templates"** → **"Create New Template"**
2. Name it: "Contact Form"
3. **Subject**: `New Contact from {{from_name}}`
4. **Body**: Copy this template:

```
New contact form submission:

Name: {{from_name}}
Email: {{from_email}}
Phone: {{phone}}
Company: {{company}}
Service: {{service}}

Message:
{{message}}
```

5. Click **"Save"**
6. **Copy the Template ID** (looks like `template_xyz789`)

### Step 4: Get Your Public Key (30 sec)
1. Click **"Account"** → **"API Keys"**
2. **Copy the Public Key** (long string of letters/numbers)

### Step 5: Configure in Admin Panel (30 sec)
1. Log in to VibeGlobally admin
2. Go to **"Email Settings"** (in sidebar)
3. Paste:
   - **Service ID**: `service_abc123`
   - **Template ID**: `template_xyz789`
   - **Public Key**: `your_public_key_here`
   - **Recipient Email**: `lyndon@vibeglobally.ph`
4. Click **"Save Settings"**
5. Click **"Send Test Email"** to verify

### ✅ Done!
Your contact form is now live and will send emails to lyndon@vibeglobally.ph

---

## 📧 Where to Find Your Credentials

| Credential | Location in EmailJS Dashboard |
|------------|-------------------------------|
| Service ID | Email Services → Click on your service |
| Template ID | Email Templates → Click on your template |
| Public Key | Account → API Keys |

## 🆘 Troubleshooting

**Email not received?**
- Check spam folder
- Verify all 3 IDs are correct
- Check EmailJS dashboard → Email History
- Free plan limit: 200 emails/month

**Need detailed help?**
See `EMAILJS-SETUP.md` for complete instructions

---

**Support**: lyndon@vibeglobally.ph
