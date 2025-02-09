Feature: Delete widget
  Background:
    Given I remember as "businessId" following value:
      """
        "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
      """
    And I remember as "anotherBusinessId" following value:
      """
        "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
      """
    And I remember as "widgetId" following value:
      """
        "cccccccc-cccc-cccc-cccc-cccccccccccc"
      """
    And I remember as "channelSetId" following value:
      """
        "11111111-1111-1111-1111-111111111111"
      """
    And I use DB fixture "channel"
    And I authenticate as a user with the following data:
      """
      {
        "email": "email@email.com",
        "roles": [
          {
            "name": "merchant",
            "permissions": [
              {
                "businessId": "{{businessId}}",
                "acls": []
              }
            ]
          }
        ]
      }
      """

  Scenario: Delete widget
    Given I use DB fixture "businesses"
    Given I use DB fixture "widgets"
    When I send a DELETE request to "/api/business/{{businessId}}/widget/{{widgetId}}"
    Then print last response
    And the response status code should be 200
    And model "Widget" with id "{{widgetId}}" should not exist
    And print RabbitMQ message list
    And RabbitMQ exchange "async_events" should contain following ordered messages:
      """
      [
         {
           "name": "channels.event.channel-set.deleted",
           "payload": {
             "_id": "{{channelSetId}}",
             "id": "{{channelSetId}}"
           }
         }

      ]
      """

  Scenario: Delete widget of another business
    Given I use DB fixture "businesses"
    Given I use DB fixture "widgets"
    And I authenticate as a user with the following data:
      """
      {
        "email": "email@email.com",
        "roles": [
          {
            "name": "merchant",
            "permissions": [
              {
                "businessId": "{{anotherBusinessId}}",
                "acls": []
              }
            ]
          }
        ]
      }
      """
    When I send a DELETE request to "/api/business/{{anotherBusinessId}}/widget/{{widgetId}}"
    Then print last response
    And the response status code should be 403
