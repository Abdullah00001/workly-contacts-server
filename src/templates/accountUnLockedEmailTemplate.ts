export const accountUnlockedEmailTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Account Unlocked - Workly Contacts</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f4f4f4;">
        <tr>
            <td align="center" style="padding: 20px 0;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <!-- Main Content -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <!-- Greeting -->
                            <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.5; color: #333333;">
                                Hi {{name}},
                            </p>
                            
                            <!-- Main Message -->
                            <p style="margin: 0 0 30px 0; font-size: 16px; line-height: 1.5; color: #333333;">
                                Your Workly Contacts account, associated with this email address, has been successfully unlocked. You can now access your account with full privileges.
                            </p>
                            
                            <!-- Account Status Table -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0 0 30px 0; border: 1px solid #e0e0e0; border-radius: 6px;">
                                <tr style="background-color: #f8f9fa;">
                                    <td colspan="2" style="padding: 15px 20px; font-size: 16px; font-weight: bold; color: #2c5aa0; border-bottom: 1px solid #e0e0e0;">
                                        Account Status
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 12px 20px; font-size: 14px; color: #666666; border-bottom: 1px solid #f0f0f0; width: 30%;">
                                        Status:
                                    </td>
                                    <td style="padding: 12px 20px; font-size: 14px; color: #28a745; font-weight: bold; border-bottom: 1px solid #f0f0f0;">
                                        ACTIVE
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 12px 20px; font-size: 14px; color: #666666; border-bottom: 1px solid #f0f0f0;">
                                        Unlocked on:
                                    </td>
                                    <td style="padding: 12px 20px; font-size: 14px; color: #333333; border-bottom: 1px solid #f0f0f0;">
                                        {{time}}
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 12px 20px; font-size: 14px; color: #666666;">
                                        Access Level:
                                    </td>
                                    <td style="padding: 12px 20px; font-size: 14px; color: #333333;">
                                        Full Access Restored
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Next Steps -->
                            <div style="margin: 0 0 30px 0;">
                                <p style="margin: 0 0 15px 0; font-size: 16px; font-weight: bold; color: #2c5aa0;">
                                    Next Steps:
                                </p>
                                <ul style="margin: 0; padding-left: 20px; color: #333333; font-size: 14px; line-height: 1.6;">
                                    <li style="margin-bottom: 8px;">Sign in with your new password to access your account.</li>
                                    <li style="margin-bottom: 8px;">Review your account activity in the Security & Password section.</li>
                                    <li style="margin-bottom: 8px;">Make sure your recovery information is up to date.</li>
                                </ul>
                            </div>
                            
                            <!-- Support Information -->
                            <div style="margin: 0 0 30px 0; padding: 20px; background-color: #f8f9fa; border-radius: 6px; border-left: 4px solid #2c5aa0;">
                                <p style="margin: 0 0 10px 0; font-size: 14px; font-weight: bold; color: #2c5aa0;">
                                    Need Help?
                                </p>
                                <p style="margin: 0; font-size: 14px; color: #333333; line-height: 1.5;">
                                    If you have any questions or concerns about your account security, our support team is here to help: 
                                    <a href="mailto:support@workly.ink" style="color: #2c5aa0; text-decoration: none;">support@workly.ink</a>
                                </p>
                            </div>
                            
                            <!-- Closing Message -->
                            <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.5; color: #333333;">
                                Thank you for taking quick action to secure your account. Welcome back to Workly Contacts!
                            </p>
                            
                            <!-- Signature -->
                            <p style="margin: 0 0 30px 0; font-size: 16px; color: #2c5aa0; font-weight: bold;">
                                The Workly Contacts Team
                            </p>
                            
                            <!-- Disclaimer -->
                            <div style="border-top: 1px solid #e0e0e0; padding-top: 20px;">
                                <p style="margin: 0 0 10px 0; font-size: 12px; color: #666666; line-height: 1.4;">
                                    This confirmation email was sent because your Workly Contacts account was recently unlocked.
                                </p>
                                <p style="margin: 0; font-size: 12px; color: #666666;">
                                    © 2025 Workly Contacts. All rights reserved.
                                </p>
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
