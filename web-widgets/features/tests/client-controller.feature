@client-controller
Feature: Client actions
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
    And I remember as "widgetId" following value:
    """
      "b33be69a-0bbd-4449-819b-9355df3baca9"
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
        }
      },
      "response": {
        "status": 200,
        "body": "[{\"id\": \"{{widgetId}}\"}]"
      }
    }
    """
    When I send a POST request to "/api/widgets" with json:
    """
    {
      "businessId": "{{businessId}}",
      "integration": "{{integrationCode}}"
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

  Scenario: Get widgets list with action "get-widget-by-id"
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
          "widgetId": "{{widgetId}}"
        }
      },
      "response": {
        "status": 200,
        "body": "[{\"id\": \"{{widgetId}}\"}]"
      }
    }
    """
    When I send a POST request to "/api/widget/{{widgetId}}" with json:
    """
    {
      "businessId": "{{businessId}}",
      "integration": "{{integrationCode}}",
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

  Scenario: Get supported payment options
    Given I mock an axios request with parameters:
    """
    {
      "request": {
        "method": "get",
        "url": "https://finance-express-backend.test.devpayever.com/api/supported-payment-options"
      },
      "response": {
        "status": 200,
        "body": "[\"santander_installment\",\"santander_factoring_de\",\"santander_installment_dk\",\"santander_installment_no\",\"santander_installment_se\"]"
      }
    }
    """
    When I send a POST request to "/api/payment-options" with json:
    """
    {
      "businessId": "{{businessId}}",
      "integration": "{{integrationCode}}"
    }
    """
    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
    [
      "santander_installment",
      "santander_factoring_de",
      "santander_installment_dk",
      "santander_installment_no",
      "santander_installment_se"
    ]
    """

  Scenario: Calculate rates, action "rates"
    Given I mock an axios request with parameters:
    """
    {
      "request": {
        "method": "post",
        "url": "https://finance-express-backend.test.devpayever.com/api/business/{{businessId}}/rates",
        "body": "{\"businessId\":\"bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb\",\"integration\":\"finance-express\",\"amount\":\"1000\",\"paymentOption\":\"santander_factoring_de\",\"downPayment\":\"300\",\"widgetId\":\"b33be69a-0bbd-4449-819b-9355df3baca9\"}",
        "headers": {
          "Accept": "application/json, text/plain, */*",
          "Content-Type": "application/json;charset=utf-8"
        },
        "params": {}
      },
      "response": {
        "status": 200,
        "body": "{\"messages\":{\"banner_and_rate\":{\"month_rate\":\"11.9\",\"duration\":\"36 Monate\",\"pay_in\":\"Bezahle in 36Monaten\",\"deferral_change\":\"\",\"summary\":\"Eff.Jahreszins 7,21%,\"},\"link\":{\"text\":\"Jetzt ab 11.9 / Monat\",\"effective_rate\":\"Eff. Jahreszins beträgt 7,21%\"},\"button\":{\"text\":\"Jetzt für 11.9/Monat\",\"effective_rate\":\"Effektivzins\"},\"bubble\":\"Hallo! Würden Sie lieber 11.9 bezahlen?\",\"banner_and_rate_split\":[{\"banner_month_rate\":\"129.1\",\"banner_duration\":\"3 Monate\",\"banner_pay_in\":\"Bezahle in 3 Monaten\"}]},\"credit\":[{\"duration\":3,\"amount\":385,\"total_interest\":2.44,\"total\":387.44,\"annual_percentage_rate\":7.9,\"nominal_interest_rate\":3.86234,\"monthly_rate\":129.1,\"last_rate\":129.24}]}"
      }
    }
    """
    When I send a POST request to "/api/widget/{{widgetId}}/rates" with json:
    """
    {
      "businessId": "{{businessId}}",
      "integration": "{{integrationCode}}",
      "paymentOption": "santander_factoring_de",
      "amount": "1000",
      "downPayment": "300"
    }
    """
    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
    {
      "messages": {
        "banner_and_rate": {
          "month_rate": "11.9",
          "duration": "36 Monate",
          "pay_in": "Bezahle in 36Monaten",
          "deferral_change": "",
          "summary": "Eff.Jahreszins 7,21%,"
        },
        "link": {
          "text": "Jetzt ab 11.9 / Monat",
          "effective_rate": "Eff. Jahreszins beträgt 7,21%"
        },
        "button": {
          "text": "Jetzt für 11.9/Monat",
          "effective_rate": "Effektivzins"
        },
        "bubble": "Hallo! Würden Sie lieber 11.9 bezahlen?",
        "banner_and_rate_split": [
          {
            "banner_month_rate": "129.1",
            "banner_duration": "3 Monate",
            "banner_pay_in": "Bezahle in 3 Monaten"
          }
        ]
      },
      "credit": [
          {
          "duration": 3,
          "amount": 385,
          "total_interest": 2.44,
          "total": 387.44,
          "annual_percentage_rate": 7.9,
          "nominal_interest_rate": 3.86234,
          "monthly_rate": 129.1,
          "last_rate": 129.24
          }
        ]
      }
    """
