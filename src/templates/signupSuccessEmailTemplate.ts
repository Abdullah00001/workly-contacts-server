const signupSuccessEmailTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Workly Contacts</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #334155;
            background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
            padding: 40px 20px;
            min-height: 100vh;
        }
        
        .email-container {
            max-width: 580px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 16px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05), 0 10px 25px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        
        .header {
            background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
            padding: 40px 32px;
            text-align: center;
            position: relative;
        }
        
        .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: radial-gradient(circle at 30% 20%, rgba(255,255,255,0.1) 0%, transparent 50%);
            pointer-events: none;
        }
        
        .logo {
            font-size: 24px;
            font-weight: 700;
            color: white;
            margin-bottom: 8px;
            position: relative;
            z-index: 1;
        }
        
        .tagline {
            color: rgba(255, 255, 255, 0.9);
            font-size: 15px;
            font-weight: 400;
            position: relative;
            z-index: 1;
        }
        
        .heart {
            color: #ef4444;
            font-size: 16px;
            margin-left: 4px;
        }
        
        .content {
            padding: 32px;
        }
        
        .greeting {
            font-size: 20px;
            font-weight: 600;
            color: #1e293b;
            margin-bottom: 16px;
        }
        
        .welcome-text {
            font-size: 16px;
            color: #475569;
            line-height: 1.7;
            margin-bottom: 32px;
        }
        
        .features-section {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 24px;
            margin-bottom: 32px;
        }
        
        .features-title {
            font-size: 16px;
            font-weight: 600;
            color: #1e293b;
            margin-bottom: 20px;
        }
        
        .feature-list {
            list-style: none;
        }
        
        .feature-item {
            display: flex;
            align-items: flex-start;
            margin-bottom: 12px;
            font-size: 15px;
            color: #475569;
        }
        
        .feature-item:last-child {
            margin-bottom: 0;
        }
        
        .feature-icon {
            color: #3b82f6;
            margin-right: 12px;
            margin-top: 2px;
            font-size: 16px;
            flex-shrink: 0;
        }
        
        .ready-section {
            background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
            border: 1px solid #93c5fd;
            border-radius: 12px;
            padding: 20px;
            text-align: center;
            margin-bottom: 24px;
        }
        
        .ready-title {
            font-size: 16px;
            font-weight: 600;
            color: #1d4ed8;
            margin-bottom: 4px;
        }
        
        .ready-subtitle {
            font-size: 14px;
            color: #3730a3;
        }
        
        .gift-section {
            background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
            border: 1px solid #fbbf24;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 28px;
        }
        
        .gift-title {
            font-size: 16px;
            font-weight: 600;
            color: #92400e;
            margin-bottom: 8px;
            display: flex;
            align-items: center;
        }
        
        .gift-icon {
            margin-right: 8px;
            font-size: 18px;
        }
        
        .gift-text {
            font-size: 14px;
            color: #a16207;
            line-height: 1.5;
        }
        
        .cta-section {
            text-align: center;
            margin-bottom: 32px;
        }
        
        .cta-button {
            display: inline-flex;
            align-items: center;
            background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
            color: white;
            text-decoration: none;
            padding: 14px 28px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 15px;
            transition: all 0.2s ease;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        
        .cta-button:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }
        
        .cta-icon {
            margin-right: 8px;
            font-size: 16px;
        }
        
        .support-text {
            font-size: 14px;
            color: #64748b;
            text-align: center;
            line-height: 1.6;
            margin-bottom: 32px;
        }
        
        .footer {
            background: #f8fafc;
            border-top: 1px solid #e2e8f0;
            padding: 24px 32px;
            text-align: center;
        }
        
        .footer-message {
            font-size: 15px;
            color: #475569;
            margin-bottom: 16px;
            line-height: 1.6;
        }
        
        .signature {
            font-size: 15px;
            font-weight: 600;
            color: #1e293b;
            margin-bottom: 8px;
        }
        
        .company-tagline {
            font-size: 13px;
            color: #64748b;
            font-style: italic;
        }
        
        /* Responsive Design */
        @media (max-width: 640px) {
            body {
                padding: 20px 16px;
            }
            
            .email-container {
                max-width: 100%;
            }
            
            .content {
                padding: 24px 20px;
            }
            
            .header {
                padding: 32px 20px;
            }
            
            .footer {
                padding: 20px;
            }
            
            .greeting {
                font-size: 18px;
            }
            
            .welcome-text {
                font-size: 15px;
            }
            
            .features-section {
                padding: 20px;
            }
        }
        
        /* Accessibility */
        @media (prefers-reduced-motion: reduce) {
            .cta-button {
                transition: none;
            }
            
            .cta-button:hover {
                transform: none;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header -->
        <div class="header">
            <div class="logo">Workly Contacts</div>
            <div class="tagline">where every connection counts<span class="heart">💙</span></div>
        </div>
        
        <!-- Main Content -->
        <div class="content">
            <div class="greeting">Hi {{name}},</div>
            
            <div class="welcome-text">
                <strong>Welcome to Workly Contacts</strong> — we're beyond excited to have you join our growing community of people who value clean, organized, and meaningful contact management. This isn't just another signup — it's the beginning of a smarter, more personal way to stay connected.
            </div>
            
            <!-- Features -->
            <div class="features-section">
                <div class="features-title">Here's what you can look forward to:</div>
                <ul class="feature-list">
                    <li class="feature-item">
                        <span class="feature-icon">🔹</span>
                        <span>Organize contacts like never before</span>
                    </li>
                    <li class="feature-item">
                        <span class="feature-icon">🔹</span>
                        <span>Add labels, merge duplicates, and keep things tidy</span>
                    </li>
                    <li class="feature-item">
                        <span class="feature-icon">🔹</span>
                        <span>Import/export your data anytime, hassle-free</span>
                    </li>
                    <li class="feature-item">
                        <span class="feature-icon">🔹</span>
                        <span>Enjoy a beautifully simple and secure experience</span>
                    </li>
                </ul>
            </div>
            
            <!-- Account Ready -->
            <div class="ready-section">
                <div class="ready-title">🔐 Your account is ready.</div>
                <div class="ready-subtitle">Start fresh. Stay connected. Feel in control.</div>
            </div>
            
            <!-- Gift Section -->
            <div class="gift-section">
                <div class="gift-title">
                    <span class="gift-icon">🎁</span>
                    As a thank you
                </div>
                <div class="gift-text">
                    We've prepared a few helpful tips and features waiting for you inside.
                </div>
            </div>
            
            <!-- Call to Action -->
            <div class="cta-section">
                <a href="#" class="cta-button">
                    <span class="cta-icon">👉</span>
                    Go to My Dashboard
                </a>
            </div>
            
            <!-- Support -->
            <div class="support-text">
                If you ever need help, have feedback, or just want to say hello — we're always just a message away.
            </div>
        </div>
        
        <!-- Footer -->
        <div class="footer">
            <div class="footer-message">
                Once again, <strong>thank you</strong> for trusting Workly Contacts. Let's build something wonderful together.
            </div>
            
            <div class="signature">
                Warmly,<br>
                The Workly Contacts Team
            </div>
            
            <div class="company-tagline">
                Because your contacts deserve better.
            </div>
        </div>
    </div>
</body>
</html>
`;

export default signupSuccessEmailTemplate;
