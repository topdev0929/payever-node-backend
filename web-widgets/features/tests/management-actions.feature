@manageactions
Feature: Management actions tests
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
    And I remember as "anotheBusinessId" following value:
    """
      "kkkkkkkk-kkkk-kkkk-kkkk-kkkkkkkkkkkk"
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

  Scenario: Create new widget, action "widget-create"
    Given I mock an axios request with parameters:
    """
    {
      "request": {
        "method": "post",
        "url": "https://finance-express-backend.test.devpayever.com/api/*",
        "body": "*",
        "headers": {
          "Accept": "application/json, text/plain, */*",
          "Content-Type": "application/json;charset=utf-8"
        },
        "params": {}
      },
      "response": {
        "status": 200,
        "body": "{\"amountLimits\":{\"min\":10,\"max\":2000},\"business\":\"{{businessId}}\",\"channelSet\":{\"channel\":{\"type\":\"finance-express\"},\"_id\":\"*\"},\"checkoutId\":\"{{checkoutId}}\",\"checkoutMode\":\"calculator\",\"checkoutPlacement\":\"rightSidebar\",\"isVisible\":true,\"maxWidth\":1000,\"payments\":[{\"paymentMethod\":\"santander_factoring_de\",\"amountLimits\":{\"min\":10,\"max\":750},\"enabled\":true,\"isBNPL\":false},{\"paymentMethod\":\"santander_installment\",\"amountLimits\":{\"min\":750,\"max\":2000},\"enabled\":true,\"isBNPL\":true}],\"ratesOrder\":\"asc\",\"styles\":{\"color\":\"green\",\"anotherStyle\":\"someValue\"},\"type\":\"dropdownCalculator\",\"_id\":\"*\"}"
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
    When I send a POST request to "/api/app/{{integrationCode}}/business/{{businessId}}/action/widget-create" with json:
    """
    {
      "checkoutId": "{{checkoutId}}",
      "checkoutMode": "calculator",
      "checkoutPlacement": "rightSidebar",
      "maxWidth": 1000,
      "type": "{{widgetType}}"
    }
    """
    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
    {
      "amountLimits": {
         "min": 10,
         "max": 2000
      },
      "business": "{{businessId}}",
      "channelSet": {
       "channel": {
         "type": "finance-express"
       },
       "_id": "*"
      },
      "checkoutId": "{{checkoutId}}",
      "checkoutMode": "calculator",
      "checkoutPlacement": "rightSidebar",
      "isVisible": true,
      "maxWidth": 1000,
      "payments": [
       {
         "paymentMethod": "santander_factoring_de",
         "amountLimits": {
           "min": 10,
           "max": 750
         },
         "enabled": true,
         "isBNPL": false
       },
       {
         "paymentMethod": "santander_installment",
         "amountLimits": {
           "min": 750,
           "max": 2000
         },
         "enabled": true,
         "isBNPL": true
       }
      ],
      "ratesOrder": "asc",
      "styles": {
        "color": "green",
        "anotherStyle": "someValue"
      },
      "type": "{{widgetType}}",
      "_id": "*"
    }
    """

  Scenario: Create widget for another business should be forbidden
    When I send a POST request to "/api/app/{{integrationCode}}/business/{{anotheBusinessId}}/action/widget-create" with json:
    """
    {
      "checkoutId": "{{checkoutId}}",
      "checkoutMode": "calculator",
      "checkoutPlacement": "rightSidebar",
      "maxWidth": 1000,
      "type": "{{widgetType}}"
    }
    """
    Then print last response
    And the response status code should be 403

  Scenario: Update  widget, action "widget-update"
    Given I mock an axios request with parameters:
    """
    {
      "request": {
        "method": "put",
        "url": "https://finance-express-backend.test.devpayever.com/api/*",
        "body": "*",
        "headers": {
          "Accept": "application/json, text/plain, */*",
          "Content-Type": "application/json;charset=utf-8"
        },
        "params": {}
      },
      "response": {
        "status": 200,
        "body": "{\"amountLimits\":{\"min\":10,\"max\":2000},\"business\":\"{{businessId}}\",\"channelSet\":{\"channel\":{\"type\":\"finance-express\"},\"_id\":\"*\"},\"checkoutId\":\"{{checkoutId}}\",\"checkoutMode\":\"calculator\",\"checkoutPlacement\":\"rightSidebar\",\"isVisible\":true,\"maxWidth\":1000,\"payments\":[{\"paymentMethod\":\"santander_factoring_de\",\"amountLimits\":{\"min\":10,\"max\":750},\"enabled\":true,\"isBNPL\":false},{\"paymentMethod\":\"santander_installment\",\"amountLimits\":{\"min\":750,\"max\":2000},\"enabled\":true,\"isBNPL\":true}],\"ratesOrder\":\"asc\",\"styles\":{\"color\":\"green\",\"anotherStyle\":\"someValue\"},\"type\":\"dropdownCalculator\",\"_id\":\"*\"}"
      }
    }
    """
    When I send a POST request to "/api/app/{{integrationCode}}/business/{{businessId}}/action/widget-update" with json:
    """
    {
      "widgetId": "{{widgetId}}",
      "type": "{{widgetType}}"
    }
    """
    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
    {
      "amountLimits": {
         "min": 10,
         "max": 2000
      },
      "business": "{{businessId}}",
      "channelSet": {
       "channel": {
         "type": "finance-express"
       },
       "_id": "*"
      },
      "checkoutId": "{{checkoutId}}",
      "checkoutMode": "calculator",
      "checkoutPlacement": "rightSidebar",
      "isVisible": true,
      "maxWidth": 1000,
      "payments": [
       {
         "paymentMethod": "santander_factoring_de",
         "amountLimits": {
           "min": 10,
           "max": 750
         },
         "enabled": true,
         "isBNPL": false
       },
       {
         "paymentMethod": "santander_installment",
         "amountLimits": {
           "min": 750,
           "max": 2000
         },
         "enabled": true,
         "isBNPL": true
       }
      ],
      "ratesOrder": "asc",
      "styles": {
        "color": "green",
        "anotherStyle": "someValue"
      },
      "type": "{{widgetType}}",
      "_id": "*"
    }
    """

  Scenario: Update widget for another business should be forbidden
    When I send a POST request to "/api/app/{{integrationCode}}/business/{{anotheBusinessId}}/action/widget-update" with json:
    """
    {
      "checkoutId": "{{checkoutId}}",
      "checkoutMode": "calculator",
      "checkoutPlacement": "rightSidebar",
      "maxWidth": 1000,
      "type": "{{widgetType}}"
    }
    """
    Then print last response
    And the response status code should be 403

  Scenario: Delete widget, action "widget-delete"
    Given I mock an axios request with parameters:
    """
    {
      "request": {
        "method": "delete",
        "url": "https://finance-express-backend.test.devpayever.com/api/*",
        "body": "*",
        "headers": {
          "Accept": "application/json, text/plain, */*",
          "Content-Type": "application/json;charset=utf-8"
        },
        "params": {}
      },
      "response": {
        "status": 200,
        "body": "*"
      }
    }
    """
    When I send a POST request to "/api/app/{{integrationCode}}/business/{{businessId}}/action/widget-delete" with json:
    """
    {
      "widgetId": "{{widgetId}}"
    }
    """
    Then print last response
    And the response status code should be 200

  Scenario: Delete widget for another business should be forbidden
    When I send a POST request to "/api/app/{{integrationCode}}/business/{{anotheBusinessId}}/action/widget-delete" with json:
    """
    {
      "widgetId": "{{widgetId}}"
    }
    """
    Then print last response
    And the response status code should be 403
