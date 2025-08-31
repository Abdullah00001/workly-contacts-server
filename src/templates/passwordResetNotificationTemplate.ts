export const passwordResetNotificationTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Password Reset Confirmation</title>
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
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
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

    .success-container {
      background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
      border-radius: 10px;
      padding: 30px;
      text-align: center;
      margin: 30px 0;
      border: 2px solid #10b981;
    }

    .success-icon {
      font-size: 48px;
      margin-bottom: 15px;
    }

    .success-title {
      font-size: 20px;
      font-weight: 700;
      color: #065f46;
      margin-bottom: 10px;
    }

    .success-message {
      font-size: 16px;
      color: #047857;
      margin: 0;
    }

    .details-section {
      background-color: #f9fafb;
      border-radius: 8px;
      padding: 20px;
      margin: 30px 0;
    }

    .details-title {
      font-size: 16px;
      font-weight: 600;
      color: #374151;
      margin-bottom: 15px;
    }

    .detail-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
      border-bottom: 1px solid #e5e7eb;
      font-size: 14px;
    }

    .detail-item:last-child {
      border-bottom: none;
    }

    .detail-label {
      color: #6b7280;
      font-weight: 500;
    }

    .detail-value {
      color: #374151;
      font-weight: 600;
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
      line-height: 1.4;
    }

    .action-buttons {
      text-align: center;
      margin: 30px 0;
    }

    .btn {
      display: inline-block;
      padding: 12px 24px;
      margin: 0 10px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
      font-size: 14px;
      transition: all 0.3s ease;
    }

    .btn-primary {
      background-color: #10b981;
      color: #ffffff;
    }

    .btn-primary:hover {
      background-color: #059669;
    }

    .btn-secondary {
      background-color: #f3f4f6;
      color: #374151;
      border: 1px solid #d1d5db;
    }

    .btn-secondary:hover {
      background-color: #e5e7eb;
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
      color: #10b981;
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
      
      .btn {
        display: block;
        margin: 10px 0;
        text-align: center;
      }

      .detail-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 4px;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="email-header">
      <div class="header-icon">🔑</div>
      <h1 class="header-title">Password Reset Successful</h1>
      <p class="header-subtitle">Your account is now secure</p>
    </div>

    <div class="email-body">
      <div class="greeting">
        Hello {{name}},
      </div>

      <div class="success-container">
        <div class="success-icon">✅</div>
        <div class="success-title">Password Successfully Reset</div>
        <p class="success-message">
          Your password has been changed and your account is now secure.
        </p>
      </div>

      <div class="message">
        We're writing to confirm that your password was successfully reset for your Workly Contacts account. You have been automatically logged in and can continue using your account.
      </div>

      <div class="details-section">
        <div class="details-title">📋 Reset Details</div>
        <div class="detail-item">
          <span class="detail-label">Date & Time:</span>
          <span class="detail-value">{{resetDateTime}}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">IP Address:</span>
          <span class="detail-value">{{ipAddress}}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Location:</span>
          <span class="detail-value">{{location}}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Device:</span>
          <span class="detail-value">{{device}}</span>
        </div>
      </div>

      <div class="action-buttons">
        <a href="{{dashboardUrl}}" class="btn btn-primary">Go to Dashboard</a>
        <a href="{{profileUrl}}" class="btn btn-secondary">Update Profile</a>
      </div>

      <div class="security-notice">
        <div class="security-notice-title">🛡️ Important Security Information</div>
        <p class="security-notice-text">
          If you didn't reset your password, please contact our support team immediately. We recommend keeping your password secure and not sharing it with anyone.
        </p>
      </div>

      <div class="message">
        For your security, we recommend reviewing your account information and ensuring your contact details are up to date.
      </div>
    </div>

    <div class="footer">
      <p class="footer-text">
        &copy; Workly Contacts. All rights reserved.
      </p>
      <div class="help-text">
        Questions about this reset? Contact our support team at <a href="mailto:{{supportEmail}}" style="color: #10b981;">{{supportEmail}}</a>
      </div>
    </div>
  </div>
</body>
</html>
`;
