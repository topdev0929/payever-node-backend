Feature: Channel set API

  Background:
    Given I remember as "businessId" following value:
      """
      "a803d4c3-c447-4aab-a8c7-c7f184a8e77f"
      """
    Given I remember as "checkoutId" following value:
      """
      "9f12e7bc-ee1a-48de-b3d2-8d49b19f5054"
      """
    Given I remember as "channelSetId" following value:
      """
      "a888336c-fe1f-439c-b13c-f351db6bbc2e"
      """

  Scenario: No checkout
    Given I use DB fixture "channel-set/channel-set-bus-message/channel-set.created-by-default/no-channel-sets-no-checkout"
    When I publish in RabbitMQ channel "async_events_checkout_app_micro" message with json:
      """
      {
        "name": "channels.event.channel-set.created-by-default",
        "payload": {
          "id": "{{channelSetId}}",
          "checkout": "{{checkoutId}}"
        }
      }
      """
    And process messages from RabbitMQ "async_events_checkout_app_micro" channel
    Then model "ChannelSet" with id "{{channelSetId}}" should not exist

  Scenario: Create record with existing checkout
    Given I use DB fixture "channel-set/channel-set-bus-message/channel-set.created-by-default/no-channel-sets-existing-checkout"
    When I publish in RabbitMQ channel "async_events_checkout_app_micro" message with json:
      """
      {
        "name": "channels.event.channel-set.created-by-default",
        "payload": {
          "id": "{{channelSetId}}",
          "checkout": "{{checkoutId}}"
        }
      }
      """
    And process messages from RabbitMQ "async_events_checkout_app_micro" channel
    Then model "ChannelSet" with id "{{channelSetId}}" should contain json:
      """
      {
        "_id": "{{channelSetId}}",
        "checkout": "{{checkoutId}}"
      }
      """
    Then print RabbitMQ message list
    And the RabbitMQ exchange "async_events" should contain following messages:
      """
      [
        {
          "name":"checkout.event.checkout.channel-set-linked",
          "payload":{
            "channelSetId":"{{channelSetId}}",
            "checkoutId":"{{checkoutId}}"
          }
        }
      ]
      """

  Scenario: Update existing record with existing checkout
    Given I use DB fixture "channel-set/channel-set-bus-message/channel-set.created-by-default/existing-channel-set-link-existing-checkout"
    When I publish in RabbitMQ channel "async_events_checkout_app_micro" message with json:
      """
      {
        "name": "channels.event.channel-set.created-by-default",
        "payload": {
          "id": "{{channelSetId}}",
          "checkout": "{{checkoutId}}"
        }
      }
      """
    And process messages from RabbitMQ "async_events_checkout_app_micro" channel
    Then model "ChannelSet" with id "{{channelSetId}}" should contain json:
      """
      {
        "_id": "{{channelSetId}}",
        "type": "link",
        "checkout": "{{checkoutId}}"
      }
      """
    Then print RabbitMQ message list
    And the RabbitMQ exchange "async_events" should contain following messages:
      """
      [
        {
          "name":"checkout.event.checkout.channel-set-linked",
          "payload":{
            "channelSetId":"{{channelSetId}}",
            "checkoutId":"{{checkoutId}}"
          }
        }
      ]
      """
