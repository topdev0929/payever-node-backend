@widget-payment-rates
Feature: Widgets payment
  Background:
    Given I remember as "businessId" following value:
      """
        "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
      """
    And I remember as "anotherBusinessId" following value:
      """
        "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
      """
    Given I remember as "checkoutId" following value:
      """
        "2d873385-5c32-479c-a830-26de40bd4fd1"
      """
    Given I remember as "connectionId" following value:
      """
        "167f90e4-00c8-4301-87fe-d75a81bf1165"
      """
    Given I remember as "widgetId" following value:
      """
        "cccccccc-cccc-cccc-cccc-cccccccccccc"
      """
    And I use DB fixture "channel"
    And I use DB fixture "widgets"

  Scenario: Get rates with santander DE factoring
    Given I mock an axios request with parameters:
    """
    {
      "request": {
        "method": "post",
        "url": "https://payments-third-party.test.devpayever.com/api/business/{{businessId}}/connection/{{connectionId}}/action/calculate-rates",
        "body": "{\"widgetId\":\"cccccccc-cccc-cccc-cccc-cccccccccccc\",\"amount\":\"1000\",\"paymentOption\":\"santander_factoring_de\",\"code\":\"test\",\"interestRate\":1.99,\"widgetType\":\"dropdown_calculator\",\"connectionId\":\"167f90e4-00c8-4301-87fe-d75a81bf1165\",\"reference\":\"\",\"widgetPlaced\":\"\"}",
        "headers": {
          "Accept": "application/json, text/plain, */*",
          "Content-Type": "application/json;charset=utf-8"
        }
      },
      "response": {
        "status": 200,
        "body": "[{\"duration\":12,\"amount\":500,\"totalInterest\":12,\"total\":512,\"annualPercentageRate\":3,\"nominalInterestRate\":1.5,\"monthlyRate\":55,\"lastRate\":60},{\"duration\":24,\"amount\":500,\"totalInterest\":24,\"total\":524,\"annualPercentageRate\":3,\"nominalInterestRate\":1.5,\"monthlyRate\":35,\"lastRate\":40}]"
      }
    }
    """
    When I send a POST request to "/api/business/{{businessId}}/rates" with json:
    """
    {
      "widgetId": "{{widgetId}}",
      "amount": "1000",
      "paymentOption": "santander_factoring_de",
      "code": "test",
      "interestRate": 1.99
    }
    """
    Then print last response
    And the response should contain json:
    """
      {
        "messages": {},
        "credit": [
          {
            "duration": 12,
            "amount": 500,
            "totalInterest": 12,
            "total": 512,
            "annualPercentageRate": 3,
            "nominalInterestRate": 1.5,
            "monthlyRate": 55,
            "lastRate": 60
          },
          {
            "duration": 24,
            "amount": 500,
            "totalInterest": 24,
            "total": 524,
            "annualPercentageRate": 3,
            "nominalInterestRate": 1.5,
            "monthlyRate": 35,
            "lastRate": 40
          }
        ]
      }
    """

  Scenario: Get rates with non-existent payment option
    When I send a POST request to "/api/business/{{businessId}}/rates" with json:
    """
    {
      "widgetId": "{{widgetId}}",
      "amount": "1000",
      "paymentOption": "some_payment_option",
      "connectionId": "167f90e4-00c8-4301-87fe-d75a81bf1165",
      "code": "test"
    }
    """
    And the response status code should be 400

  Scenario: Get rates with bad credentials santander DE factoring
    Given I mock an axios request with parameters:
    """
    {
      "request": {
        "method": "post",
        "url": "https://payments-third-party.test.devpayever.com/api/business/{{businessId}}/connection/{{connectionId}}/action/rates",
        "body": "*",
        "headers": {
          "Accept": "application/json, text/plain, */*",
          "Content-Type": "application/json;charset=utf-8"
        }
      },
      "response": {
        "status": 412,
        "body": "invalid sender id"
      }
    }
    """
    When I send a POST request to "/api/business/{{businessId}}/rates" with json:
    """
    {
      "widgetId": "{{widgetId}}",
      "amount": "1000",
      "paymentOption": "santander_factoring_de",
      "code": "test"
    }
    """
    Then print last response
    And the response status code should be 412
