Feature: Trusted domain whitelisting controller
  Background:
    Given I remember as "businessId" following value:
      """
      "88038e2a-90f9-11e9-a492-7200004fe4c0"
      """
    Given I authenticate as a user with the following data:
      """
      {
        "email": "email@test.com",
        "firstName": "firstname",
        "lastName": "lastname",
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

  Scenario: Add domain
    When I send a POST request to "/trusted-domain/{{businessId}}" with json:
      """
      {
        "domain": "employee2@domain.com",
        "businessId": "{{businessId}}"
      }
      """
    And print last response
    Then the response status code should be 201
    And model "TrustedDomain" found by following JSON should exist:
      """
      {
        "domain": "domain.com",
        "businessId": "{{businessId}}"
      }
      """
    Then print RabbitMQ exchange "async_events" message list
    And RabbitMQ exchange "async_events" should contain following messages:
      """
      [
        {
          "name": "users.event.trusted-domain.added",
          "payload": {
            "businessId": "88038e2a-90f9-11e9-a492-7200004fe4c0",
            "domain": "domain.com"
          }
        }
      ]
      """
  Scenario: Get domains
    Given I use DB fixture "trusted-domain"
    When I send a GET request to "/trusted-domain/{{businessId}}"
    And print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      [
        {
          "_id": "*",
          "domain": "domain123.com123",
          "businessId": "{{businessId}}"
        }
      ]
      """
  Scenario: Delete domain
    Given I use DB fixture "trusted-domain"
    When I send a DELETE request to "/trusted-domain/{{businessId}}" with json:
      """
      {
        "domain": "employee123@domain123.com123"
      }
      """
    And print last response
    Then the response status code should be 200
    And model "TrustedDomain" found by following JSON should not exist:
      """
      {
        "domain": "domain123.com123",
        "businessId": "{{businessId}}"
      }
      """
    Then print RabbitMQ exchange "async_events" message list
    And RabbitMQ exchange "async_events" should contain following messages:
      """
      [
        {
          "name": "users.event.trusted-domain.deleted",
          "payload": {
            "businessId": "88038e2a-90f9-11e9-a492-7200004fe4c0",
            "domain": "domain123.com123"
          }
        }
      ]
      """