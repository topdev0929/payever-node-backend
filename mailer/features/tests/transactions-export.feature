@transactions-export
Feature: Transactions export
  Background:
    Given I use DB fixture "mail-server-config"

  Scenario: Send transactions exporting email
    Given I use DB fixture "mail-templates"

    When I publish in RabbitMQ channel "async_events_mailer_micro" message with json:
      """
      {
        "name": "payever.event.user.email",
        "payload": {
          "locale": "en",
          "to": "delivery.email@gmail.com",
          "templateName": "transactions.exported_data_link",
          "variables": {
             "fileUrl": "https://website.com/download.link.csv"
          }
        }
      }
      """

    Then I process messages from RabbitMQ "async_events_mailer_micro" channel
    And print sent mails list
    And a mail with the following data should be sent:
    """
    {
      "from": "no-reply@payever.org",
      "subject": "Download Transactions Export",
      "html": "*<p>Dear Merchant,</p>\n<p>We have processed your transactions export request for which the file is available for download. Please click the link below to download the export immediately.</p>\n<table class=\"body-buttons-table\" style=\"margin-top: 0px; margin-bottom: 20px\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" valign=\"top\" width=\"30%\">\n  <tbody>\n  <tr align=\"left\">\n    <td align=\"center\" class=\"border-none body-button\">\n      <a class=\"body-button-bordered\" target=\"_blank\" rel=\"noopener noreferrer\" href=\"https://website.com/download.link.csv\">Download</a>\n    </td>\n  </tr>\n  </tbody>\n</table>\n<p>This download link will expire in 15 minutes.</p>\n</div>*"
    }
    """
