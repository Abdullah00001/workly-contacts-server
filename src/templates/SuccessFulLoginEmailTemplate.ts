const SuccessFulLoginEmailTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login Notification - Workly Contacts</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #1a1a1a;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
            animation: gradientShift 15s ease infinite;
        }
        
        @keyframes gradientShift {
            0%, 100% { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
            50% { background: linear-gradient(135deg, #764ba2 0%, #667eea 100%); }
        }
        
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            border-radius: 24px;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
            overflow: hidden;
            animation: slideIn 0.8s ease-out;
        }
        
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .header {
            background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
            padding: 40px 30px;
            text-align: center;
            position: relative;
            overflow: hidden;
        }
        
        .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
            animation: float 20s ease-in-out infinite;
        }
        
        @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
        }
        
        .logo {
            font-size: 28px;
            font-weight: 700;
            color: white;
            margin-bottom: 8px;
            position: relative;
            z-index: 1;
        }
        
        .tagline {
            color: rgba(255, 255, 255, 0.9);
            font-size: 14px;
            font-weight: 400;
            position: relative;
            z-index: 1;
        }
        
        .content {
            padding: 40px 30px;
        }
        
        .greeting {
            font-size: 24px;
            font-weight: 600;
            color: #1e293b;
            margin-bottom: 20px;
        }
        
        .message {
            font-size: 16px;
            color: #475569;
            margin-bottom: 30px;
            line-height: 1.7;
        }
        
        .details-card {
            background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
            border: 1px solid #e2e8f0;
            border-radius: 16px;
            padding: 24px;
            margin: 30px 0;
            position: relative;
            overflow: hidden;
        }
        
        .details-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 3px;
            background: linear-gradient(90deg, #3b82f6, #8b5cf6, #06b6d4);
            animation: shimmer 3s ease-in-out infinite;
        }
        
        @keyframes shimmer {
            0%, 100% { transform: translateX(-100%); }
            50% { transform: translateX(100%); }
        }
        
        .details-title {
            font-size: 18px;
            font-weight: 600;
            color: #1e293b;
            margin-bottom: 16px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .detail-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 0;
            border-bottom: 1px solid #e2e8f0;
            transition: all 0.3s ease;
        }
        
        .detail-item:last-child {
            border-bottom: none;
        }
        
        .detail-item:hover {
            background: rgba(59, 130, 246, 0.05);
            margin: 0 -12px;
            padding: 12px;
            border-radius: 8px;
        }
        
        .detail-label {
            font-weight: 500;
            color: #64748b;
            font-size: 14px;
        }
        
        .detail-value {
            font-weight: 600;
            color: #1e293b;
            font-size: 14px;
            text-align: right;
            max-width: 200px;
            word-break: break-word;
        }
        
        .security-notice {
            background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
            border: 1px solid #f59e0b;
            border-radius: 12px;
            padding: 20px;
            margin: 30px 0;
            display: flex;
            align-items: flex-start;
            gap: 12px;
        }
        
        .security-icon {
            font-size: 24px;
            margin-top: 2px;
        }
        
        .security-text {
            flex: 1;
        }
        
        .security-title {
            font-weight: 600;
            color: #92400e;
            margin-bottom: 8px;
        }
        
        .action-steps {
            background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
            border: 1px solid #f87171;
            border-radius: 12px;
            padding: 24px;
            margin: 20px 0;
        }
        
        .action-title {
            font-weight: 600;
            color: #dc2626;
            margin-bottom: 16px;
            font-size: 16px;
        }
        
        .action-list {
            list-style: none;
            counter-reset: step-counter;
        }
        
        .action-list li {
            counter-increment: step-counter;
            margin: 12px 0;
            padding-left: 40px;
            position: relative;
            color: #7f1d1d;
            font-weight: 500;
        }
        
        .action-list li::before {
            content: counter(step-counter);
            position: absolute;
            left: 0;
            top: 0;
            background: #dc2626;
            color: white;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: 600;
        }
        
        .cta-section {
            text-align: center;
            margin: 40px 0;
        }
        
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
            color: white;
            text-decoration: none;
            padding: 16px 32px;
            border-radius: 12px;
            font-weight: 600;
            font-size: 16px;
            transition: all 0.3s ease;
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }
        
        .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4);
        }
        
        .footer {
            background: #f8fafc;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e2e8f0;
        }
        
        .footer-text {
            color: #64748b;
            font-size: 14px;
            margin-bottom: 16px;
        }
        
        .contact-info {
            color: #3b82f6;
            text-decoration: none;
            font-weight: 500;
        }
        
        .contact-info:hover {
            text-decoration: underline;
        }
        
        .signature {
            margin-top: 30px;
            font-weight: 600;
            color: #1e293b;
        }
        
        @media (max-width: 600px) {
            .email-container {
                margin: 10px;
                border-radius: 16px;
            }
            
            .content, .header, .footer {
                padding: 20px;
            }
            
            .detail-item {
                flex-direction: column;
                align-items: flex-start;
                gap: 4px;
            }
            
            .detail-value {
                text-align: left;
                max-width: 100%;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <div class="logo">Workly Contacts</div>
            <div class="tagline">Secure Contact Management</div>
        </div>
        
        <div class="content">
            <div class="greeting">Hi {{name}},</div>
            
            <div class="message">
                We noticed a successful login to your <strong>Workly Contacts</strong> account. Your security is important to us, so we're letting you know about this activity.
            </div>
            
            <div class="details-card">
                <div class="details-title">
                    🔍 Login Details
                </div>
                <div class="detail-item">
                    <span class="detail-label">Time</span>
                    <span class="detail-value">{{time}}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">IP Address</span>
                    <span class="detail-value">{{ip}}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Location</span>
                    <span class="detail-value">{{location}}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Device</span>
                    <span class="detail-value">{{device}}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Browser</span>
                    <span class="detail-value">{{browser}}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Operating System</span>
                    <span class="detail-value">{{os}}</span>
                </div>
            </div>
            
            <div class="security-notice">
                <div class="security-icon">✅</div>
                <div class="security-text">
                    <div class="security-title">If this was you</div>
                    <div>No further action is needed. You can safely ignore this email.</div>
                </div>
            </div>
            
            <div class="action-steps">
                <div class="action-title">⚠️ If this wasn't you, please take immediate action:</div>
                <ol class="action-list">
                    <li>Change your password immediately</li>
                    <li>Review your account activity</li>
                    <li>Log out of all other devices</li>
                </ol>
            </div>
            
            <div class="cta-section">
                <a href="#" class="cta-button">Secure My Account</a>
            </div>
            
            <div class="security-notice" style="background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%); border-color: #3b82f6;">
                <div class="security-icon">🔒</div>
                <div class="security-text">
                    <div class="security-title" style="color: #1d4ed8;">Your security is our top priority</div>
                    <div style="color: #1e40af;">We continuously monitor your account for suspicious activity to keep your contacts safe.</div>
                </div>
            </div>
        </div>
        
        <div class="footer">
            <div class="footer-text">
                Need help? Contact our support team at 
                <a href="mailto:support@amarcontacts.com" class="contact-info">support@amarcontacts.com</a>
            </div>
            
            <div class="signature">
                Best regards,<br>
                <strong>The Workly Contacts Team</strong>
            </div>
        </div>
    </div>
</body>
</html>
`;

export default SuccessFulLoginEmailTemplate;
