Feature: Payment rates
  Background:
    Given I remember as "connectionId" following value:
      """
      "4ca57652-6881-4b54-9c11-ce00c79fcb45"
      """
    Given I remember as "mappedConnectionId" following value:
      """
      "c6cb3529-9984-47bf-80f2-b9c8bb19d3a3"
      """
  Scenario: Get rates
    Given I authenticate as a user with the following data:
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
              "businessId": "a803d4c3-c447-4aab-a8c7-c7f184a8e77f"
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
        "url": "*/api/connection/{{connectionId}}/action/calculate-rates",
        "body": "{}"
      },
      "response": {
        "status": 201,
        "body": [
          {
           "amount": 500,
           "annualPercentageRate": 3,
           "duration": 12,
           "interest": 12,
           "interestRate": 1.5,
           "lastMonthPayment": 60,
           "monthlyPayment": 55,
           "totalCreditCost": 512
          },
          {
           "amount": 500,
           "annualPercentageRate": 3,
           "duration": 24,
           "interest": 24,
           "interestRate": 1.5,
           "lastMonthPayment": 40,
           "monthlyPayment": 35,
           "totalCreditCost": 524
          }
        ]
      }
    }
    """
    And I use DB fixture "connection/checkout-connection/get-rates/santander-factoring-de"
    When I send a GET request to "/api/payment/{{connectionId}}/rates?amount=500"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
    """
    {
     "call": {
       "status": "success",
       "type": "rates",
       "id": "*",
       "created_at": "*"
     },
     "result": [
       {
         "amount": 500,
         "annualPercentageRate": 3,
         "duration": 12,
         "interest": 12,
         "interestRate": 1.5,
         "lastMonthPayment": 60,
         "monthlyPayment": 55,
         "totalCreditCost": 512
       },
       {
         "amount": 500,
         "annualPercentageRate": 3,
         "duration": 24,
         "interest": 24,
         "interestRate": 1.5,
         "lastMonthPayment": 40,
         "monthlyPayment": 35,
         "totalCreditCost": 524
       }
     ]
    }
    """

  Scenario: Get rates with mapped connection
    Given I authenticate as a user with the following data:
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
              "businessId": "a803d4c3-c447-4aab-a8c7-c7f184a8e77f"
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
        "url": "*/api/connection/{{mappedConnectionId}}/action/calculate-rates",
        "body": "{}"
      },
      "response": {
        "status": 201,
        "body": [
          {
           "amount": 500,
           "annualPercentageRate": 3,
           "duration": 12,
           "interest": 12,
           "interestRate": 1.5,
           "lastMonthPayment": 60,
           "monthlyPayment": 55,
           "totalCreditCost": 512
          },
          {
           "amount": 500,
           "annualPercentageRate": 3,
           "duration": 24,
           "interest": 24,
           "interestRate": 1.5,
           "lastMonthPayment": 40,
           "monthlyPayment": 35,
           "totalCreditCost": 524
          }
        ]
      }
    }
    """
    And I use DB fixture "connection/checkout-connection/get-rates/santander-invoice-de"
    And I use DB fixture "legacy-api/migration-mapping"
    When I send a GET request to "/api/payment/{{connectionId}}/rates?amount=500"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
    """
    {
     "call": {
       "status": "success",
       "type": "rates",
       "id": "*",
       "created_at": "*"
     },
     "result": [
       {
         "amount": 500,
         "annualPercentageRate": 3,
         "duration": 12,
         "interest": 12,
         "interestRate": 1.5,
         "lastMonthPayment": 60,
         "monthlyPayment": 55,
         "totalCreditCost": 512
       },
       {
         "amount": 500,
         "annualPercentageRate": 3,
         "duration": 24,
         "interest": 24,
         "interestRate": 1.5,
         "lastMonthPayment": 40,
         "monthlyPayment": 35,
         "totalCreditCost": 524
       }
     ]
    }
    """
