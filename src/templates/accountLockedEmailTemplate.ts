export const accountLockedEmailTemplate = `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Amar Contacts - Account Security Alert</title>
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
                  background-color: #1a73e8;
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
                <p style="margin: 8px 0 0 0; color: #e8f0fe; font-size: 16px">
                  Security Alert
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

                <!-- Alert message -->
                <div
                  style="
                    background-color: #fef7e0;
                    border-left: 4px solid #f9ab00;
                    padding: 20px;
                    margin: 20px 0;
                    border-radius: 4px;
                  "
                >
                  <p
                    style="
                      margin: 0;
                      font-size: 16px;
                      color: #333333;
                      line-height: 1.6;
                    "
                  >
                    For your security, your Amar Contacts account has been
                    <strong style="color: #d93025">temporarily locked</strong>
                    due to suspicious activity or multiple unsuccessful login
                    attempts.
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
                        color: #d93025;
                        font-weight: bold;
                      "
                    >
                      LOCKED
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
                      Reason:
                    </td>
                    <td
                      style="
                        padding: 12px 15px;
                        border-bottom: 1px solid #f0f0f0;
                        color: #333333;
                      "
                    >
                      Multiple failed logins
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
                      Date & Time:
                    </td>
                    <td style="padding: 12px 15px; color: #333333">{{time}}</td>
                  </tr>
                </table>

                <!-- Important notice -->
                <div
                  style="
                    background-color: #fce8e6;
                    border: 1px solid #f28b82;
                    padding: 20px;
                    margin: 25px 0;
                    border-radius: 4px;
                  "
                >
                  <p
                    style="
                      margin: 0;
                      font-size: 16px;
                      color: #d93025;
                      font-weight: bold;
                      text-align: center;
                    "
                  >
                    ⚠️ Important: If no action is taken within
                    <strong>24 hours</strong>, your account will be
                    <strong>permanently deleted</strong>.
                  </p>
                </div>

                <!-- Next Steps -->
                <h3
                  style="color: #333333; font-size: 20px; margin: 30px 0 15px 0"
                >
                  Next Steps:
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
                          background-color: #1a73e8;
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
                      Click the unlock button below to secure your account
                      immediately.
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; vertical-align: top">
                      <span
                        style="
                          background-color: #1a73e8;
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
                      After unlocking, you may continue using your account as
                      usual.
                    </td>
                  </tr>
                </table>

                <!-- Action Button -->
                <div style="text-align: center; margin: 35px 0">
                  <a
                    href="{{activeLink}}"
                    style="
                      background-color: #1a73e8;
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
                    🔓 Unlock My Account Now
                  </a>
                </div>

                <!-- Additional info -->
                <div
                  style="
                    background-color: #f8f9fa;
                    padding: 20px;
                    margin: 25px 0;
                    border-radius: 4px;
                    border-left: 4px solid #34a853;
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
                    If you did <strong>not</strong> attempt these logins, please
                    unlock your account immediately to secure your data or
                    contact our support team:
                    <a
                      href="mailto:support@workly.ink"
                      style="color: #1a73e8; text-decoration: none"
                      >support@workly.ink</a
                    >.
                  </p>
                </div>

                <!-- Closing -->
                <p
                  style="margin: 30px 0 10px 0; font-size: 16px; color: #333333"
                >
                  Thank you for using Amar Contacts.
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
                  This email was sent to you because your Amar Contacts account
                  requires immediate attention.
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
