import nodemailer from 'nodemailer';
import { siteContentRepo } from '@workspace/db';

interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
  from: {
    name: string;
    email: string;
  };
}

// Fetch SMTP settings from database
async function getEmailConfig(): Promise<EmailConfig> {
  try {
    const smtpSettings = await siteContentRepo.get('smtp');
    
    if (smtpSettings?.content) {
      const settings = smtpSettings.content as Record<string, string>;
      return {
        host: settings.smtpHost || process.env.SMTP_HOST || 'smtp-relay.brevo.com',
        port: parseInt(settings.smtpPort || process.env.SMTP_PORT || '587'),
        secure: false, // true for 465, false for other ports
        auth: {
          user: settings.smtpUser || process.env.SMTP_USER || '',
          pass: settings.smtpPassword || process.env.SMTP_PASSWORD || '',
        },
        from: {
          name: settings.fromName || process.env.FROM_NAME || 'VibeGlobally',
          email: settings.fromEmail || process.env.FROM_EMAIL || 'lyndon@vibeglobally.ph',
        },
      };
    }
  } catch (error) {
    console.error('Error fetching SMTP settings from database:', error);
  }

  // Fallback to environment variables
  return {
    host: process.env.SMTP_HOST || 'smtp-relay.brevo.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER || '',
      pass: process.env.SMTP_PASSWORD || '',
    },
    from: {
      name: process.env.FROM_NAME || 'VibeGlobally',
      email: process.env.FROM_EMAIL || 'lyndon@vibeglobally.ph',
    },
  };
}

export async function sendContactNotification(contactData: {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service?: string;
  message: string;
}) {
  try {
    // Get email configuration from database
    const config = await getEmailConfig();

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: config.auth,
    });

    // Email content
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #f5c518; padding: 20px; text-align: center; }
            .header h1 { margin: 0; color: #1a1a1a; }
            .content { background-color: #f9f9f9; padding: 30px; border-radius: 5px; margin-top: 20px; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #555; }
            .value { color: #333; margin-top: 5px; }
            .message-box { background-color: #fff; padding: 15px; border-left: 4px solid #f5c518; margin-top: 10px; }
            .footer { text-align: center; margin-top: 30px; color: #888; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎯 New Contact Form Submission</h1>
            </div>
            <div class="content">
              <div class="field">
                <div class="label">Name:</div>
                <div class="value">${contactData.name}</div>
              </div>
              <div class="field">
                <div class="label">Email:</div>
                <div class="value"><a href="mailto:${contactData.email}">${contactData.email}</a></div>
              </div>
              ${contactData.phone ? `
              <div class="field">
                <div class="label">Phone:</div>
                <div class="value">${contactData.phone}</div>
              </div>
              ` : ''}
              ${contactData.company ? `
              <div class="field">
                <div class="label">Company:</div>
                <div class="value">${contactData.company}</div>
              </div>
              ` : ''}
              ${contactData.service ? `
              <div class="field">
                <div class="label">Service Interest:</div>
                <div class="value">${contactData.service}</div>
              </div>
              ` : ''}
              <div class="field">
                <div class="label">Message:</div>
                <div class="message-box">${contactData.message}</div>
              </div>
            </div>
            <div class="footer">
              <p>This email was sent from your VibeGlobally contact form</p>
              <p>Received at ${new Date().toLocaleString()}</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const textContent = `
New Contact Form Submission

Name: ${contactData.name}
Email: ${contactData.email}
${contactData.phone ? `Phone: ${contactData.phone}` : ''}
${contactData.company ? `Company: ${contactData.company}` : ''}
${contactData.service ? `Service Interest: ${contactData.service}` : ''}

Message:
${contactData.message}

---
Received at ${new Date().toLocaleString()}
    `;

    // Send email
    const info = await transporter.sendMail({
      from: `"${config.from.name}" <${config.from.email}>`,
      to: 'lyndon@vibeglobally.ph',
      subject: `New Contact: ${contactData.name} - ${contactData.service || 'General Inquiry'}`,
      text: textContent,
      html: htmlContent,
      replyTo: contactData.email,
    });

    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}
