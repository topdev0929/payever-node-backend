@payments-actions
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
    And I remember as "connectionId" following value:
    """
      "167f90e4-00c8-4301-87fe-d75a81bf1165"
    """
    And I remember as "widgetId" following value:
    """
      "b33be69a-0bbd-4449-819b-9355df3baca9"
    """
    And I remember as "widgetType" following value:
    """
      "dropdownCalculator"
    """

  Scenario: Calculate rates, action "calculate-rates"
    Given I mock an axios request with parameters:
    """
    {
      "request": {
        "method": "post",
        "url": "https://finance-express-backend.test.devpayever.com/api/business/{{businessId}}/calculate-rates",
        "body": "*",
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
    When I send a POST request to "/api/app/{{integrationCode}}/business/{{businessId}}/client-action/calculate-rates" with json:
    """
    {
      "amount": "1000",
      "paymentOption": "santander_installment",
      "widgetId": "{{widgetId}}",
      "connectionId": "{{connectionId}}",
      "code": "test"
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
