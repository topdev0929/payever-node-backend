Feature: Payment risk
  Background:
    Given I remember as "connectionId" following value:
      """
      "4ca57652-6881-4b54-9c11-ce00c79fcb45"
      """
    Given I remember as "mappedConnectionId" following value:
      """
      "c6cb3529-9984-47bf-80f2-b9c8bb19d3a3"
      """
  Scenario: Get risk session id
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
        "url": "*/api/connection/{{connectionId}}/action/get-risk-session-id",
        "body": "{}"
      },
      "response": {
        "status": 201,
        "body": {
          "orgId": "12345",
          "riskSessionId": "cb3e4f47-e09b-4613-b864-f11e56e56dc3",
          "provider": {
            "name": "tmx",
            "script": "test_script"
          }
        }
      }
    }
    """
    And I use DB fixture "connection/checkout-connection/get-risk-session-id/santander-invoice-de"
    When I send a POST request to "/api/v2/payment/risk/santander_invoice_de" with json:
    """
    {}
    """
    Then print last response
    Then the response status code should be 201
    And the response should contain json:
    """
    {
      "call": {
        "status": "success",
        "id": "*",
        "created_at": "*"
      },
      "result": {
        "risk_org_id": "12345",
        "risk_session_id": "cb3e4f47-e09b-4613-b864-f11e56e56dc3",
        "provider": {
          "name": "tmx",
          "script": "test_script"
        }
      }
    }
    """

  Scenario: Get risk session id for mapped connection
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
        "url": "*/api/connection/{{mappedConnectionId}}/action/get-risk-session-id",
        "body": "{}"
      },
      "response": {
        "status": 201,
        "body": {
          "orgId": "12345",
          "riskSessionId": "cb3e4f47-e09b-4613-b864-f11e56e56dc3",
          "provider": {
            "name": "tmx",
            "script": "test_script"
          }
        }
      }
    }
    """
    And I use DB fixture "connection/checkout-connection/get-risk-session-id/santander-invoice-de"
    And I use DB fixture "legacy-api/migration-mapping"
    When I send a POST request to "/api/v2/payment/risk/santander_invoice_de" with json:
    """
    {}
    """
    Then print last response
    Then the response status code should be 201
    And the response should contain json:
    """
    {
      "call": {
        "status": "success",
        "id": "*",
        "created_at": "*"
      },
      "result": {
        "risk_org_id": "12345",
        "risk_session_id": "cb3e4f47-e09b-4613-b864-f11e56e56dc3",
        "provider": {
          "name": "tmx",
          "script": "test_script"
        }
      }
    }
    """
