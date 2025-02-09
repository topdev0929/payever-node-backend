Feature: ChannelSetBusMessageController messages check

  Scenario: Channel-set created
    Given I use DB fixture "rabbit-mq/channel-set-bus-message/created"
    Given I remember as "type" following value:
      """
      "test"
      """
    Given I remember as "id" following value:
      """
      "channelId"
      """
    Given I remember as "businessId" following value:
      """
      "businessAndChannelDefaultId"
      """

    When I publish in RabbitMQ channel "async_events_checkout_app_micro" message with json:
    """
    {
      "name": "channels.event.channel-set.created",
      "payload":{
        "id":"{{id}}",
        "channel":{
          "type":"{{type}}"
          },
        "business":{
          "id":"{{businessId}}"
          }
      }
    }
    """

    Then I process messages from RabbitMQ "async_events_checkout_app_micro" channel

    Then model "ChannelSet" with id "{{id}}" should contain json:
    """
    {
        "type":"{{type}}"
    }
    """

  Scenario: Channel-set named
    Given I use DB fixture "rabbit-mq/channel-set-bus-message/named"
    Given I remember as "id" following value:
      """
      "businessAndChannelDefaultId"
      """
    Given I remember as "name" following value:
      """
      "channelTestName"
      """

    When I publish in RabbitMQ channel "async_events_checkout_app_micro" message with json:
    """
    {
      "name": "channels.event.channel-set.named",
      "payload":{
        "id":"{{id}}",
        "name":"{{name}}"
      }
    }
    """

    Then I process messages from RabbitMQ "async_events_checkout_app_micro" channel

    Then model "ChannelSet" with id "{{id}}" should contain json:
    """
    {
        "name":"{{name}}"
    }
    """

  Scenario: Channel-set deleted
    Given I use DB fixture "rabbit-mq/channel-set-bus-message/deleted"
    Given I remember as "id" following value:
      """
      "businessAndChannelDefaultId"
      """

    When I publish in RabbitMQ channel "async_events_checkout_app_micro" message with json:
    """
    {
      "name": "channels.event.channel-set.deleted",
      "payload":{
        "_id":"{{id}}"
      }
    }
    """

    Then I process messages from RabbitMQ "async_events_checkout_app_micro" channel

    Then model "ChannelSet" found by following JSON should not exist:
    """
      {
        "_id": "{{id}}"
      }
    """

  Scenario: Channel-set created by default
    Given I use DB fixture "rabbit-mq/channel-set-bus-message/created-by-default"
    Given I remember as "id" following value:
      """
      "newChannelSetId"
      """
    Given I remember as "checkoutId" following value:
      """
      "checkoutTestId"
      """

    When I publish in RabbitMQ channel "async_events_checkout_app_micro" message with json:
    """
    {
      "name": "channels.event.channel-set.created-by-default",
      "payload":{
        "id":"{{id}}",
        "checkout":"{{checkoutId}}"
      }
    }
    """

    Then I process messages from RabbitMQ "async_events_checkout_app_micro" channel

    Then I look for model "ChannelSet" with id "{{id}}" and remember as "example_object"
    Then print storage key "example_object"

    Then model "ChannelSet" with id "{{id}}" should contain json:
    """
    {
        "checkout":"{{checkoutId}}"
    }
    """

  Scenario: Channel-set activate
    Given I use DB fixture "rabbit-mq/channel-set-bus-message/activated"
    Given I remember as "id" following value:
      """
      "businessAndChannelDefaultId"
      """
    Given I remember as "businessId" following value:
      """
      "businessAndChannelDefaultId"
      """

    When I publish in RabbitMQ channel "async_events_checkout_app_micro" message with json:
    """
    {
      "name": "channels.event.channel-set.activated",
      "payload":{
        "id":"{{id}}",
        "business": {
          "id":"{{businessId}}"
        }
      }
    }
    """

    Then I process messages from RabbitMQ "async_events_checkout_app_micro" channel

    Then I look for model "ChannelSet" with id "{{id}}" and remember as "example_object"
    Then print storage key "example_object"

    Then model "ChannelSet" with id "{{id}}" should contain json:
    """
    {
        "active":true
    }
    """
