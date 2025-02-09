Feature: Negative payment action
  Background:
    Given I remember as "businessId" following value:
      """
      "012c165f-8b88-405f-99e2-82f74339a757"
      """

  Scenario: Execute payment refund action as anonymous should not be allowed
    Given I use DB fixture "legacy-api/payments"
    And I am not authenticated
    When I send a POST request to "/api/payment/refund/9489614e29c6e9aa052a342b726eb0f2"
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

  Scenario: Execute payment action from user with undefined business is forbidden
    Given I use DB fixture "legacy-api/payments"
    And I authenticate as a user with the following data:
    """
    {
      "id": "2673fa45-82b9-484c-bcbe-46da250c2639",
      "email": "testcases@payever.de",
      "firstName": "Test",
      "lastName": "Test",
      "roles": [
        {
          "name": "oauth",
          "permissions": [
            {
              "acls": []
            }
          ]
        }
      ]
    }
    """
    When I send a POST request to "/api/payment/refund/9489614e29c6e9aa052a342b726eb0f2"
    Then print last response
    Then the response status code should be 403
    And the response should contain json:
    """
    {
      "statusCode": 403,
      "error": "Forbidden",
      "message": "You're not allowed to get payment with id 9489614e29c6e9aa052a342b726eb0f2"
    }
    """

  Scenario: Execute payment action from not owning business is forbidden
    Given I use DB fixture "legacy-api/payments"
    And I authenticate as a user with the following data:
    """
    {
      "id": "2673fa45-82b9-484c-bcbe-46da250c2639",
      "email": "testcases@payever.de",
      "firstName": "Test",
      "lastName": "Test",
      "roles": [
        {
          "name": "oauth",
          "permissions": [
            {
              "acls": [],
              "businessId": "012c165f-8b88-405f-99e2-82f74339a757"
            }
          ]
        }
      ]
    }
    """
    When I send a POST request to "/api/payment/refund/9489614e29c6e9aa052a342b726eb0f2"
    Then print last response
    Then the response status code should be 403
    And the response should contain json:
    """
    {
      "statusCode": 403,
      "error": "Forbidden",
      "message": "You're not allowed to get payment with id 9489614e29c6e9aa052a342b726eb0f2"
    }
    """

  Scenario: Execute not supported payment action should not be allowed
    Given I use DB fixture "legacy-api/payments"
    And I authenticate as a user with the following data:
    """
    {
      "id": "2673fa45-82b9-484c-bcbe-46da250c2639",
      "email": "testcases@payever.de",
      "firstName": "Test",
      "lastName": "Test",
      "roles": [
        {
          "name": "oauth",
          "permissions": [
            {
              "acls": [],
              "businessId": "2382ffce-5620-4f13-885d-3c069f9dd9b4"
            }
          ]
        }
      ]
    }
    """
    When I send a POST request to "/api/payment/reply/9489614e29c6e9aa052a342b726eb0f2"
    Then print last response
    Then the response status code should be 404
    And the response should contain json:
    """
    {
      "statusCode": 404,
      "error": "Not Found",
      "message": "Action reply is not supported"
    }
    """

  Scenario: Not found payment
    Given I use DB fixture "legacy-api/payments"
    And I authenticate as a user with the following data:
    """
    {
      "id": "2673fa45-82b9-484c-bcbe-46da250c2639",
      "email": "testcases@payever.de",
      "firstName": "Test",
      "lastName": "Test",
      "roles": [
        {
          "name": "oauth",
          "permissions": [
            {
              "acls": [],
              "businessId": "2382ffce-5620-4f13-885d-3c069f9dd9b4"
            }
          ]
        }
      ]
    }
    """
    When I send a POST request to "/api/payment/refund/fa344481fd7a983d408ab7c0d375a9a4"
    Then print last response
    Then the response status code should be 404
    And the response should contain json:
    """
    {
      "statusCode": 404,
      "error": "Not Found",
      "message": "Payment by {\"original_id\":\"fa344481fd7a983d408ab7c0d375a9a4\"} not found!"
    }
    """

  Scenario: Execute payment refund action with failed PSP response
    Given I use DB fixture "legacy-api/payments"
    And I authenticate as a user with the following data:
    """
    {
      "id": "2673fa45-82b9-484c-bcbe-46da250c2639",
      "email": "testcases@payever.de",
      "firstName": "Test",
      "lastName": "Test",
      "roles": [
        {
          "name": "oauth",
          "permissions": [
            {
              "acls": [],
              "businessId": "{{businessId}}"
            }
          ]
        }
      ]
    }
    """
    And I mock an axios request with parameters:
    """
    {
      "request": {
        "method": "post",
        "url": "*/api/business/{{businessId}}/3b864596-ca5b-429b-bfc1-4f9d5d87c375/legacy-api-action/refund",
        "body": "{\"fields\":{\"amount\":100}}"
      },
      "response": {
        "status": 500,
        "body": {
          "error": "Internal server error"
        }
      }
    }
    """
    When I send a POST request to "/api/payment/refund/9a8521e181fa3de1127141aa3653b622" with json:
    """
    {
      "amount": 100
    }
    """
    Then print last response
    And the response status code should be 201
    And the response should contain json:
    """
    {
      "call": {
        "status": "failed",
        "id": "*",
        "created_at": "*",
        "payment_id": "9a8521e181fa3de1127141aa3653b622",
        "business_id": "012c165f-8b88-405f-99e2-82f74339a757",
        "type": "refund",
        "amount": 100,
        "message": "Internal server error"
      },
      "error": "An api error occurred",
      "error_description": "Internal server error"
    }
    """
    Then I look for model "ActionApiCall" by following JSON and remember as "actionApiCall":
    """
    {
      "action": "refund",
      "businessId": "{{businessId}}",
      "paymentId": "9a8521e181fa3de1127141aa3653b622"
    }
    """
    And model "ActionApiCall" with id "{{actionApiCall._id}}" should contain json:
    """
    {
      "action": "refund",
      "businessId": "{{businessId}}",
      "paymentId": "9a8521e181fa3de1127141aa3653b622",
      "requestData": {
        "amount": 100
      },
      "error": "Internal server error",
      "executionTime": "*",
      "status": "failed"
    }
    """
