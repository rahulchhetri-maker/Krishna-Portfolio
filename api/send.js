
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  // Allow requests from frontend
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Safely parse body
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { name, email, message } = body || {};

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Please fill in all fields (Name, Email, Message).' });
    }

    // Send via Resend
    const data = await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: ['portfolioofkrishna@gmail.com'], // ⚠️ MUST BE THE EXACT EMAIL YOU SIGNED UP WITH ON RESEND.COM
      replyTo: email,
      subject: `New Portfolio Message from ${name}`,
      html: `
  <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0f172a; border-radius: 16px; overflow: hidden; border: 1px solid #1e293b; color: #f8fafc; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);">
    
    <!-- Gradient Header Banner -->
    <div style="background: linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%); padding: 32px 24px; text-align: center;">
      <h2 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: 700; letter-spacing: -0.5px; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">
        ⚡ New Contact Form Submission
      </h2>
    </div>

    <!-- Content Body -->
    <div style="padding: 28px 24px;">
      
      <!-- Name Field -->
      <div style="background-color: #1e293b; border-radius: 12px; padding: 16px 20px; margin-bottom: 16px; border-left: 4px solid #6366f1;">
        <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.2px; color: #94a3b8; display: block; margin-bottom: 4px;">Sender Name</span>
        <span style="font-size: 16px; font-weight: 600; color: #f8fafc;">${name}</span>
      </div>

      <!-- Email Field -->
      <div style="background-color: #1e293b; border-radius: 12px; padding: 16px 20px; margin-bottom: 16px; border-left: 4px solid #a855f7;">
        <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.2px; color: #94a3b8; display: block; margin-bottom: 4px;">Email Address</span>
        <a href="mailto:${email}" style="font-size: 16px; font-weight: 600; color: #38bdf8; text-decoration: none;">${email}</a>
      </div>

      <!-- Message Field -->
      <div style="background-color: #1e293b; border-radius: 12px; padding: 20px; border-left: 4px solid #ec4899;">
        <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.2px; color: #94a3b8; display: block; margin-bottom: 8px;">Message</span>
        <div style="font-size: 15px; line-height: 1.6; color: #cbd5e1; white-space: pre-wrap;">${message}</div>
      </div>

    </div>

    <!-- Footer -->
    <div style="padding: 16px 24px; background-color: #0b0f19; text-align: center; border-top: 1px solid #1e293b;">
      <p style="margin: 0; font-size: 12px; color: #64748b;">
        Sent via your website contact form
      </p>
    </div>

  </div>
`

    });

    return res.status(200).json({ success: true, data });
  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: err.message || 'Failed to send email' });
  }
}