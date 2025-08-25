export const verificationEmailTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>OTP Verification</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f8fafc;
      margin: 0;
      padding: 0;
    }

    .email-container {
      max-width: 580px;
      margin: 50px auto;
      background-color: #ffffff;
      border-radius: 12px;
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }

    .email-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #ffffff;
      text-align: center;
      padding: 40px 30px;
    }

    .header-icon {
      width: 60px;
      height: 60px;
      background-color: rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      margin: 0 auto 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
    }

    .header-title {
      font-size: 24px;
      font-weight: 700;
      margin: 0;
    }

    .header-subtitle {
      font-size: 16px;
      margin: 8px 0 0;
      opacity: 0.9;
    }

    .email-body {
      padding: 40px 30px;
    }

    .greeting {
      font-size: 18px;
      color: #1f2937;
      margin-bottom: 24px;
      font-weight: 500;
    }

    .message {
      font-size: 16px;
      color: #4b5563;
      line-height: 1.6;
      margin-bottom: 30px;
    }

    .otp-container {
      background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
      border-radius: 10px;
      padding: 30px;
      text-align: center;
      margin: 30px 0;
      border: 2px dashed #d1d5db;
    }

    .otp-label {
      font-size: 14px;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 10px;
      font-weight: 600;
    }

    .otp-code {
      font-size: 42px;
      font-weight: 800;
      color: #667eea;
      letter-spacing: 8px;
      font-family: 'Courier New', monospace;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
    }

    .security-notice {
      background-color: #fef3c7;
      border-left: 4px solid #f59e0b;
      padding: 16px 20px;
      margin: 30px 0;
      border-radius: 6px;
    }

    .security-notice-title {
      font-size: 14px;
      font-weight: 600;
      color: #92400e;
      margin-bottom: 8px;
    }

    .security-notice-text {
      font-size: 14px;
      color: #b45309;
      margin: 0;
    }

    .expiry-info {
      text-align: center;
      font-size: 15px;
      color: #6b7280;
      margin: 25px 0;
      padding: 15px;
      background-color: #f9fafb;
      border-radius: 8px;
    }

    .footer {
      background-color: #f9fafb;
      padding: 30px;
      text-align: center;
      border-top: 1px solid #e5e7eb;
    }

    .footer-text {
      font-size: 14px;
      color: #6b7280;
      margin: 0 0 15px;
    }

    .footer-links {
      margin-top: 20px;
    }

    .footer-links a {
      color: #667eea;
      text-decoration: none;
      font-size: 14px;
      margin: 0 15px;
      font-weight: 500;
    }

    .footer-links a:hover {
      text-decoration: underline;
    }

    .help-text {
      font-size: 14px;
      color: #9ca3af;
      text-align: center;
      margin-top: 20px;
      line-height: 1.5;
    }

    @media (max-width: 600px) {
      .email-container {
        margin: 20px auto;
        border-radius: 0;
      }
      
      .email-body {
        padding: 30px 20px;
      }
      
      .otp-code {
        font-size: 36px;
        letter-spacing: 6px;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="email-header">
      <div class="header-icon">✉️</div>
      <h1 class="header-title">Verify Your Account</h1>
      <p class="header-subtitle">Welcome to Workly Contacts</p>
    </div>

    <div class="email-body">
      <div class="greeting">
        Hello {{name}},
      </div>

      <div class="message">
        Thank you for signing up to Workly Contacts. To complete your registration and secure your account, please use the verification code below.
      </div>

      <div class="otp-container">
        <div class="otp-label">Your Verification Code</div>
        <div class="otp-code">{{otp}}</div>
      </div>

      <div class="expiry-info">
        ⏱️ This code expires in <strong>{{expirationTime}} minutes</strong>
      </div>

      <div class="security-notice">
        <div class="security-notice-title">🛡️ Security Notice</div>
        <p class="security-notice-text">
          Keep this code confidential. Never share it with anyone. Our team will never ask for your verification code.
        </p>
      </div>

      <div class="message">
        If you didn't create an account with us, please ignore this email and no further action is required.
      </div>
    </div>

    <div class="footer">
      <p class="footer-text">
        &copy; Workly Contacts. All rights reserved.
      </p>
      
      <div class="footer-links">
        <a href="https://contacts.workly.ink/">Visit Website</a>
        <a href="https://contacts.workly.ink/support">Need Help?</a>
        <a href="https://contacts.workly.ink/privacy">Privacy Policy</a>
      </div>

      <div class="help-text">
        Having trouble? Contact our support team for assistance.
      </div>
    </div>
  </div>
</body>
</html>
`;
