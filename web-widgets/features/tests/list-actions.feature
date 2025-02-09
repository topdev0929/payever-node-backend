@list-actions
Feature: List actions tests
  Background:
    And I use DB fixture "integration"
    And I remember as "integrationCode" following value:
    """
      "finance-express"
    """
    And I remember as "businessId" following value:
    """
      "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
    """
    And I remember as "checkoutId" following value:
    """
      "eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee"
    """
    And I remember as "integrationId" following value:
    """
      "97f51a0d-9e17-4a27-9571-53b2baf6ac18"
    """
    And I remember as "widgetId" following value:
    """
      "b33be69a-0bbd-4449-819b-9355df3baca9"
    """
    And I remember as "widgetType" following value:
    """
      "dropdownCalculator"
    """
  Scenario: Get widgets list with action "get-widgets"
    Given I mock an axios request with parameters:
    """
    {
      "request": {
        "method": "get",
        "url": "https://finance-express-backend.test.devpayever.com/api/*",
        "body": "*",
        "headers": {
          "Accept": "application/json, text/plain, */*",
          "Content-Type": "application/json;charset=utf-8"
        },
        "params": {
          "checkoutId": "{{checkoutId}}"
        }
      },
      "response": {
        "status": 200,
        "body": "[{\"id\": \"{{widgetId}}\"}]"
      }
    }
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
    When I send a POST request to "/api/app/{{integrationCode}}/business/{{businessId}}/action/get-widgets" with json:
    """
    {
      "checkoutId": "{{checkoutId}}"
    }
    """
    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
    [
      {
        "id": "{{widgetId}}"
      }
    ]
    """

  Scenario: Get widgets list with action "get-widgets-by-id"
    Given I mock an axios request with parameters:
    """
    {
      "request": {
        "method": "get",
        "url": "https://finance-express-backend.test.devpayever.com/api/*",
        "body": "*",
        "headers": {
          "Accept": "application/json, text/plain, */*",
          "Content-Type": "application/json;charset=utf-8"
        },
        "params": {
          "checkoutId": "{{checkoutId}}",
          "widgetId": "{{widgetId}}"
        }
      },
      "response": {
        "status": 200,
        "body": "[{\"id\": \"{{widgetId}}\"}]"
      }
    }
    """
    When I send a POST request to "/api/app/{{integrationCode}}/business/{{businessId}}/action/get-widgets-by-id" with json:
    """
    {
      "checkoutId": "{{checkoutId}}",
      "widgetId": "{{widgetId}}"
    }
    """
    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
    [
      {
        "id": "{{widgetId}}"
      }
    ]
    """

  Scenario: Get widgets list with action "get-widgets-by-type"
    Given I mock an axios request with parameters:
    """
    {
      "request": {
        "method": "get",
        "url": "https://finance-express-backend.test.devpayever.com/api/*",
        "body": "*",
        "headers": {
          "Accept": "application/json, text/plain, */*",
          "Content-Type": "application/json;charset=utf-8"
        },
        "params": {
          "checkoutId": "{{checkoutId}}",
          "widgetType": "{{widgetType}}"
        }
      },
      "response": {
        "status": 200,
        "body": "[{\"id\": \"{{widgetId}}\",\"type\": \"{{widgetType}}\"}]"
      }
    }
    """
    When I send a POST request to "/api/app/{{integrationCode}}/business/{{businessId}}/action/get-widgets-by-type" with json:
    """
    {
      "checkoutId": "{{checkoutId}}",
      "widgetType": "{{widgetType}}"
    }
    """
    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
    [
      {
        "id": "{{widgetId}}",
        "type": "{{widgetType}}"
      }
    ]
    """

  Scenario: Get widgets list with action "get-widgets-by-type"
    Given I mock an axios request with parameters:
    """
    {
      "request": {
        "method": "get",
        "url": "https://finance-express-backend.test.devpayever.com/api/*",
        "body": "*",
        "headers": {
          "Accept": "application/json, text/plain, */*",
          "Content-Type": "application/json;charset=utf-8"
        },
        "params": {
          "checkoutId": "{{checkoutId}}",
          "widgetType": "{{widgetType}}"
        }
      },
      "response": {
        "status": 200,
        "body": "[{\"id\": \"{{widgetId}}\",\"type\": \"{{widgetType}}\"}]"
      }
    }
    """
    When I send a POST request to "/api/app/{{integrationCode}}/business/{{businessId}}/action/get-widgets-by-type" with json:
    """
    {
      "checkoutId": "{{checkoutId}}",
      "widgetType": "{{widgetType}}"
    }
    """
    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
    [
      {
        "id": "{{widgetId}}",
        "type": "{{widgetType}}"
      }
    ]
    """

  Scenario: Get widgets list with client-action "get-widgets-by-type" not allowed
    When I send a POST request to "/api/app/{{integrationCode}}/business/{{businessId}}/client-action/get-widgets-by-type" with json:
    """
    {
      "checkoutId": "{{checkoutId}}",
      "widgetType": "{{widgetType}}"
    }
    """
    Then print last response
    And the response status code should be 404
    And the response should contain json:
    """
    {
       "statusCode": 404,
       "message": "Can't find requested client action 'get-widgets-by-type' of integration 'finance-express'",
       "error": "Not Found"
    }
    """
