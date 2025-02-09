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
    Given I use DB fixture "channel-set/channel-set-bus-message/no-channel-set"
    When I publish in RabbitMQ channel "async_events_products_micro" message with json:
      """
      {
        "name": "channels.event.channel-set.named",
        "payload": {
          "id": "{{channelSetId}}",
          "name": "{{channelSetName}}"
        }
      }
      """
    And process messages from RabbitMQ "async_events_products_micro" channel
    Then model "ChannelSet" with id "{{channelSetId}}" should contain json:
      """
      {
        "_id": "{{channelSetId}}",
        "name": "{{channelSetName}}"
      }
      """

  Scenario: Update existing
    Given I use DB fixture "channel-set/channel-set-bus-message/existing-channel-set-one"
    When I publish in RabbitMQ channel "async_events_products_micro" message with json:
      """
      {
        "name": "channels.event.channel-set.named",
        "payload": {
          "id": "{{channelSetId}}",
          "name": "{{channelSetName}}"
        }
      }
      """
    And process messages from RabbitMQ "async_events_products_micro" channel
    Then model "ChannelSet" with id "{{channelSetId}}" should contain json:
      """
      {
        "_id": "{{channelSetId}}",
        "type": "link",
        "name": "{{channelSetName}}"
      }
      """
