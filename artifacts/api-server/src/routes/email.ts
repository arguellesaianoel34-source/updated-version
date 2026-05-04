import { Router } from "express";
import { requireAuth } from "./auth";
import { sendContactNotification } from "../lib/email";
import nodemailer from 'nodemailer';

const router = Router();

// Test SMTP connection endpoint
router.post("/email/test-connection", requireAuth, async (req, res) => {
  try {
    const { 
      smtpHost,
      smtpPort,
      smtpUser,
      smtpPassword
    } = req.body as {
      smtpHost?: string;
      smtpPort?: string;
      smtpUser?: string;
      smtpPassword?: string;
    };

    req.log.info({ body: req.body }, "Received test connection request");

    if (!smtpUser || !smtpPassword) {
      req.log.warn("Missing SMTP credentials");
      return res.status(400).json({ 
        success: false,
        message: "SMTP Username and Password are required"
      });
    }

    const config = {
      host: smtpHost || process.env.SMTP_HOST || 'smtp-relay.brevo.com',
      port: parseInt(smtpPort || process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: smtpUser || process.env.SMTP_USER || '',
        pass: smtpPassword || process.env.SMTP_PASSWORD || '',
      },
    };

    req.log.info({ host: config.host, port: config.port, user: config.auth.user }, "Testing SMTP connection");

    const transporter = nodemailer.createTransport(config);

    // Verify connection
    await transporter.verify();

    req.log.info("SMTP connection test successful");

    return res.status(200).json({ 
      success: true, 
      message: "SMTP connection successful! Your credentials are correct."
    });
  } catch (err: any) {
    req.log.error({ err, message: err.message, code: err.code }, "SMTP connection test failed");
    
    let errorMessage = "SMTP connection failed. ";
    
    // Provide more specific error messages
    if (err.code === 'EAUTH') {
      errorMessage += "Authentication failed. Please check your SMTP username and password.";
    } else if (err.code === 'ECONNECTION' || err.code === 'ETIMEDOUT') {
      errorMessage += "Could not connect to SMTP server. Please check your host and port.";
    } else if (err.code === 'ENOTFOUND') {
      errorMessage += "SMTP server not found. Please check your SMTP host address.";
    } else {
      errorMessage += err.message || "Unknown error occurred.";
    }
    
    return res.status(500).json({ 
      success: false,
      error: "SMTP connection failed",
      message: errorMessage,
      details: err.code || err.message
    });
  }
});

// Send test email endpoint
router.post("/email/send-test", requireAuth, async (req, res) => {
  try {
    const { 
      to,
      subject,
      text,
      smtpHost,
      smtpPort,
      smtpUser,
      smtpPassword,
      fromEmail,
      fromName
    } = req.body as {
      to: string;
      subject: string;
      text: string;
      smtpHost?: string;
      smtpPort?: string;
      smtpUser?: string;
      smtpPassword?: string;
      fromEmail?: string;
      fromName?: string;
    };

    if (!to || !subject || !text) {
      return res.status(400).json({ 
        success: false,
        message: "Recipient email, subject, and message are required" 
      });
    }

    if (!smtpUser || !smtpPassword) {
      return res.status(400).json({ 
        success: false,
        message: "SMTP Username and Password are required"
      });
    }

    // Use provided SMTP settings or fall back to environment variables
    const config = {
      host: smtpHost || process.env.SMTP_HOST || 'smtp-relay.brevo.com',
      port: parseInt(smtpPort || process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: smtpUser || process.env.SMTP_USER || '',
        pass: smtpPassword || process.env.SMTP_PASSWORD || '',
      },
      from: {
        name: fromName || process.env.FROM_NAME || 'VibeGlobally',
        email: fromEmail || process.env.FROM_EMAIL || 'lyndon@vibeglobally.ph',
      },
    };

    req.log.info({ to, from: config.from.email }, "Sending test email");

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: config.auth,
    });

    // HTML email template
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #f5c518; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
            .header h1 { margin: 0; color: #1a1a1a; }
            .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 5px 5px; }
            .message-box { background-color: #fff; padding: 20px; border-left: 4px solid #f5c518; margin-top: 20px; }
            .footer { text-align: center; margin-top: 30px; color: #888; font-size: 12px; }
            .success-badge { display: inline-block; background-color: #4caf50; color: white; padding: 5px 15px; border-radius: 20px; font-size: 14px; margin-top: 10px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✅ Test Email Successful</h1>
              <div class="success-badge">SMTP Configuration Working</div>
            </div>
            <div class="content">
              <h2>Your SMTP settings are configured correctly!</h2>
              <p>This is a test email from your VibeGlobally SMTP configuration.</p>
              <div class="message-box">
                <strong>Test Message:</strong><br>
                ${text}
              </div>
              <div style="margin-top: 20px; padding: 15px; background-color: #e8f5e9; border-radius: 5px;">
                <strong>✓ Email delivery is working</strong><br>
                <small>Sent at ${new Date().toLocaleString()}</small>
              </div>
            </div>
            <div class="footer">
              <p>This is a test email from VibeGlobally SMTP Settings</p>
              <p>If you received this email, your configuration is correct!</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const textContent = `
Test Email from VibeGlobally

Your SMTP settings are configured correctly!

Test Message:
${text}

✓ Email delivery is working
Sent at ${new Date().toLocaleString()}

---
This is a test email from VibeGlobally SMTP Settings
If you received this email, your configuration is correct!
    `;

    // Send email
    const info = await transporter.sendMail({
      from: `"${config.from.name}" <${config.from.email}>`,
      to: to,
      subject: subject,
      text: textContent,
      html: htmlContent,
    });

    req.log.info({ messageId: info.messageId }, "Test email sent successfully");

    return res.json({ 
      success: true, 
      messageId: info.messageId,
      message: `Test email sent successfully to ${to}! Check your inbox.`
    });
  } catch (err: any) {
    req.log.error({ err }, "Error sending test email");
    
    let errorMessage = "Failed to send test email. ";
    
    // Provide more specific error messages
    if (err.code === 'EAUTH') {
      errorMessage += "Authentication failed. Please check your SMTP username and password.";
    } else if (err.code === 'ECONNECTION' || err.code === 'ETIMEDOUT') {
      errorMessage += "Could not connect to SMTP server. Please check your host and port.";
    } else if (err.code === 'ENOTFOUND') {
      errorMessage += "SMTP server not found. Please check your SMTP host address.";
    } else if (err.responseCode === 550 || err.responseCode === 553) {
      errorMessage += "Invalid sender email address. Please verify your 'From Email' is authorized in Brevo.";
    } else {
      errorMessage += err.message || "Unknown error occurred.";
    }
    
    return res.status(500).json({ 
      success: false,
      error: "Failed to send test email",
      message: errorMessage,
      details: err.code || err.message
    });
  }
});

export default router;
