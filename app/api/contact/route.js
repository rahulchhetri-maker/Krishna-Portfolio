import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    // 0. Validate required environment variables first.
    // If these are missing, fail fast with a clear JSON error instead of
    // letting nodemailer throw an obscure auth error later.
    if (
      !process.env.GMAIL_USER ||
      !process.env.GMAIL_APP_PASSWORD ||
      !process.env.RECEIVER_EMAIL
    ) {
      console.error(
        "Missing required env vars: GMAIL_USER, GMAIL_APP_PASSWORD, or RECEIVER_EMAIL",
      );
      return NextResponse.json(
        {
          success: false,
          message: "Server email configuration is missing. Contact the site owner.",
        },
        { status: 500 },
      );
    }

    const { name, email, message } = await request.json();

    // 1. Connect to your Gmail
    // NOTE: imported dynamically (instead of at the top of the file) so that
    // if the package fails to load for any reason, it's caught below and
    // returned as JSON instead of crashing the route before our try/catch
    // can run (which produces a non-JSON error page on the client).
    const nodemailer = (await import("nodemailer")).default;
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    // 2. Email sent to YOU (with their message)
    const mailToYou = {
      from: process.env.GMAIL_USER,
      to: process.env.RECEIVER_EMAIL,
      replyTo: email,
      subject: `New Message from ${name}`,
      text: `You received a new message from your portfolio website:\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 20px 0; background-color: #f1f2f8; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
          <table border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td align="center">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.08); border: 1px solid #dfe1ea;">
                  
                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #3b2280 0%, #6c4ed9 100%); padding: 32px 30px; text-align: left;">
                      <table border="0" cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="background-color: rgba(255, 255, 255, 0.2); border-radius: 20px; padding: 6px 14px;">
                            <table border="0" cellpadding="0" cellspacing="0">
                              <tr>
                                <td valign="middle" style="padding-right: 8px;">
                                  <img src="https://raw.githubusercontent.com/n64quant/public-assets/main/green-pulse.gif" alt="Live" width="10" height="10" style="display: block; border-radius: 50%;" />
                                </td>
                                <td valign="middle">
                                  <span style="color: #ffffff; font-size: 11px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;">New Inquiry</span>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                      <h1 style="color: #ffffff; margin: 16px 0 0 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">
                        Portfolio Contact Message
                      </h1>
                    </td>
                  </tr>

                  <!-- Content Body -->
                  <tr>
                    <td style="padding: 32px 30px;">
                      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8f8fc; border-radius: 12px; padding: 20px; border: 1px solid #ebe6ff;">
                        <tr>
                          <td style="padding-bottom: 14px;">
                            <span style="font-size: 11px; font-weight: 700; color: #6c4ed9; text-transform: uppercase; letter-spacing: 0.8px; display: block; margin-bottom: 4px;">From</span>
                            <div style="font-size: 16px; font-weight: 600; color: #20212d;">${name}</div>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <span style="font-size: 11px; font-weight: 700; color: #6c4ed9; text-transform: uppercase; letter-spacing: 0.8px; display: block; margin-bottom: 4px;">Email Address</span>
                            <div style="font-size: 15px;">
                              <a href="mailto:${email}" style="color: #5639bf; text-decoration: none; font-weight: 600;">${email}</a>
                            </div>
                          </td>
                        </tr>
                      </table>

                      <div style="margin-top: 28px;">
                        <span style="font-size: 11px; font-weight: 700; color: #65687a; text-transform: uppercase; letter-spacing: 0.8px; display: block; margin-bottom: 8px;">Message Content</span>
                        <div style="background-color: #ffffff; border: 1px solid #dfe1ea; border-left: 4px solid #6c4ed9; padding: 18px; border-radius: 0 8px 8px 0; font-size: 15px; line-height: 1.6; color: #20212d; white-space: pre-wrap;">${message}</div>
                      </div>

                      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-top: 32px;">
                        <tr>
                          <td align="center">
                            <a href="mailto:${email}?subject=Re:%20Portfolio%20Inquiry" style="display: inline-block; background: #6c4ed9; background: linear-gradient(135deg, #5639bf, #6c4ed9); color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 700; padding: 14px 30px; border-radius: 8px; box-shadow: 0 4px 14px rgba(108, 78, 217, 0.35);">
                              Reply Directly to ${name} 
                            </a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #f8f8fc; padding: 18px 30px; text-align: center; border-top: 1px solid #dfe1ea; font-size: 12px; color: #65687a;">
                      Sent automatically via <strong>Krishna Aryal Portfolio</strong>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
    };

    // 3. "24 Hour" Auto-reply sent to the VISITOR
    const mailToVisitor = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: `We received your message, ${name}!`,
      text: `Hi ${name},\n\nThank you for reaching out! I have received your message and will get back to you within 24 hours.\n\nYour message:\n"${message}"\n\nBest regards,\nKrishna Aryal`,
    };

    // 4. Send both emails
    await transporter.sendMail(mailToYou);
    await transporter.sendMail(mailToVisitor);

    return NextResponse.json({
      success: true,
      message: "Message sent successfully!",
    });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to send message." },
      { status: 500 },
    );
  }
}
