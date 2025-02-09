Feature: Apps
  Background:
    Given I remember as "businessId" following value:
      """
      "347e1cae-24f4-476f-bd1e-2b4c307949b9"
      """
    Given I remember as "appId" following value:
      """
      "a5ab9193-e02b-4aed-b75e-f9f3a5ced081"
      """
    Given I remember as "appId2" following value:
      """
      "dbfc49cf-9b9a-4fa6-9448-62f63eab5375"
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

  Scenario: Install app
    When I send a POST request to "/api/business/{{businessId}}/apps/{{appId2}}/install"
    And print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      {
        "_id": "*",
        "appId": "{{appId2}}",
        "businessId": "{{businessId}}",
        "installed": true
      }
      """
    And print RabbitMQ exchange "async_events" message list
    And the RabbitMQ exchange "async_events" should contain following ordered messages:
      """
      [
        {
          "name": "apps.event.app-subscription.installed",
          "payload": {
            "_id": "*",
            "app": {
              "_id": "{{appId2}}"
            },
            "business": {
              "_id": "{{businessId}}"
            },
            "installed": true
          }
        }
      ]
      """

  Scenario: Uninstall app
    When I send a DELETE request to "/api/business/{{businessId}}/apps/{{appId}}/uninstall"
    And print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      {
        "appId": "{{appId}}",
        "businessId": "{{businessId}}",
        "installed": false
      }
      """
    And print RabbitMQ exchange "async_events" message list
    And the RabbitMQ exchange "async_events" should contain following ordered messages:
      """
      [
        {
          "name": "apps.event.app-subscription.uninstalled",
          "payload": {
            "_id": "*",
            "app": {
              "_id": "{{appId}}"
            },
            "business": {
              "_id": "{{businessId}}"
            },
            "installed": false
          }
        }
      ]
      """
