Feature: Third-party subscription management

  Background:
    And I authenticate as a user with the following data:
    """
    {
      "email": "email@email.com",
      "roles": [
        {
          "name": "merchant",
          "permissions": [
            {
              "businessId": "b0df679c-15eb-5aff-8c98-7751ef9e448d",
              "acls": []
            }
          ]
        }
      ]
    }
    """

  Scenario: Execute third-party action
    Given I use DB fixture "third-party/subscription"
    Given I use DB fixture "third-party/connection"
    Given I mock an axios request with parameters:
    """
    {
      "request": {
        "method": "post",
        "url": "http://shopify-backend.micro/api/auth"
      },
      "response": {
        "status": 200,
        "body": "{\"id\": \"stub-external-id\"}"
      }
    }
    """
    Given I mock an axios request with parameters:
    """
    {
      "request": {
        "method": "post",
        "url": "http://shopify-backend.micro/api/custom"
      },
      "response": {
        "status": 201,
        "body": "{\"status\": \"ok\"}"
      }
    }
    """
    And I send a POST request to "/api/business/b0df679c-15eb-5aff-8c98-7751ef9e448d/subscription/shopify/action/custom_action"
    And print last response
    Then the response status code should be 201
    And the response should contain json:
    """
    {"status": "ok"}
    """

  Scenario: Connect & Disconnect
    Given I use DB fixture "third-party/subscription"
    When I send a GET request to "/api/business/b0df679c-15eb-5aff-8c98-7751ef9e448d/subscription/shopify/connect/status"
    Then the response status code should be 200
    And the response should be equal to "false"

    And I mock an axios request with parameters:
    """
    {
      "request": {
        "method": "post",
        "url": "http://shopify-backend.micro/api/auth"
      },
      "response": {
        "status": 200,
        "body": "{\"id\": \"stub-external-id\"}"
      }
    }
    """
    When I send a POST request to "/api/business/b0df679c-15eb-5aff-8c98-7751ef9e448d/subscription/shopify/connect"
    Then print last response
    Then the response status code should be 201
    And the response should contain json:
    """
    {"id": "stub-external-id"}
    """

    When I send a GET request to "/api/business/b0df679c-15eb-5aff-8c98-7751ef9e448d/subscription/shopify/connect/status"
    Then print last response
    Then the response status code should be 200
    And the response should be equal to "true"

    When I mock an axios request with parameters:
    """
    {
      "request": {
        "method": "delete",
        "url": "http://shopify-backend.micro/api/auth/*"
      },
      "response": {
        "status": 200,
        "body": "{\"id\": \"stub-external-id\"}"
      }
    }
    """
    And I send a DELETE request to "/api/business/b0df679c-15eb-5aff-8c98-7751ef9e448d/subscription/shopify/disconnect"
    Then print last response
    Then the response status code should be 200

    When I send a GET request to "/api/business/b0df679c-15eb-5aff-8c98-7751ef9e448d/subscription/shopify/connect/status"
    Then the response status code should be 200
    And the response should be equal to "false"

  Scenario: Get subscriptions by category
    Given I use DB fixture "third-party/subscription"
    When I send a GET request to "/api/business/b0df679c-15eb-5aff-8c98-7751ef9e448d/subscription/category/shopsystems"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
    """
    []
    """
    And I mock an axios request with parameters:
    """
    {
      "request": {
        "method": "post",
        "url": "http://shopify-backend.micro/api/auth"
      },
      "response": {
        "status": 200,
        "body": "{\"id\": \"stub-external-id\"}"
      }
    }
    """
    When I send a POST request to "/api/business/b0df679c-15eb-5aff-8c98-7751ef9e448d/subscription/shopify/connect"
    And print last response
    Then the response status code should be 201
    And the response should contain json:
    """
    {"id": "stub-external-id"}
    """
    When I send a GET request to "/api/business/b0df679c-15eb-5aff-8c98-7751ef9e448d/subscription/category/shopsystems"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
    """
    [
      {
        "connected": true,
        "authorizationId": "stub-external-id",
        "integration": {
          "name": "shopify",
          "category": "shopsystems"
        }
      }
    ]
    """
