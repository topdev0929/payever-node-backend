Feature: Apps
  Background:
    Given I remember as "businessId" following value:
      """
      "347e1cae-24f4-476f-bd1e-2b4c307949b9"
      """
    Given I remember as "appId1" following value:
      """
      "a5ab9193-e02b-4aed-b75e-f9f3a5ced081"
      """
    Given I authenticate as a user with the following data:
      """
      {
        "id": "08a3fac8-43ef-4998-99aa-cabc97a39261",
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
    Given I use DB fixture "apps"

  Scenario: Setup event subscription
    When I send a PATCH request to "/api/business/{{businessId}}/apps/{{appId1}}/subscription" with json:
      """
      {
        "events": [
          "contact.created",
          "contact.updated",
          "contact.deleted",
          "product.created",
          "product.updated",
          "product.deleted"
        ]
      }
      """
    And print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      {
        "_id": "*",
        "appId": "{{appId1}}",
        "businessId": "{{businessId}}",
        "events": [
          "product.created",
          "product.updated",
          "product.deleted"
        ]
      }
      """
    And print RabbitMQ exchange "async_events" message list
    And the RabbitMQ exchange "async_events" should contain following ordered messages:
      """
      [
        {
          "name": "apps.event.event-subscription.updated",
          "payload": {
            "_id": "*",
            "app": {
              "_id": "{{appId1}}"
            },
            "business": {
              "_id": "{{businessId}}"
            },
            "events": [
              "product.created",
              "product.updated",
              "product.deleted"
            ]
          }
        }
      ]
      """
