Feature: Channel Set bus messages
  Background:
    Given I use DB fixture "business-integration-subscriptions/business-integration-subscriptions"
    Given I remember as "businessId" following value:
      """
      "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
      """

  Scenario: Received channel set created method
    When I publish in RabbitMQ channel "async_events_shipping_app_micro" message with json:
      """
      {
        "name": "channels.event.channel-set.created",
        "payload": {
          "id": "0cec9b42-a2c8-4a6d-b0ce-ceb7c7c0e8c2",
          "channel": {
            "type": "test"
          },
          "business": {
            "id": "568192aa-36ea-48d8-bc0a-8660029e6f72"
          }
        }
      }
      """
    Then I process messages from RabbitMQ "async_events_shipping_app_micro" channel
    And look for model "ChannelSet" by following JSON and remember as "data":
    """
    {
      "_id": "0cec9b42-a2c8-4a6d-b0ce-ceb7c7c0e8c2"
    }
    """
    And print storage key "data"
    Then stored value "data" should contain json:
      """
      {
        "businessId": "568192aa-36ea-48d8-bc0a-8660029e6f72"
      }
      """

  Scenario: Received channel set removed
    When I publish in RabbitMQ channel "async_events_shipping_app_micro" message with json:
      """
      {
        "name": "channels.event.channel-set.deleted",
        "payload": {
          "_id": "0cec9b42-a2c8-4a6d-b0ce-ceb7c7c0e8c3"
        }
      }
      """
    Then I process messages from RabbitMQ "async_events_shipping_app_micro" channel
    Then model "ChannelSet" with id "0cec9b42-a2c8-4a6d-b0ce-ceb7c7c0e8c3" should not contain json:
      """
      {
        "_id": "0cec9b42-a2c8-4a6d-b0ce-ceb7c7c0e8c3"
      }
      """

  Scenario: Received checkout.event.channel-set-by-business.export event
    When I publish in RabbitMQ channel "async_events_shipping_app_micro" message with json:
      """
      {
        "name": "checkout.event.channel-set-by-business.export",
        "payload": {
          "id": "0cec9b42-a2c8-4a6d-b0ce-ceb7c7c0e8c6",
          "channel": {
            "type": "test"
          },
          "business": {
            "id": "568192aa-36ea-48d8-bc0a-8660029e6f72"
          }
        }
      }
      """
    Then I process messages from RabbitMQ "async_events_shipping_app_micro" channel
    And look for model "ChannelSet" by following JSON and remember as "data":
    """
    {
      "_id": "0cec9b42-a2c8-4a6d-b0ce-ceb7c7c0e8c6"
    }
    """
    And print storage key "data"
    Then stored value "data" should contain json:
      """
      {
        "businessId": "568192aa-36ea-48d8-bc0a-8660029e6f72"
      }
      """
