Feature: Metrics endpoints
  Background:
    Given I remember as "businessId" following value:
      """
      "568192aa-36ea-48d8-bc0a-8660029e6f72"
      """
    Given I authenticate as a user with the following data:
      """
      {
        "id": "ooooo-ooo-ooo-oooooo-oo",
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

  Scenario: Get user business
    Given I use DB fixture "dashboard"
    When I send a GET request to "/api/business"
    Then print last response
    And the response should contain json:
      """
      [{
        "_id": "*",
        "name": "*",
        "currency": "EUR",
        "owner": "ooooo-ooo-ooo-oooooo-oo"
      }]
      """
    And the response status code should be 200

  Scenario: Consume business
    Given I mock Elasticsearch method "bulkIndex" with:
      """
      { "arguments": ["dashboard-folder", []], "result": [] }
      """
    When I publish in RabbitMQ channel "async_events_statistics_app_micro" message with json:
      """
      {
        "name": "users.event.business.created",
        "payload": {
          "_id": "{{businessId}}",
          "name": "Some business",
          "createdAt": "2021-06-10T11:24:14.340Z"
        }
      }
      """
    Then I process messages from RabbitMQ "async_events_statistics_app_micro" channel
    And print RabbitMQ message list
    And model "Business" with id "{{businessId}}" should contain json:
      """
      {
        "name": "Some business",
        "createdAt": "2021-06-10T11:24:14.340Z"
      }
      """
