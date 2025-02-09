Feature: Plugin events
  Scenario: Handle a 'channel.disabled' event
    Given I use DB fixture "businesses"
    And I use DB fixture "common-channel"

    When I publish in RabbitMQ channel "async_events_plugins_micro" message with json:
    """
    {
      "name": "connect.event.third-party.disabled",
      "payload": {
        "name": "magento",
        "businessId": "dac8cff5-dfc5-4461-b0e3-b25839527304"
      }
    }
    """

    Then I process messages from RabbitMQ "async_events_plugins_micro" channel

  Scenario: Handle onOAuthClientRemovedEvent
    Given I use DB fixture "businesses"
    And I use DB fixture "common-channel"

    When I publish in RabbitMQ channel "async_events_plugins_micro" message with json:
    """
    {
      "name": "oauth.event.oauthclient.removed",
      "payload": {
        "id": "dac8cff5-dfc5-4461-b0e3-b25839527304"
      }
    }
    """

    Then I process messages from RabbitMQ "async_events_plugins_micro" channel
    Then model "ShopSystem" with id "dac8cff5-dfc5-4461-b0e3-b25839527304" should not contain json:
      """
      {
        "_id": "dac8cff5-dfc5-4461-b0e3-b25839527304",
        "channel": "67d580f7-ebf5-40e4-9367-63b8b0e0ae36"
      }
      """
