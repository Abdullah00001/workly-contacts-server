const accountDeletionConfirmationEmailTemplate = `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Account Deletion Confirmation</title>
    <style type="text/css">
      /* Reset & Base */
      body,
      table,
      td,
      a {
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
      }
      table,
      td {
        mso-table-lspace: 0pt;
        mso-table-rspace: 0pt;
      }
      img {
        -ms-interpolation-mode: bicubic;
        border: 0;
        height: auto;
        line-height: 100%;
        outline: none;
        text-decoration: none;
      }
      table {
        border-collapse: collapse !important;
      }
      body {
        height: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
        width: 100% !important;
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
      }

      /* Container */
      .email-wrapper {
        max-width: 600px;
        margin: 0 auto;
        background-color: #ffffff;
      }

      /* Header */
      .header {
        padding: 30px 20px;
        text-align: center;
        background-color: #ffffff;
        border-bottom: 1px solid #eeeeee;
      }
      .header img {
        max-width: 180px;
        height: auto;
      }

      /* Content */
      .content {
        padding: 40px 30px;
        color: #333333;
        font-size: 16px;
        line-height: 1.6;
      }
      .content h1 {
        font-size: 22px;
        margin: 0 0 20px;
        color: #222222;
      }
      .content p {
        margin: 0 0 16px;
      }
      .highlight {
        font-weight: bold;
        color: #d32f2f;
      }

      /* Footer */
      .footer {
        padding: 20px;
        text-align: center;
        font-size: 14px;
        color: #777777;
        background-color: #f9f9f9;
        border-top: 1px solid #eeeeee;
      }
      .footer a {
        color: #777777;
        text-decoration: underline;
      }

      /* Mobile */
      @media screen and (max-width: 600px) {
        .content {
          padding: 30px 20px;
        }
        .header {
          padding: 20px 15px;
        }
      }
    </style>
  </head>
  <body style="margin: 0; padding: 0; background-color: #f4f4f4">
    <center>
      <table
        role="presentation"
        border="0"
        cellpadding="0"
        cellspacing="0"
        width="100%"
        style="background-color: #f4f4f4"
      >
        <tr>
          <td align="center">
            <!-- Email Wrapper -->
            <table
              role="presentation"
              class="email-wrapper"
              border="0"
              cellpadding="0"
              cellspacing="0"
              width="100%"
            >
              <!-- Main Content -->
              <tr>
                <td class="content">
                  <h1>Hi {{name}},</h1>
                  <p>
                    This is a confirmation that your
                    <strong>Workly Contacts</strong> account (<span
                      class="highlight"
                      >{{email}}</span
                    >) has been <strong>permanently deleted</strong> as
                    scheduled.
                  </p>
                  <p><strong>Date of deletion:</strong> {{deleteAt}}</p>
                  <p>
                    All your data associated with this account has been
                    <strong>securely removed</strong> and this action
                    <strong>cannot be undone</strong>.
                  </p>
                  <p>Thank you for being part of Workly Contacts.</p>
                  <p>— The Workly Contacts Team</p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td class="footer">
                  <p style="margin: 0">
                    &copy; {{currentYear}} Workly Contacts. All rights reserved.
                  </p>
                  <p style="margin: 10px 0 0">
                    <a href="https://worklycontacts.com">Website</a> |
                    <a href="https://worklycontacts.com/privacy"
                      >Privacy Policy</a
                    >
                    |
                    <a href="mailto:support@worklycontacts.com"
                      >Contact Support</a
                    >
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </center>
  </body>
</html>
`;

export default accountDeletionConfirmationEmailTemplate;
