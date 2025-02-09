@management-fraud-rules
Feature: management fraud rules
  Background:
    Given I use DB fixture "business"
    Given I authenticate as a user with the following data:
    """
    {
      "id": "2673fa45-82b9-484c-bcbe-46da250c2639",
      "clientId": "de9d1a9f-0c4e-4ebc-ae98-bc2bace0605c",
      "email": "testcases@payever.de",
      "firstName": "Test",
      "lastName": "Test",
      "roles": [
        {
          "name": "merchant",
          "permissions": [
            {
              "acls": [],
              "businessId": "02c50fb6-3fbe-4941-81bc-f3ecceed9ced"
            }
          ]
        }
      ]
    }
    """
    Given I remember as "fraudRuleId" following value:
    """
    "a21a17d4-18b6-486f-87c4-328d62b4f728"
    """
    Given I remember as "businessId" following value:
    """
    "02c50fb6-3fbe-4941-81bc-f3ecceed9ced"
    """

  Scenario: Create fraud rule
    When I send a POST request to "/api/business/{{businessId}}/fraud/rules" with json:
    """
    {
      "name": "Address Mismatch",
      "description": "Flag if billing address does not match cardholder address",
      "conditions": [
        {
          "type": "consistency",
          "field": "address",
          "operator": "notEqual",
          "compareTo": "billingAddress"
        }
      ],
      "actions": [
        {
          "type": "adjustRiskScore",
          "value": 30
        }
      ]
    }
    """
    Then print last response
    Then the response status code should be 201
    And the response should contain json:
    """
    {
      "businessId": "02c50fb6-3fbe-4941-81bc-f3ecceed9ced",
      "name": "Address Mismatch",
      "description": "Flag if billing address does not match cardholder address",
      "actions": [
        {
          "type": "adjustRiskScore",
          "value": 30
        }
      ],
      "conditions": [
        {
          "type": "consistency",
          "operator": "notEqual",
          "field": "address",
          "compareTo": "billingAddress"
        }
      ],
      "_id": "*",
      "createdAt": "*",
      "updatedAt": "*"
    }
    """

  Scenario: Create fraud rule, business not found

    When I send a POST request to "/api/business/some-business-id/fraud/rules" with json:
    """
    {
      "name": "High Value Transaction",
      "description": "Flag transactions over 1000 USD",
      "conditions": [
        {
          "type": "amount",
          "operator": "greaterThan",
          "value": 100000
        }
      ],
      "actions": [
        {
          "type": "block"
        }
      ]
    }
    """
    Then print last response
    Then the response status code should be 403
    And the response should contain json:
    """
    {
      "statusCode": 403,
      "message": "app.employee-permission.insufficient.error",
      "error": "Forbidden"
    }
    """

  Scenario: Update fraud rule
    Given I use DB fixture "fraud-rule"
    When I send a PATCH request to "/api/business/{{businessId}}/fraud/rules/{{fraudRuleId}}" with json:
    """
    {
      "name": "High Value Transaction",
      "description": "Flag transactions over 1000 USD",
      "conditions": [
        {
          "type": "amount",
          "operator": "greaterThan",
          "value": 300000
        }
      ],
      "actions": [
        {
          "type": "block"
        }
      ]
    }
    """
    Then print last response
    And the response status code should be 202
    And the response should contain json:
    """
    {
      "_id": "{{fraudRuleId}}",
      "name": "High Value Transaction",
      "conditions": [
        {
          "type": "amount",
          "operator": "greaterThan",
          "value": 300000
        }
      ],
      "actions": [
        {
          "type": "block"
        }
      ],
      "businessId": "02c50fb6-3fbe-4941-81bc-f3ecceed9ced",
      "createdAt": "*",
      "updatedAt": "*",
      "description": "Flag transactions over 1000 USD"
    }
    """

  Scenario: Delete fraudList
    Given I use DB fixture "fraud-rule"
    When I send a DELETE request to "/api/business/{{businessId}}/fraud/rules/{{fraudRuleId}}"
    Then print last response
    And the response status code should be 202
    Then model "FraudRule" with id "{{fraudRuleId}}" should not exist


  Scenario: Get fraud rule
    Given I use DB fixture "fraud-rule"
    When I send a GET request to "/api/business/{{businessId}}/fraud/rules/{{fraudRuleId}}"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
    {
      "_id": "*",
      "name": "High Value Transaction",
      "conditions": [
        {
          "type": "amount",
          "operator": "greaterThan",
          "value": 100000
        }
      ],
      "actions": [
        {
          "type": "block"
        }
      ],
      "businessId": "02c50fb6-3fbe-4941-81bc-f3ecceed9ced",
      "createdAt": "*",
      "updatedAt": "*"
    }
    """

  Scenario: Get rule of fraud rules
    Given I use DB fixture "fraud-rule"
    When I send a GET request to "/api/business/{{businessId}}/fraud/rules"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
    {
      "page": 1,
      "pageSize": 10,
      "rules": [
        {
          "_id": "*",
          "name": "High Value Transaction",
          "conditions": [
            {
              "type": "amount",
              "operator": "greaterThan",
              "value": 100000
            }
          ],
          "actions": [
            {
              "type": "block"
            }
          ],
          "businessId": "02c50fb6-3fbe-4941-81bc-f3ecceed9ced",
          "createdAt": "*",
          "updatedAt": "*"
        },
        {
          "_id": "*",
          "name": "High Value Transaction",
          "conditions": [
            {
              "type": "velocity",
              "field": "email",
              "operator": "greaterThan",
              "value": 5,
              "timeUnit": "d"
            }
          ],
          "actions": [
            {
              "type": "review",
              "value": "manualReview"
            }
          ],
          "businessId": "02c50fb6-3fbe-4941-81bc-f3ecceed9ced",
          "createdAt": "*",
          "updatedAt": "*"
        }
      ],
      "total": 2,
      "totalPages": 1
    }
    """
