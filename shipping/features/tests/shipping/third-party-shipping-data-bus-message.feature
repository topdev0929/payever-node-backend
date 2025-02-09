  Feature: Business shipping boxes
  Background:
    Given I remember as "businessId" following value:
      """
      "568192aa-36ea-48d8-bc0a-8660029e6f72"
      """
    Given I remember as "integrationId" following value:
      """
      "36bf8981-8827-4c0c-a645-02d9fc6d72c8"
      """
    Given I remember as "boxId" following value:
      """
      "f561829c-a9a2-4eb8-b3fe-9d18a7c4a622"
      """
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

    Given I mock Elasticsearch method "singleIndex" with:
      """
      {
        "arguments": [
          "shipping-box-folder",
          { }
         ],
        "result": {}
      }
      """
    Given I mock Elasticsearch method "deleteByQuery" with:
      """
      {
        "arguments": [
          "shipping-box-folder",
          { }
         ],
        "result": {}
      }
      """
    Given I mock Elasticsearch method "search" with:
      """
      {
        "arguments": [
          "shipping-box-folder",
          { }
         ],
        "result": {}
      }
      """

  Scenario: Get business shipping box
    Given I use DB fixture "shipping/shipping"
    When I publish in RabbitMQ channel "async_events_shipping_app_micro" message with json:
      """
      {
        "name": "third-party.event.shipping-data.sync",
        "payload": {
          "business": {
            "id": "{{businessId}}"
          },
          "integration": {
            "id": "{{integrationId}}",
            "name": "custom"
          },
          "flatAmount": 500,
          "handlingFeepercentage": 25,
          "shippingBoxes": [{
            "isDefault": true,
            "dimensionUnit": "m",
            "weightUnit": "g"
          }]
        }
      }
      """
    And process messages from RabbitMQ "async_events_shipping_app_micro" channel
    When I send a GET request to "/api/business/{{businessId}}/shipping-box/carrier-boxes"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
        [{
          "integration": {
            "_id": "36bf8981-8827-4c0c-a645-02d9fc6d72c8",
            "name": "custom",
            "displayOptions": {
              "_id": "*"
            }
          },
          "boxes": [
            {
              "isDefault": true,
              "_id": "*",
              "dimensionUnit": "m",
              "weightUnit": "g",
              "integration": "36bf8981-8827-4c0c-a645-02d9fc6d72c8"
            }
          ]
        }]
      """
