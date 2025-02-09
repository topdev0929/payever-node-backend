Feature: Api Call API
  Scenario: Get ApiCall info
    Given I remember as "businessId" following value:
      """
      "012c165f-8b88-405f-99e2-82f74339a757"
      """
    Given I remember as "apiCallId" following value:
      """
      "b5965f9d-5971-4b02-90eb-537a0a6e07c7"
      """
    Given I use DB fixture "legacy-api/api-call/get/single"
    Given I authenticate as a user with the following data:
      """
      {
        "email": "testcases@payever.de",
        "firstName": "Test",
        "lastName": "Test",
        "roles": [
          {
            "name": "oauth",
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
    When I send a GET request to "/api/{{apiCallId}}"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      {
        "id": "{{apiCallId}}",
        "business_id": "{{businessId}}",
        "channel": "magento",
        "amount": 1000,
        "fee": 0,
        "order_id": "test_order_id",
        "currency": "EUR",
        "created_at": "*"
      }
      """

  Scenario: Get ApiCall info as anonymous should not be allowed
    Given I remember as "apiCallId" following value:
      """
      "b5965f9d-5971-4b02-90eb-537a0a6e07c7"
      """
    Given I use DB fixture "legacy-api/api-call/get/single"
    And I am not authenticated
    When I send a GET request to "/api/{{apiCallId}}"
    Then print last response
    Then the response status code should be 403
    And the response should contain json:
    """
    {
      "statusCode": 403,
      "error": "Forbidden",
      "message": "app.employee-permission.insufficient.error"
    }
    """

  Scenario: Get ApiCall from another business should be forbidden
    Given I remember as "anotherBusinessId" following value:
      """
      "0064bd92-c270-49f4-9910-cfab877c1255"
      """
    Given I remember as "apiCallId" following value:
      """
      "b5965f9d-5971-4b02-90eb-537a0a6e07c7"
      """
    Given I use DB fixture "legacy-api/api-call/get/single"
    And I authenticate as a user with the following data:
      """
      {
        "email": "testcases@payever.de",
        "firstName": "Test",
        "lastName": "Test",
        "roles": [
          {
            "name": "oauth",
            "permissions": [
              {
                "acls": [],
                "businessId": "{{anotherBusinessId}}"
              }
            ]
          }
        ]
      }
      """
    When I send a GET request to "/api/{{apiCallId}}"
    Then print last response
    Then the response status code should be 403
    And the response should contain json:
      """
      {
        "statusCode": 403,
        "error": "Forbidden",
        "message": "You're not allowed to get api call"
      }
      """

  Scenario: Get not existent ApiCall should return not found error
    Given I remember as "notExistentApiCallId" following value:
      """
      "016ffd5b-d4a2-46e8-a1fe-841e4f40a130"
      """
    Given I use DB fixture "legacy-api/api-call/get/single"
    Given I authenticate as a user with the following data:
      """
      {
        "email": "testcases@payever.de",
        "firstName": "Test",
        "lastName": "Test",
        "roles": [
          {
            "name": "oauth",
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
    When I send a GET request to "/api/{{notExistentApiCallId}}"
    Then print last response
    Then the response status code should be 404
    And the response should contain json:
      """
      {
        "statusCode": 404,
        "error": "Not Found",
        "message": "ApiCall by {\"_id\":\"{{notExistentApiCallId}}\"} not found!"
      }
      """
