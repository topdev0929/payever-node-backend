Feature: Studio mail feature
  Background:
    Given I use DB fixture "mail-server-config"

  Scenario: Send a staff invitation mail
    Given I use DB fixture "mail-templates"
    And I use DB fixture "businesses"
    And I use DB fixture "users"

    When I publish in RabbitMQ channel "async_events_mailer_micro" message with json:
      """
      {
        "name": "payever.event.business.email",
        "payload": {
          "businessId": "614cb154-0323-4df0-be89-85376b9de666",
          "subject": "Your video has been generated.",
          "templateName": "generated_video_finished_automated_email",
          "variables": {
            "studioUrl": "https://commerceos.devpayever.com/business/614cb154-0323-4df0-be89-85376b9de666/studio",
            "businessId": "614cb154-0323-4df0-be89-85376b9de666",
            "video": "http://test.com/test.jpg"
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
      "subject": "Your video has been generated."
    }
    """
