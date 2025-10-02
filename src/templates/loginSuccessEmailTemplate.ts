const loginSuccessEmailTemplate = `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Login Notification - Workly Contacts</title>
    <!--[if mso]>
      <noscript>
        <xml>
          <o:OfficeDocumentSettings>
            <o:PixelsPerInch>96</o:PixelsPerInch>
          </o:OfficeDocumentSettings>
        </xml>
      </noscript>
    <![endif]-->
  </head>
  <body
    style="
      margin: 0;
      padding: 0;
      font-family: Arial, Helvetica, sans-serif;
      line-height: 1.6;
      color: #1a1a1a;
      background-color: #667eea;
    "
  >
    <!-- Converted to table-based layout with inline styles for email compatibility -->
    <table
      role="presentation"
      cellspacing="0"
      cellpadding="0"
      border="0"
      width="100%"
    >
      <tr>
        <td align="center" style="padding: 20px">
          <table
            role="presentation"
            cellspacing="0"
            cellpadding="0"
            border="0"
            width="600"
            style="
              max-width: 600px;
              background-color: #ffffff;
              border-radius: 24px;
              box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
            "
          >
            <!-- Header -->
            <tr>
              <td
                style="
                  background-color: #2563eb;
                  padding: 40px 30px;
                  text-align: center;
                  border-radius: 24px 24px 0 0;
                "
              >
                <div
                  style="
                    font-size: 28px;
                    font-weight: bold;
                    color: white;
                    margin-bottom: 8px;
                    font-family: Arial, Helvetica, sans-serif;
                  "
                >
                  Workly Contacts
                </div>
                <div
                  style="
                    color: rgba(255, 255, 255, 0.9);
                    font-size: 14px;
                    font-family: Arial, Helvetica, sans-serif;
                  "
                >
                  Secure Contact Management
                </div>
              </td>
            </tr>

            <!-- Content -->
            <tr>
              <td style="padding: 40px 30px">
                <div
                  style="
                    font-size: 24px;
                    font-weight: bold;
                    color: #1e293b;
                    margin-bottom: 20px;
                    font-family: Arial, Helvetica, sans-serif;
                  "
                >
                  Hi {{name}},
                </div>

                <div
                  style="
                    font-size: 16px;
                    color: #475569;
                    margin-bottom: 30px;
                    line-height: 1.7;
                    font-family: Arial, Helvetica, sans-serif;
                  "
                >
                  We noticed a successful login to your
                  <strong>Workly Contacts</strong> account. Your security is
                  important to us, so we're letting you know about this
                  activity.
                </div>

                <!-- Details Card -->
                <table
                  role="presentation"
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                  width="100%"
                  style="
                    background-color: #f8fafc;
                    border: 1px solid #e2e8f0;
                    border-radius: 16px;
                    margin: 30px 0;
                  "
                >
                  <tr>
                    <td style="padding: 24px">
                      <div
                        style="
                          font-size: 18px;
                          font-weight: bold;
                          color: #1e293b;
                          margin-bottom: 16px;
                          font-family: Arial, Helvetica, sans-serif;
                        "
                      >
                        🔍 Login Details
                      </div>

                      <!-- Detail Items -->
                      <table
                        role="presentation"
                        cellspacing="0"
                        cellpadding="0"
                        border="0"
                        width="100%"
                      >
                        <tr>
                          <td
                            style="
                              padding: 12px 0;
                              border-bottom: 1px solid #e2e8f0;
                            "
                          >
                            <table
                              role="presentation"
                              cellspacing="0"
                              cellpadding="0"
                              border="0"
                              width="100%"
                            >
                              <tr>
                                <td
                                  style="
                                    font-weight: bold;
                                    color: #64748b;
                                    font-size: 14px;
                                    font-family: Arial, Helvetica, sans-serif;
                                  "
                                >
                                  Time
                                </td>
                                <td
                                  align="right"
                                  style="
                                    font-weight: bold;
                                    color: #1e293b;
                                    font-size: 14px;
                                    font-family: Arial, Helvetica, sans-serif;
                                  "
                                >
                                  {{time}}
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                        <tr>
                          <td
                            style="
                              padding: 12px 0;
                              border-bottom: 1px solid #e2e8f0;
                            "
                          >
                            <table
                              role="presentation"
                              cellspacing="0"
                              cellpadding="0"
                              border="0"
                              width="100%"
                            >
                              <tr>
                                <td
                                  style="
                                    font-weight: bold;
                                    color: #64748b;
                                    font-size: 14px;
                                    font-family: Arial, Helvetica, sans-serif;
                                  "
                                >
                                  IP Address
                                </td>
                                <td
                                  align="right"
                                  style="
                                    font-weight: bold;
                                    color: #1e293b;
                                    font-size: 14px;
                                    font-family: Arial, Helvetica, sans-serif;
                                  "
                                >
                                  {{ip}}
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                        <tr>
                          <td
                            style="
                              padding: 12px 0;
                              border-bottom: 1px solid #e2e8f0;
                            "
                          >
                            <table
                              role="presentation"
                              cellspacing="0"
                              cellpadding="0"
                              border="0"
                              width="100%"
                            >
                              <tr>
                                <td
                                  style="
                                    font-weight: bold;
                                    color: #64748b;
                                    font-size: 14px;
                                    font-family: Arial, Helvetica, sans-serif;
                                  "
                                >
                                  Location
                                </td>
                                <td
                                  align="right"
                                  style="
                                    font-weight: bold;
                                    color: #1e293b;
                                    font-size: 14px;
                                    font-family: Arial, Helvetica, sans-serif;
                                  "
                                >
                                  {{location}}
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                        <tr>
                          <td
                            style="
                              padding: 12px 0;
                              border-bottom: 1px solid #e2e8f0;
                            "
                          >
                            <table
                              role="presentation"
                              cellspacing="0"
                              cellpadding="0"
                              border="0"
                              width="100%"
                            >
                              <tr>
                                <td
                                  style="
                                    font-weight: bold;
                                    color: #64748b;
                                    font-size: 14px;
                                    font-family: Arial, Helvetica, sans-serif;
                                  "
                                >
                                  Device
                                </td>
                                <td
                                  align="right"
                                  style="
                                    font-weight: bold;
                                    color: #1e293b;
                                    font-size: 14px;
                                    font-family: Arial, Helvetica, sans-serif;
                                  "
                                >
                                  {{device}}
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                        <tr>
                          <td
                            style="
                              padding: 12px 0;
                              border-bottom: 1px solid #e2e8f0;
                            "
                          >
                            <table
                              role="presentation"
                              cellspacing="0"
                              cellpadding="0"
                              border="0"
                              width="100%"
                            >
                              <tr>
                                <td
                                  style="
                                    font-weight: bold;
                                    color: #64748b;
                                    font-size: 14px;
                                    font-family: Arial, Helvetica, sans-serif;
                                  "
                                >
                                  Browser
                                </td>
                                <td
                                  align="right"
                                  style="
                                    font-weight: bold;
                                    color: #1e293b;
                                    font-size: 14px;
                                    font-family: Arial, Helvetica, sans-serif;
                                  "
                                >
                                  {{browser}}
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 12px 0">
                            <table
                              role="presentation"
                              cellspacing="0"
                              cellpadding="0"
                              border="0"
                              width="100%"
                            >
                              <tr>
                                <td
                                  style="
                                    font-weight: bold;
                                    color: #64748b;
                                    font-size: 14px;
                                    font-family: Arial, Helvetica, sans-serif;
                                  "
                                >
                                  Operating System
                                </td>
                                <td
                                  align="right"
                                  style="
                                    font-weight: bold;
                                    color: #1e293b;
                                    font-size: 14px;
                                    font-family: Arial, Helvetica, sans-serif;
                                  "
                                >
                                  {{os}}
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>

                <!-- Security Notice - Success -->
                <table
                  role="presentation"
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                  width="100%"
                  style="
                    background-color: #fef3c7;
                    border: 1px solid #f59e0b;
                    border-radius: 12px;
                    margin: 30px 0;
                  "
                >
                  <tr>
                    <td style="padding: 20px">
                      <table
                        role="presentation"
                        cellspacing="0"
                        cellpadding="0"
                        border="0"
                        width="100%"
                      >
                        <tr>
                          <td width="40" style="vertical-align: top">
                            <div style="font-size: 24px; margin-top: 2px">
                              ✅
                            </div>
                          </td>
                          <td style="vertical-align: top">
                            <div
                              style="
                                font-weight: bold;
                                color: #92400e;
                                margin-bottom: 8px;
                                font-family: Arial, Helvetica, sans-serif;
                              "
                            >
                              If this was you
                            </div>
                            <div
                              style="
                                color: #92400e;
                                font-family: Arial, Helvetica, sans-serif;
                              "
                            >
                              No further action is needed. You can safely ignore
                              this email.
                            </div>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>

                <!-- Action Steps -->
                <table
                  role="presentation"
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                  width="100%"
                  style="
                    background-color: #fef2f2;
                    border: 1px solid #f87171;
                    border-radius: 12px;
                    margin: 20px 0;
                  "
                >
                  <tr>
                    <td style="padding: 24px">
                      <div
                        style="
                          font-weight: bold;
                          color: #dc2626;
                          margin-bottom: 16px;
                          font-size: 16px;
                          font-family: Arial, Helvetica, sans-serif;
                        "
                      >
                        ⚠️ If this wasn't you, please take immediate action:
                      </div>

                      <table
                        role="presentation"
                        cellspacing="0"
                        cellpadding="0"
                        border="0"
                        width="100%"
                      >
                        <tr>
                          <td style="padding: 6px 0">
                            <table
                              role="presentation"
                              cellspacing="0"
                              cellpadding="0"
                              border="0"
                              width="100%"
                            >
                              <tr>
                                <td width="30" style="vertical-align: top">
                                  <div
                                    style="
                                      background-color: #dc2626;
                                      color: white;
                                      width: 24px;
                                      height: 24px;
                                      border-radius: 50%;
                                      text-align: center;
                                      line-height: 24px;
                                      font-size: 12px;
                                      font-weight: bold;
                                      font-family: Arial, Helvetica, sans-serif;
                                    "
                                  >
                                    1
                                  </div>
                                </td>
                                <td
                                  style="
                                    color: #7f1d1d;
                                    font-weight: bold;
                                    font-family: Arial, Helvetica, sans-serif;
                                  "
                                >
                                  Change your password immediately
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 6px 0">
                            <table
                              role="presentation"
                              cellspacing="0"
                              cellpadding="0"
                              border="0"
                              width="100%"
                            >
                              <tr>
                                <td width="30" style="vertical-align: top">
                                  <div
                                    style="
                                      background-color: #dc2626;
                                      color: white;
                                      width: 24px;
                                      height: 24px;
                                      border-radius: 50%;
                                      text-align: center;
                                      line-height: 24px;
                                      font-size: 12px;
                                      font-weight: bold;
                                      font-family: Arial, Helvetica, sans-serif;
                                    "
                                  >
                                    2
                                  </div>
                                </td>
                                <td
                                  style="
                                    color: #7f1d1d;
                                    font-weight: bold;
                                    font-family: Arial, Helvetica, sans-serif;
                                  "
                                >
                                  Review your account activity
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 6px 0">
                            <table
                              role="presentation"
                              cellspacing="0"
                              cellpadding="0"
                              border="0"
                              width="100%"
                            >
                              <tr>
                                <td width="30" style="vertical-align: top">
                                  <div
                                    style="
                                      background-color: #dc2626;
                                      color: white;
                                      width: 24px;
                                      height: 24px;
                                      border-radius: 50%;
                                      text-align: center;
                                      line-height: 24px;
                                      font-size: 12px;
                                      font-weight: bold;
                                      font-family: Arial, Helvetica, sans-serif;
                                    "
                                  >
                                    3
                                  </div>
                                </td>
                                <td
                                  style="
                                    color: #7f1d1d;
                                    font-weight: bold;
                                    font-family: Arial, Helvetica, sans-serif;
                                  "
                                >
                                  Log out of all other devices
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>

                <!-- CTA Button -->
                <table
                  role="presentation"
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                  width="100%"
                  style="margin: 40px 0"
                >
                  <tr>
                    <td align="center">
                      <table
                        role="presentation"
                        cellspacing="0"
                        cellpadding="0"
                        border="0"
                      >
                        <tr>
                          <td
                            style="
                              background-color: #3b82f6;
                              border-radius: 12px;
                            "
                          >
                            <a
                              href="#"
                              style="
                                display: inline-block;
                                color: white;
                                text-decoration: none;
                                padding: 16px 32px;
                                font-weight: bold;
                                font-size: 16px;
                                font-family: Arial, Helvetica, sans-serif;
                              "
                            >
                              Secure My Account
                            </a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>

                <!-- Security Notice - Info -->
                <table
                  role="presentation"
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                  width="100%"
                  style="
                    background-color: #dbeafe;
                    border: 1px solid #3b82f6;
                    border-radius: 12px;
                  "
                >
                  <tr>
                    <td style="padding: 20px">
                      <table
                        role="presentation"
                        cellspacing="0"
                        cellpadding="0"
                        border="0"
                        width="100%"
                      >
                        <tr>
                          <td width="40" style="vertical-align: top">
                            <div style="font-size: 24px; margin-top: 2px">
                              🔒
                            </div>
                          </td>
                          <td style="vertical-align: top">
                            <div
                              style="
                                font-weight: bold;
                                color: #1d4ed8;
                                margin-bottom: 8px;
                                font-family: Arial, Helvetica, sans-serif;
                              "
                            >
                              Your security is our top priority
                            </div>
                            <div
                              style="
                                color: #1e40af;
                                font-family: Arial, Helvetica, sans-serif;
                              "
                            >
                              We continuously monitor your account for
                              suspicious activity to keep your contacts safe.
                            </div>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td
                style="
                  background-color: #f8fafc;
                  padding: 30px;
                  text-align: center;
                  border-top: 1px solid #e2e8f0;
                  border-radius: 0 0 24px 24px;
                "
              >
                <div
                  style="
                    color: #64748b;
                    font-size: 14px;
                    margin-bottom: 16px;
                    font-family: Arial, Helvetica, sans-serif;
                  "
                >
                  Need help? Contact our support team at
                  <a
                    href="mailto:support@amarcontacts.com"
                    style="
                      color: #3b82f6;
                      text-decoration: none;
                      font-weight: bold;
                    "
                    >support@workly.ink</a
                  >
                </div>

                <div
                  style="
                    margin-top: 30px;
                    font-weight: bold;
                    color: #1e293b;
                    font-family: Arial, Helvetica, sans-serif;
                  "
                >
                  Best regards,<br />
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

export default loginSuccessEmailTemplate;
