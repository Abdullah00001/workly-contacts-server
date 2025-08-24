export const accountLockedEmailTemplate = `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Amar Contacts - Account Unlocked</title>
  </head>
  <body
    style="
      margin: 0;
      padding: 0;
      font-family: Arial, Helvetica, sans-serif;
      background-color: #f5f5f5;
    "
  >
    <!-- Main container -->
    <table
      role="presentation"
      cellspacing="0"
      cellpadding="0"
      border="0"
      width="100%"
      style="background-color: #f5f5f5"
    >
      <tr>
        <td align="center" style="padding: 20px 0">
          <!-- Email wrapper -->
          <table
            role="presentation"
            cellspacing="0"
            cellpadding="0"
            border="0"
            width="600"
            style="
              max-width: 600px;
              background-color: #ffffff;
              border-radius: 8px;
              box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            "
          >
            <!-- Header -->
            <tr>
              <td
                style="
                  background-color: #34a853;
                  padding: 30px;
                  text-align: center;
                  border-radius: 8px 8px 0 0;
                "
              >
                <h1
                  style="
                    margin: 0;
                    color: #ffffff;
                    font-size: 28px;
                    font-weight: bold;
                  "
                >
                  Amar Contacts
                </h1>
                <p style="margin: 8px 0 0 0; color: #e8f5e8; font-size: 16px">
                  Account Unlocked ✓
                </p>
              </td>
            </tr>

            <!-- Main content -->
            <tr>
              <td style="padding: 40px 30px">
                <!-- Greeting -->
                <p
                  style="
                    margin: 0 0 20px 0;
                    font-size: 18px;
                    color: #333333;
                    line-height: 1.5;
                  "
                >
                  Hi <strong>{{name}}</strong>,
                </p>

                <!-- Success message -->
                <div
                  style="
                    background-color: #e8f5e8;
                    border-left: 4px solid #34a853;
                    padding: 25px;
                    margin: 20px 0;
                    border-radius: 4px;
                    text-align: center;
                  "
                >
                  <div style="font-size: 48px; margin-bottom: 15px">🎉</div>
                  <p
                    style="
                      margin: 0;
                      font-size: 18px;
                      color: #333333;
                      line-height: 1.6;
                      font-weight: bold;
                    "
                  >
                    Your Amar Contacts account has been
                    <span style="color: #34a853">successfully unlocked</span>
                    and is now active!
                  </p>
                </div>

                <!-- Account Status Table -->
                <table
                  role="presentation"
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                  width="100%"
                  style="
                    margin: 30px 0;
                    border: 1px solid #e0e0e0;
                    border-radius: 4px;
                  "
                >
                  <tr style="background-color: #f8f9fa">
                    <td
                      colspan="2"
                      style="padding: 15px; border-bottom: 1px solid #e0e0e0"
                    >
                      <h3 style="margin: 0; color: #333333; font-size: 18px">
                        Account Status
                      </h3>
                    </td>
                  </tr>
                  <tr>
                    <td
                      style="
                        padding: 12px 15px;
                        border-bottom: 1px solid #f0f0f0;
                        font-weight: bold;
                        color: #666666;
                        width: 30%;
                      "
                    >
                      Status:
                    </td>
                    <td
                      style="
                        padding: 12px 15px;
                        border-bottom: 1px solid #f0f0f0;
                        color: #34a853;
                        font-weight: bold;
                      "
                    >
                      ACTIVE
                    </td>
                  </tr>
                  <tr>
                    <td
                      style="
                        padding: 12px 15px;
                        border-bottom: 1px solid #f0f0f0;
                        font-weight: bold;
                        color: #666666;
                      "
                    >
                      Unlocked on:
                    </td>
                    <td
                      style="
                        padding: 12px 15px;
                        border-bottom: 1px solid #f0f0f0;
                        color: #333333;
                      "
                    >
                      {{time}}
                    </td>
                  </tr>
                  <tr>
                    <td
                      style="
                        padding: 12px 15px;
                        font-weight: bold;
                        color: #666666;
                      "
                    >
                      Access Level:
                    </td>
                    <td style="padding: 12px 15px; color: #333333">
                      Full Access Restored
                    </td>
                  </tr>
                </table>

                <!-- What's Next -->
                <h3
                  style="color: #333333; font-size: 20px; margin: 30px 0 15px 0"
                >
                  What's Next:
                </h3>

                <table
                  role="presentation"
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                  width="100%"
                >
                  <tr>
                    <td
                      style="padding: 10px 0; vertical-align: top; width: 30px"
                    >
                      <span
                        style="
                          background-color: #34a853;
                          color: white;
                          width: 24px;
                          height: 24px;
                          border-radius: 50%;
                          display: inline-block;
                          text-align: center;
                          line-height: 24px;
                          font-weight: bold;
                          font-size: 14px;
                        "
                        >1</span
                      >
                    </td>
                    <td
                      style="
                        padding: 10px 0 10px 10px;
                        color: #333333;
                        font-size: 16px;
                        line-height: 1.5;
                      "
                    >
                      You can now log in to your account using your regular
                      credentials.
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; vertical-align: top">
                      <span
                        style="
                          background-color: #34a853;
                          color: white;
                          width: 24px;
                          height: 24px;
                          border-radius: 50%;
                          display: inline-block;
                          text-align: center;
                          line-height: 24px;
                          font-weight: bold;
                          font-size: 14px;
                        "
                        >2</span
                      >
                    </td>
                    <td
                      style="
                        padding: 10px 0 10px 10px;
                        color: #333333;
                        font-size: 16px;
                        line-height: 1.5;
                      "
                    >
                      All your contacts and data are safe and accessible.
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; vertical-align: top">
                      <span
                        style="
                          background-color: #34a853;
                          color: white;
                          width: 24px;
                          height: 24px;
                          border-radius: 50%;
                          display: inline-block;
                          text-align: center;
                          line-height: 24px;
                          font-weight: bold;
                          font-size: 14px;
                        "
                        >3</span
                      >
                    </td>
                    <td
                      style="
                        padding: 10px 0 10px 10px;
                        color: #333333;
                        font-size: 16px;
                        line-height: 1.5;
                      "
                    >
                      Consider updating your password for enhanced security.
                    </td>
                  </tr>
                </table>

                <!-- Action Button -->
                <div style="text-align: center; margin: 35px 0">
                  <a
                    href="https://contacts.workly.ink"
                    style="
                      background-color: #34a853;
                      color: #ffffff;
                      padding: 15px 30px;
                      text-decoration: none;
                      border-radius: 4px;
                      font-weight: bold;
                      font-size: 16px;
                      display: inline-block;
                      border: none;
                    "
                  >
                    🔑 Access My Account
                  </a>
                </div>

                <!-- Security tips -->
                <div
                  style="
                    background-color: #f8f9fa;
                    padding: 20px;
                    margin: 25px 0;
                    border-radius: 4px;
                    border-left: 4px solid #1a73e8;
                  "
                >
                  <h4
                    style="margin: 0 0 10px 0; color: #333333; font-size: 16px"
                  >
                    🔒 Security Tips:
                  </h4>
                  <ul
                    style="
                      margin: 0;
                      padding-left: 20px;
                      color: #333333;
                      font-size: 14px;
                      line-height: 1.5;
                    "
                  >
                    <li style="margin-bottom: 8px">
                      Use a strong, unique password for your account
                    </li>
                    <li style="margin-bottom: 8px">
                      Log out from shared or public devices
                    </li>
                    <li style="margin-bottom: 0">
                      Contact us immediately if you notice any suspicious
                      activity
                    </li>
                  </ul>
                </div>

                <!-- Additional support -->
                <div
                  style="
                    background-color: #e3f2fd;
                    padding: 20px;
                    margin: 25px 0;
                    border-radius: 4px;
                    border-left: 4px solid #1976d2;
                  "
                >
                  <p
                    style="
                      margin: 0;
                      font-size: 14px;
                      color: #333333;
                      line-height: 1.5;
                    "
                  >
                    <strong>Need Help?</strong> If you have any questions or
                    concerns about your account security, our support team is
                    here to help:
                    <a
                      href="mailto:support@workly.ink"
                      style="color: #1976d2; text-decoration: none"
                      >support@workly.ink</a
                    >
                  </p>
                </div>

                <!-- Closing -->
                <p
                  style="margin: 30px 0 10px 0; font-size: 16px; color: #333333"
                >
                  Thank you for taking quick action to secure your account.
                  Welcome back to Amar Contacts!
                </p>
                <p
                  style="
                    margin: 0;
                    font-size: 16px;
                    color: #333333;
                    font-weight: bold;
                  "
                >
                  <strong>The Amar Contacts Team</strong>
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td
                style="
                  background-color: #f8f9fa;
                  padding: 20px 30px;
                  text-align: center;
                  border-radius: 0 0 8px 8px;
                  border-top: 1px solid #e0e0e0;
                "
              >
                <p
                  style="
                    margin: 0 0 10px 0;
                    font-size: 12px;
                    color: #666666;
                    line-height: 1.4;
                  "
                >
                  This confirmation email was sent because your Amar Contacts
                  account was recently unlocked.
                </p>
                <p style="margin: 0; font-size: 12px; color: #666666">
                  © 2025 Amar Contacts. All rights reserved.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;
