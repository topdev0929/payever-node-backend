Feature: Admin integration subscription
  Background: constants
    Given I remember as "businessId" following value:
      """
        "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
      """    
    Given I remember as "integrationSubscriptionId" following value:
      """
        "11111111-1111-1111-1111-111111111111"
      """  
    Given I remember as "anotherIntegrationSubscriptionId" following value:
      """
        "22222222-2222-2222-2222-222222222222"
      """        
    Given I authenticate as a user with the following data:

      """
      {
        "id": "b5965f9d-5971-4b02-90eb-537a0a6e07c7",
        "email": "test@payever.de",
        "roles": [
          {
            "name": "admin"
          }
        ]
      }
      """
    
  Scenario: Create new integration subscriptioin    
    When I send a POST request to "/api/admin/integration-subscriptions" with json:
      """
      {
        "payload": {
          "payloadData": true
        },
        "scopes": [
          "C1",
          "C2"
        ],
        "installed": true,
        "integration": "4d5ea0fb-2991-4495-9d38-d58f1961c8ef",
        "businessId": "{{businessId}}"
      }
      """
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "payload": {
          "payloadData": true
        },
        "scopes": [
          "C1",
          "C2"
        ],
        "installed": true,
        "integration": "4d5ea0fb-2991-4495-9d38-d58f1961c8ef",
        "businessId": "{{businessId}}"
      }
      """
    And store a response as "response"
    And model "IntegrationSubscription" with id "{{response._id}}" should contain json:
      """
      {
        "payload": {
          "payloadData": true
        },
        "scopes": [
          "C1",
          "C2"
        ],
        "installed": true,
        "integration": "4d5ea0fb-2991-4495-9d38-d58f1961c8ef",
        "businessId": "{{businessId}}"
      }
      """

  Scenario: Update integration subscription
    Given I use DB fixture "integrations/integration-subscription-create"
    When I send a PATCH request to "/api/admin/integration-subscriptions/{{integrationSubscriptionId}}" with json:
      """
      {
        "payload": {
          "payloadData": "NO"
        },
        "scopes": [
          "A",
          "B"
        ],
        "installed": false,
        "integration": "4d5ea0fb-2991-4495-9d38-d58f1961c8ef",
        "businessId": "{{businessId}}"
      }
      """
    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
      {
        "payload": {
          "payloadData": "NO"
        },
        "scopes": [
          "A",
          "B"
        ],
        "installed": false,
        "integration": "4d5ea0fb-2991-4495-9d38-d58f1961c8ef",
        "businessId": "{{businessId}}"
      }
    """
    And store a response as "response"
    And model "IntegrationSubscription" with id "{{integrationSubscriptionId}}" should contain json:
      """
      {
        "payload": {
          "payloadData": "NO"
        },
        "scopes": [
          "A",
          "B"
        ],
        "installed": false,
        "integration": "4d5ea0fb-2991-4495-9d38-d58f1961c8ef",
        "businessId": "{{businessId}}"
      }
      """

  Scenario: get integration subscription by id 
    Given I use DB fixture "integrations/integration-subscription-create"
    When I send a GET request to "/api/admin/integration-subscriptions/{{integrationSubscriptionId}}"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
    """
      {
        "_id": "{{integrationSubscriptionId}}"        
      }
    """

  Scenario: get integratin subscriptions list
    Given I use DB fixture "integrations/integration-subscription-create"
    When I send a GET request to "/api/admin/integration-subscriptions?businessIds={{businessId}}&limit=1"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "documents": [
          {
            "_id": "*",
            "businessId": "{{businessId}}"
          }
        ]
      }
      """

  Scenario: delete integration subscription
    Given I use DB fixture "integrations/integration-subscription-create"
    When I send a DELETE request to "/api/admin/integration-subscriptions/{{integrationSubscriptionId}}"
    Then print last response
    And the response status code should be 200
    And model "IntegrationSubscription" with id "{{integrationSubscriptionId}}" should not contain json:
      """
      {
        "business": "{{businessId}}"
      }
      """
