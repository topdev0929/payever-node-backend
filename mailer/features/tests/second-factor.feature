Feature: Payment mails
  Background:
    Given I use DB fixture "mail-server-config"

  Scenario: Send a payment mail
    Given I use DB fixture "mail-templates"
    And I use DB fixture "businesses"
#    And I use DB fixture "users"

    When I publish in RabbitMQ channel "async_events_mailer_micro" message with json:
      """
      {
        "name": "payever.event.mailer.send",
        "payload": {
          "language": "",
          "params": {
            "code": 353003,
            "user": {
              "firstName": "Max",
              "lastName": "Mustermann"
            }
          },
          "subject": "payever ID verification",
          "to": "santander@payever.de",
          "type": "second-factor"
        }
      }
      """

    Then I process messages from RabbitMQ "async_events_mailer_micro" channel
    And print sent mails list
    And a mail with the following data should be sent:
    """
    {
      "subject": "payever ID verification"
    }
    """
