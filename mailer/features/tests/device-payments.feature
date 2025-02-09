Feature: Payment mails
  Background:
    Given I use DB fixture "mail-server-config"

  Scenario: Send an invoice mail
    Given I use DB fixture "mail-templates"
    And I use DB fixture "businesses"
    And I use DB fixture "users"

    When I publish in RabbitMQ channel "async_events_mailer_micro" message with json:
      """
      {
        "name": "payever.event.business.email",
        "payload": {
          "businessId": "614cb154-0323-4df0-be89-85376b9de666",
          "subject": "Your payment link from Test Business",
          "templateName": "device_payments.payment_fullfil_link",
          "to": "test@test.de",
          "variables": {
            "link": "https://link.to/payment"
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
      "subject": "Your payment link from Test Business"
    }
    """
