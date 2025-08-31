const failedLoginAttemptEmailTemplate = `
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
            font-family: 'Inter', Arial, sans-serif;
            line-height: 1.6;
            color: #1a1a1a;
            background: #667eea;
            margin: 0;
            padding: 20px;
        }
        
        /* Main container table */
        .email-wrapper {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 24px;
            overflow: hidden;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
        }
        
        .header {
            background: #3b82f6;
            padding: 40px 30px;
            text-align: center;
        }
        
        .logo {
            font-size: 28px;
            font-weight: 700;
            color: white;
            margin-bottom: 8px;
        }
        
        .tagline {
            color: rgba(255, 255, 255, 0.9);
            font-size: 14px;
            font-weight: 400;
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
        
        /* Details card using table */
        .details-card {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 16px;
            padding: 0;
            margin: 30px 0;
            overflow: hidden;
        }
        
        .details-header {
            background: #f1f5f9;
            padding: 20px 24px 16px;
            border-bottom: 1px solid #e2e8f0;
        }
        
        .details-title {
            font-size: 18px;
            font-weight: 600;
            color: #1e293b;
            margin: 0;
        }
        
        .details-body {
            padding: 8px 0;
        }
        
        /* Table for detail items */
        .detail-table {
            width: 100%;
            border-collapse: collapse;
        }
        
        .detail-row {
            border-bottom: 1px solid #e2e8f0;
        }
        
        .detail-row:last-child {
            border-bottom: none;
        }
        
        .detail-label {
            font-weight: 500;
            color: #64748b;
            font-size: 14px;
            padding: 12px 24px;
            width: 40%;
            vertical-align: top;
        }
        
        .detail-value {
            font-weight: 600;
            color: #1e293b;
            font-size: 14px;
            padding: 12px 24px;
            text-align: right;
            word-break: break-all;
        }
        
        .notice-card {
            border-radius: 12px;
            padding: 20px;
            margin: 30px 0;
        }
        
        .notice-success {
            background: #fef3c7;
            border: 1px solid #f59e0b;
        }
        
        .notice-warning {
            background: #fef2f2;
            border: 1px solid #f87171;
        }
        
        .notice-info {
            background: #dbeafe;
            border: 1px solid #3b82f6;
        }
        
        .notice-table {
            width: 100%;
            border-collapse: collapse;
        }
        
        .notice-icon {
            font-size: 24px;
            width: 40px;
            vertical-align: top;
            padding-right: 12px;
        }
        
        .notice-content {
            vertical-align: top;
        }
        
        .notice-title {
            font-weight: 600;
            margin-bottom: 8px;
        }
        
        .notice-title-success { color: #92400e; }
        .notice-title-warning { color: #dc2626; }
        .notice-title-info { color: #1d4ed8; }
        
        .notice-text-success { color: #78350f; }
        .notice-text-warning { color: #7f1d1d; }
        .notice-text-info { color: #1e40af; }
        
        .action-list {
            list-style: none;
            counter-reset: step-counter;
            margin: 16px 0 0 0;
            padding: 0;
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
            text-align: center;
            line-height: 24px;
            font-size: 12px;
            font-weight: 600;
        }
        
        .cta-section {
            text-align: center;
            margin: 40px 0;
        }
        
        .cta-button {
            display: inline-block;
            background: #3b82f6;
            color: white !important;
            text-decoration: none;
            padding: 16px 32px;
            border-radius: 12px;
            font-weight: 600;
            font-size: 16px;
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
        
        .signature {
            margin-top: 30px;
            font-weight: 600;
            color: #1e293b;
        }
        
        /* Mobile styles */
        @media (max-width: 600px) {
            .email-wrapper {
                margin: 10px;
                border-radius: 16px;
            }
            
            .content, .header, .footer {
                padding: 20px !important;
            }
            
            .detail-label,
            .detail-value {
                display: block;
                width: 100% !important;
                text-align: left !important;
                padding: 8px 24px !important;
            }
            
            .detail-label {
                padding-bottom: 4px !important;
                border-bottom: none;
            }
            
            .detail-value {
                padding-top: 0 !important;
                padding-bottom: 12px !important;
            }
        }
    </style>
</head>
<body>
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
            <td align="center" style="padding: 20px;">
                <table class="email-wrapper" cellpadding="0" cellspacing="0" border="0">
                    <!-- Header -->
                    <tr>
                        <td class="header">
                            <div class="logo">Workly Contacts</div>
                            <div class="tagline">Secure Contact Management</div>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td class="content">
                            <div class="greeting">Hi {{name}},</div>
                            
                            <div class="message">
                                We detected a <strong>failed login attempt</strong> to your <strong>Workly Contacts</strong> account. Your security is important to us, so we're alerting you about this suspicious activity.
                            </div>
                            
                            <!-- Details Card -->
                            <div class="details-card">
                                <div class="details-header">
                                    <div class="details-title">🚨 Attempt Details</div>
                                </div>
                                <div class="details-body">
                                    <table class="detail-table" cellpadding="0" cellspacing="0" border="0">
                                        <tr class="detail-row">
                                            <td class="detail-label">Time</td>
                                            <td class="detail-value">{{time}}</td>
                                        </tr>
                                        <tr class="detail-row">
                                            <td class="detail-label">IP Address</td>
                                            <td class="detail-value">{{ip}}</td>
                                        </tr>
                                        <tr class="detail-row">
                                            <td class="detail-label">Location</td>
                                            <td class="detail-value">{{location}}</td>
                                        </tr>
                                        <tr class="detail-row">
                                            <td class="detail-label">Device</td>
                                            <td class="detail-value">{{device}}</td>
                                        </tr>
                                        <tr class="detail-row">
                                            <td class="detail-label">Browser</td>
                                            <td class="detail-value">{{browser}}</td>
                                        </tr>
                                        <tr class="detail-row">
                                            <td class="detail-label">Operating System</td>
                                            <td class="detail-value">{{os}}</td>
                                        </tr>
                                    </table>
                                </div>
                            </div>
                            
                            <!-- Success Notice -->
                            <div class="notice-card notice-success">
                                <table class="notice-table" cellpadding="0" cellspacing="0" border="0">
                                    <tr>
                                        <td class="notice-icon">✅</td>
                                        <td class="notice-content">
                                            <div class="notice-title notice-title-success">If this was you</div>
                                            <div class="notice-text-success">You can safely ignore this message. Your account remains secure.</div>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                            
                            <!-- Warning Notice -->
                            <div class="notice-card notice-warning">
                                <table class="notice-table" cellpadding="0" cellspacing="0" border="0">
                                    <tr>
                                        <td class="notice-icon">⚠️</td>
                                        <td class="notice-content">
                                            <div class="notice-title notice-title-warning">If this was not you, your account might be at risk. We recommend:</div>
                                            <ol class="action-list">
                                                <li>Change your password immediately</li>
                                                <li>Review your recent activity</li>
                                                <li>Monitor your account for any suspicious behavior</li>
                                            </ol>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                            
                            <!-- CTA Section -->
                            <div class="cta-section">
                                <a href="#" class="cta-button">Secure My Account</a>
                            </div>
                            
                            <!-- Info Notice -->
                            <div class="notice-card notice-info">
                                <table class="notice-table" cellpadding="0" cellspacing="0" border="0">
                                    <tr>
                                        <td class="notice-icon">🔐</td>
                                        <td class="notice-content">
                                            <div class="notice-title notice-title-info">Security Tip</div>
                                            <div class="notice-text-info">Never share your password with anyone. We will never ask for your password via email or phone.</div>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td class="footer">
                            <div class="footer-text">
                                Need assistance? Contact us at 
                                <a href="mailto:support@amarcontacts.com" class="contact-info">support@amarcontacts.com</a>
                            </div>
                            
                            <div class="signature">
                                Stay safe,<br>
                                <strong>The Workly Contacts Team</strong>
                            </div>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`;

export default failedLoginAttemptEmailTemplate;
