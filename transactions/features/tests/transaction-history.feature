@business-transactions-history
Feature: Transaction history for business
  Background:
    Given I load constants from "features/fixtures/const.ts"
    Given I use DB fixture "transactions/transaction-history"
    Given I authenticate as a user with the following data:
      """
      {
        "id": "{{USER_1_ID}}",
        "email": "email@email.com",
        "roles": [
          {
            "name": "merchant",
            "permissions": [
              {
                "businessId": "{{BUSINESS_1_ID}}",
                "acls": []
              }
            ]
          }
        ]
      }
      """

  Scenario Outline: Get transaction history
    When I send a GET request to "/api/business/{{BUSINESS_1_ID}}/transaction/{{TRANSACTION_1_ID}}/history/<action>"
    Then print last response
    And the response status code should be 200
    Then response should contain json:
      """
      [
        {
          "amount": "<amount>",
          "action": "<action>",
          "createdAt": "*"
        }
      ]
      """
    Examples:
      | action         | amount |
      | statuschanged  | 1      |
      | refund         | 2      |
      | cancel         | 3      |
      | shipping_goods | 4      |
      | shipping_goods | 5      |
      | shipping_goods | 6      |

  Scenario: Get transaction history by filter
    When I send a GET request to "/api/business/{{BUSINESS_1_ID}}/transaction/{{TRANSACTION_1_ID}}/history/shipping_goods?limit=1"
    Then print last response
    And the response status code should be 200
    Then response should contain json:
      """
      [
        {
          "amount": "6"
        }
      ]
      """

  Scenario: Get transaction history across all transactions
    When I send a GET request to "/api/business/{{BUSINESS_1_ID}}/history/shipping_goods?limit=2&status=success"
    Then print last response
    And the response status code should be 200
    Then response should contain json:
      """
      [
        {
          "transactionId": "{{TRANSACTION_1_ID}}",
          "amount": "5",
          "status":"success"
        },
        {
          "transactionId": "{{TRANSACTION_2_ID}}",
          "amount": "260",
          "status":"success"
        }
      ]
      """
    When I send a GET request to "/api/business/{{BUSINESS_1_ID}}/history/shipping_goods?limit=2&status=failed"
    Then print last response
    And the response status code should be 200
    Then response should contain json:
      """
      [
        {
          "transactionId": "{{TRANSACTION_1_ID}}",
          "amount": "6",
          "status":"failed"
        },
        {
          "transactionId": "{{TRANSACTION_2_ID}}",
          "amount": "250",
          "status":"failed"
        }
      ]
      """

  Scenario: Get transaction history
    When I send a GET request to "/api/business/{{BUSINESS_1_ID}}/transaction/{{TRANSACTION_1_ID}}/history"
    Then print last response
    And the response status code should be 200
    Then response should contain json:
      """
      [
        {
         "action": "shipping_goods",
         "amount": 6,
         "createdAt": "2022-01-01T01:00:07.000Z",
         "items": [],
         "status": "failed"
        },
        {
         "action": "shipping_goods",
         "amount": 5,
         "createdAt": "2021-01-01T01:00:05.000Z",
         "items": [],
         "status": "success"
        },
        {
         "action": "shipping_goods",
         "amount": 4,
         "createdAt": "2021-01-01T01:00:04.000Z",
         "items": [],
         "status": "failed"
        },
        {
         "action": "cancel",
         "amount": 3,
         "createdAt": "2021-01-01T01:00:03.000Z",
         "items": []
        },
        {
         "action": "refund",
         "amount": 2,
         "createdAt": "2021-01-01T01:00:02.000Z",
         "items": []
        },
        {
         "action": "statuschanged",
         "amount": 1,
         "createdAt": "2021-01-01T01:00:01.000Z",
         "items": []
        }
      ]
      """
