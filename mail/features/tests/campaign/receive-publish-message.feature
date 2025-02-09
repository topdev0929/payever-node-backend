Feature: Create mails
  Background:
    Given I remember as "businessId" following value:
      """
      "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
      """
    And I remember as "anotherBusinessId" following value:
      """
      "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
      """
    And I remember as "foreignBusinessId" following value:
      """
      "aaaaaaaa-aaaa-aaaa-bbbb-aaaaaaaaaaaa"
      """
    And I authenticate as a user with the following data:
    """
    {
      "email": "email@test.com",
      "roles": [{
        "name": "merchant",
        "permissions": [{"businessId": "{{businessId}}", "acls": []}, {"businessId": "{{anotherBusinessId}}", "acls": []}]
      }]
    }
    """

  Scenario: receive client publish message then check theme
    When I publish in RabbitMQ channel "async_events_marketing_micro" message with json:
    """
      {
        "name": "client-mail.event.theme.published",
        "payload": {
          "builderThemeId": "builderThemeId"
        }
      }
    """
    Then I process messages from RabbitMQ "async_events_marketing_micro" channel

  Scenario: receive publish message then check theme
    When I publish in RabbitMQ channel "async_events_marketing_micro" message with json:
    """
      {
        "name": "mail.event.process.schedule.theme",
        "payload": {
          "themeId": "builderThemeId"
        }
      }
    """
    Then I process messages from RabbitMQ "async_events_marketing_micro" channel
