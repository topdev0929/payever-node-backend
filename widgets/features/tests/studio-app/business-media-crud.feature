Feature: Business media messages CRUD
  Background:
    Given I remember as "businessId" following value:
      """
        "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
      """
    Given I remember as "businessMediaId" following value:
      """
        "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
      """
    Given I remember as "oldMediaId" following value:
      """
        "00000000-0000-0000-0000-000000000000"
      """

  Scenario: Received business media created message
    When I publish in RabbitMQ channel "async_events_widgets_micro" message with json:
      """
        {
          "name": "studio.event.business-media.created",
          "payload": {
            "id": "{{businessMediaId}}",
            "business": {
              "id": "{{businessId}}"
            },
            "mediaType": "image",
            "name": "test image",
            "url": "new-image.url"
          }
        }
      """
    Then I process messages from RabbitMQ "async_events_widgets_micro" channel
    And model "BusinessMedia" with id "{{businessMediaId}}" should contain json:
      """
      {
        "businessId": "{{businessId}}",
        "mediaType": "image",
        "name": "test image",
        "url": "new-image.url"
      }
      """

  Scenario: Received business media updated message, media not exists
    When I publish in RabbitMQ channel "async_events_widgets_micro" message with json:
      """
        {
          "name": "studio.event.business-media.updated",
          "payload": {
            "id": "{{businessMediaId}}",
            "business": {
              "id": "{{businessId}}"
            },
            "mediaType": "image",
            "name": "test image",
            "url": "new-image.url"
          }
        }
      """
    Then I process messages from RabbitMQ "async_events_widgets_micro" channel
    And model "BusinessMedia" with id "{{businessMediaId}}" should contain json:
      """
      {
        "businessId": "{{businessId}}",
        "mediaType": "image",
        "name": "test image",
        "url": "new-image.url"
      }
      """

  Scenario: Received business media deleted message
    Given I use DB fixture "studio-app/remove-business-media"
    When I publish in RabbitMQ channel "async_events_widgets_micro" message with json:
      """
        {
          "name": "studio.event.business-media.deleted",
          "payload": {
            "id": "{{businessMediaId}}",
            "business": {
              "id": "{{businessId}}"
            }
          }
        }
      """
    Then I process messages from RabbitMQ "async_events_widgets_micro" channel
    And model "BusinessMedia" with id "{{businessMediaId}}" should not exist
