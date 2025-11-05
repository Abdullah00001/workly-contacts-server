const accountDeletionScheduleEmailTemplate = `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Account Deletion Scheduled</title>
  </head>
  <body
    style="
      margin: 0;
      padding: 0;
      font-family:
        -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue',
        Arial, sans-serif;
      background-color: #f5f5f5;
    "
  >
    <table
      width="100%"
      cellpadding="0"
      cellspacing="0"
      style="background-color: #f5f5f5"
    >
      <tr>
        <td align="center" style="padding: 40px 20px">
          <table
            width="100%"
            max-width="600"
            cellpadding="0"
            cellspacing="0"
            style="
              background-color: #ffffff;
              border-radius: 8px;
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
            "
          >
            <!-- Main Content -->
            <tr>
              <td style="padding: 32px">
                <p
                  style="
                    margin: 0 0 20px 0;
                    font-size: 15px;
                    line-height: 1.6;
                    color: #333;
                  "
                >
                  Hi {{name}},
                </p>

                <p
                  style="
                    margin: 0 0 24px 0;
                    font-size: 15px;
                    line-height: 1.6;
                    color: #333;
                  "
                >
                  We received your request to delete your Workly Contacts
                  account ({{email}}).
                </p>

                <!-- Warning Box -->
                <table
                  width="100%"
                  cellpadding="0"
                  cellspacing="0"
                  style="
                    margin: 24px 0;
                    background-color: #fff8f0;
                    border-left: 4px solid #ff6b35;
                    border-radius: 4px;
                  "
                >
                  <tr>
                    <td style="padding: 16px">
                      <p
                        style="
                          margin: 0;
                          font-size: 14px;
                          font-weight: 600;
                          color: #ff6b35;
                          margin-bottom: 8px;
                        "
                      >
                        ⚠ Important Notice
                      </p>
                      <p
                        style="
                          margin: 0;
                          font-size: 14px;
                          line-height: 1.6;
                          color: #333;
                        "
                      >
                        Your account deletion has been scheduled on
                        <strong>{{scheduleAt}}</strong>, and the account will be
                        permanently deleted on <strong>{{deleteAt}}</strong>.
                      </p>
                    </td>
                  </tr>
                </table>
                <!-- Info Section -->
                <div
                  style="
                    margin: 28px 0;
                    padding: 20px;
                    background-color: #f9f9f9;
                    border-radius: 6px;
                  "
                >
                  <p
                    style="
                      margin: 0 0 12px 0;
                      font-size: 14px;
                      line-height: 1.6;
                      color: #333;
                    "
                  >
                    <strong>What happens next?</strong>
                  </p>
                  <ul
                    style="
                      margin: 0;
                      padding-left: 20px;
                      font-size: 14px;
                      line-height: 1.8;
                      color: #666;
                    "
                  >
                    <li>
                      Until {{deleteAt}}, you can still sign in to your account
                      to cancel this deletion request if it was made by mistake.
                    </li>
                    <li>
                      After {{deleteAt}}, all your account data, including
                      contacts and activity history, will be permanently removed
                      from our system.
                    </li>
                    <li>This action cannot be undone.</li>
                  </ul>
                </div>

                <p
                  style="
                    margin: 0 0 24px 0;
                    font-size: 14px;
                    text-align: center;
                    line-height: 1.6;
                    color: #666;
                  "
                >
                  If you didn't request this deletion, please contact our
                  support team immediately.
                </p>
              </td>
            </tr>
            <!-- Footer -->
            <tr>
              <td
                style="
                  padding: 24px 32px;
                  border-top: 1px solid #e5e5e5;
                  text-align: center;
                  background-color: #fafafa;
                "
              >
                <p style="margin: 0 0 12px 0; font-size: 13px; color: #999">
                  Best regards,<br /><strong>The Workly Contacts Team</strong>
                </p>
                <p style="margin: 0; font-size: 12px; color: #bbb">
                  © 2025 Workly Contacts. All rights reserved.
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

export default accountDeletionScheduleEmailTemplate;
