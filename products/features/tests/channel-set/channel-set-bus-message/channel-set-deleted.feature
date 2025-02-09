Feature: Channel set API

  Background:
    Given I remember as "businessId" following value:
      """
      "a803d4c3-c447-4aab-a8c7-c7f184a8e77f"
      """
    Given I remember as "channelSetIdLink" following value:
      """
      "a888336c-fe1f-439c-b13c-f351db6bbc2e"
      """

  Scenario: Remove one existing channel-set
    Given I use DB fixture "channel-set/channel-set-bus-message/existing-channel-set-one"
    When I publish in RabbitMQ channel "async_events_products_micro" message with json:
      """
      {
        "name": "channels.event.channel-set.deleted",
        "payload": {
          "_id": "{{channelSetIdLink}}",
          "id": "{{channelSetIdLink}}"
        }
      }
      """
    And process messages from RabbitMQ "async_events_products_micro" channel
    Then model "ChannelSet" with id "{{channelSetIdLink}}" should not exist

  Scenario: Remove one from many existing channel-sets
    Given I use DB fixture "channel-set/channel-set-bus-message/existing-channel-set-many"
    When I publish in RabbitMQ channel "async_events_products_micro" message with json:
      """
      {
        "name": "channels.event.channel-set.deleted",
        "payload": {
          "_id": "{{channelSetIdLink}}",
          "id": "{{channelSetIdLink}}"
        }
      }
      """
    And process messages from RabbitMQ "async_events_products_micro" channel
    Then model "ChannelSet" with id "{{channelSetIdLink}}" should not exist
