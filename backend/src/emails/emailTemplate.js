export function createWelcomeEmailTemplate(name, clientURL) {
  return `
<!doctype html>
  <html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to ChitChat</title>
    <style>
      /* Basic responsive styles for most email clients */
      body { margin:0; padding:0; background-color:#f4f6f8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; color:#333333; }
      .container { width:100%; max-width:680px; margin:0 auto; }
      .card { background:#ffffff; border-radius:12px; overflow:hidden; box-shadow: 0 6px 24px rgba(18,38,63,0.08); }
      .header { background: linear-gradient(90deg,#4B6CB7 0%,#182848 100%); padding:28px 24px; text-align:center; color:#ffffff; }
      .logo { display:inline-block; width:56px; height:56px; border-radius:12px; background:#ffffff22; padding:6px; vertical-align:middle; }
      .title { font-size:20px; font-weight:600; margin:8px 0 0; }
      .content { padding:28px 28px 20px; }
      .greeting { font-size:18px; color:#102a43; margin:0 0 12px; }
      .lead { font-size:15px; color:#334e68; line-height:1.5; margin:0 0 18px; }
      .features { background:#f7fbff; border-left:4px solid #5b86e5; padding:16px; border-radius:8px; margin:12px 0 20px; }
      .feature-list { margin:0; padding-left:18px; color:#334e68; }
      .cta { text-align:center; margin:20px 0; }
      .button { display:inline-block; text-decoration:none; background:linear-gradient(90deg,#5b86e5 0%,#36d1dc 100%); color:#fff; padding:12px 26px; border-radius:8px; font-weight:600; }
      .small { font-size:13px; color:#627d98; }
      .footer { padding:18px 24px; text-align:center; font-size:12px; color:#9fb0c8; }
      a { color:#2b7ed7; }
      @media (max-width:480px){ .header{padding:20px 16px;} .content{padding:20px 16px;} }
    </style>
  </head>
  <body>
    <table class="container" cellpadding="0" cellspacing="0" role="presentation">
      <tr>
        <td style="padding:24px 16px;">
          <div class="card">
            <div class="header">
              <div style="text-align:center;">
                <img class="logo" src="./logo.svg" alt="ChitChat Logo" />
                <div style="font-size:18px; font-weight:700;">Welcome to ChitChat</div>
                <div style="font-size:13px; opacity:0.95; margin-top:4px;">Messaging made simple</div>
              </div>
            </div>
            <div class="content">
              <p class="greeting">Hello ${name},</p>
              <p class="lead">Welcome to ChitChat — we're glad you're here. ChitChat helps you stay connected with the people who matter through private, secure, and fast messaging.</p>

              <div class="features">
                <strong style="display:block; margin-bottom:8px;">Quick start</strong>
                <ul class="feature-list">
                  <li>Complete your profile so contacts can recognize you</li>
                  <li>Search and add friends by username or email</li>
                  <li>Start group chats and share media instantly</li>
                </ul>
              </div>

              <div class="cta">
                <a class="button" href="${clientURL}" target="_blank" rel="noopener">Open ChitChat</a>
              </div>

              <p class="small">Need help? Reply to this email we are always here to help you. Your account is protected — we never share your password.</p>
              <p style="margin-top:18px; font-size:14px; color:#334e68;">Happy chatting,<br><strong>The ChitChat Team</strong></p>
            </div>
            <div class="footer">
              <div>© ${new Date().getFullYear()} ChitChat. All rights reserved.</div>
            </div>
          </div>
        </td>
      </tr>
    </table>
  </body>
</html>
  `;
}