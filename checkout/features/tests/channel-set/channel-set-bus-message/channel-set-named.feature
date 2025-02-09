Feature: Channel set API

  Background:
    Given I remember as "channelSetId" following value:
      """
      "a888336c-fe1f-439c-b13c-f351db6bbc2e"
      """
    Given I remember as "channelSetName" following value:
      """
      "Shop name #1"
      """

  Scenario: Create new
    Given I use DB fixture "channel-set/channel-set-bus-message/channel-set.named/no-channel-sets"
    When I publish in RabbitMQ channel "async_events_checkout_app_micro" message with json:
      """
      {
        "name": "channels.event.channel-set.named",
        "payload": {
          "id": "{{channelSetId}}",
          "name": "{{channelSetName}}"
        }
      }
      """
    And process messages from RabbitMQ "async_events_checkout_app_micro" channel
    Then model "ChannelSet" with id "{{channelSetId}}" should contain json:
      """
      {
        "_id": "{{channelSetId}}",
        "name": "{{channelSetName}}"
      }
      """

  Scenario: Update existing
    Given I use DB fixture "channel-set/channel-set-bus-message/channel-set.created/existing-channel-set-shop"
    When I publish in RabbitMQ channel "async_events_checkout_app_micro" message with json:
      """
      {
        "name": "channels.event.channel-set.named",
        "payload": {
          "id": "{{channelSetId}}",
          "name": "{{channelSetName}}"
        }
      }
      """
    And process messages from RabbitMQ "async_events_checkout_app_micro" channel
    Then model "ChannelSet" with id "{{channelSetId}}" should contain json:
      """
      {
        "_id": "{{channelSetId}}",
        "type": "shop",
        "name": "{{channelSetName}}"
      }
      """

  Scenario: migrate existing
    Given I use DB fixture "channel-set/channel-set-bus-message/channel-set.created/existing-channel-set-shop"
    When I publish in RabbitMQ channel "async_events_checkout_app_micro" message with json:
      """
      {
        "name": "channels.event.channel-set.migrate",
        "payload": {
          "channel_set": {
            "uuid": "{{channelSetId}}",
            "original_id": "{{channelSetId}}"
          }
        }
      }
      """
    And process messages from RabbitMQ "async_events_checkout_app_micro" channel
    Then model "ChannelSet" with id "{{channelSetId}}" should contain json:
      """
      {
        "_id": "{{channelSetId}}",
        "type": "shop"
      }
      """
