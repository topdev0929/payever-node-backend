Feature: Sending email notification about success products import
  Background:
    Given I use DB fixture "mail-server-config"

  Scenario: Send success products import notification
    Given I use DB fixture "mail-templates"
    And I use DB fixture "businesses"
    When I publish in RabbitMQ channel "async_events_mailer_micro" message with json:
      """
      {
        "name": "payever.event.business.email",
        "payload": {
          "templateName": "products-import-successful",
          "businessId": "614cb154-0323-4df0-be89-85376b9de666"
        }
      }
      """

    Then I process messages from RabbitMQ "async_events_mailer_micro" channel
    And print sent mails list
    And a mail with the following data should be sent:
    """
    {
      "subject": "Payever: Products import - Successful"
    }
    """
