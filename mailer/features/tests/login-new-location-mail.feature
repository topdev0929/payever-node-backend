Feature: User registration mails
  Background:
    Given I use DB fixture "mail-server-config"

  Scenario: Send a mail about new user registered
    Given I use DB fixture "mail-templates"
    When I publish in RabbitMQ channel "async_events_mailer_micro" message with json:
      """
      {
        "name": "payever.event.mailer.send",
        "payload": {
          "language": "en",
          "params": {
            "locale": "en",
            "login_location": {
              "browser": "Firefox",
              "date": "Friday, July 10, 2020, 10:55:46 AM",
              "ip": "127.0.0.1",
              "os": "Linux"
            },
            "user": {
              "email": "user@email.com"
            }
          },
          "subject": "New login from Firefox on Linux",
          "to": "user@email.com",
          "type": "login_new_location"
        }
      }
      """

    Then I process messages from RabbitMQ "async_events_mailer_micro" channel
    And print sent mails list
    And a mail with the following data should be sent:
    """
    {
      "from": "no-reply@payever.org",
      "subject": "New login from Firefox on Linux",
      "html": "*<p>Your email address user@email.com was just used to log into payever from a new browser and/or new device.</p><p>New login from Firefox on Linux. Date: Friday, July 10, 2020, 10:55:46 AM.</p><p>In case you don't recognize this activity, we recommend changing your password as soon as possible. If it  was indeed you who logged in, you can ignore this message.</p>*"
    }
    """
