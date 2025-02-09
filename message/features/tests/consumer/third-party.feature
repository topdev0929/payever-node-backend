Feature: Connect consumption
  Scenario: Consume connect app installed
    Given I use DB fixture "business"
    Given I use DB fixture "integrations"
    Given I publish in RabbitMQ channel "async_events_message_micro" message with json:
      """
      {
        "name": "connect.event.third-party.enabled",
        "payload": {
          "businessId": "_id-of-existing-business",
          "category": "communications",
          "name": "whatsapp"
        }
      }
      """
    Then I process messages from RabbitMQ "async_events_message_micro" channel
    And print RabbitMQ exchange "async_events" message list
    When I look for model "Subscription" by following JSON and remember as "subscription1":
      """
      {
        "business": "_id-of-existing-business",
        "integration": "f9fd2225-eb67-4981-8674-c4f46bc18fcc"
      }
      """
    Then print storage key "subscription1"
    Then stored value "subscription1" should contain json:
    """
    {
      "enabled": true,
      "installed": true
    }
    """
    Given I publish in RabbitMQ channel "async_events_message_micro" message with json:
      """
      {
        "name": "connect.event.third-party.disabled",
        "payload": {
          "businessId": "_id-of-existing-business",
          "category": "communications",
          "name": "whatsapp"
        }
      }
      """
    Then I process messages from RabbitMQ "async_events_message_micro" channel
    And print RabbitMQ exchange "async_events" message list
    When I look for model "Subscription" by following JSON and remember as "subscription2":
      """
      {
        "business": "_id-of-existing-business",
        "integration": "f9fd2225-eb67-4981-8674-c4f46bc18fcc"
      }
      """
    Then print storage key "subscription2"
    Then stored value "subscription2" should contain json:
    """
    {
      "enabled": false,
      "installed": false
    }
    """