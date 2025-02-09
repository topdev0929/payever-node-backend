Feature: Storage API, object notation
  Background:
    Given I remember as "recordId" following value:
      """
      "a803d4c3-c447-4aab-a8c7-c7f184a8e77f"
      """
    Given I remember as "flowId" following value:
      """
      "c413b58d76deeb81b0d00dc391d9f99c"
      """
    Given I remember as "tokenId" following value:
      """
      "08a3fac8-43ef-4998-99aa-cabc97a39261"
      """
    Given I generate a guest token remember it as "guest_token"
    Given I authenticate as a user with the following data:
      """
      {
        "guestHash": "{{guest_token}}",
        "roles": [
          {
            "name": "guest",
            "permissions": []
          }
        ],
        "tokenId": "{{tokenId}}"
      }
      """
    Given I publish to Redis a pair with key "{{tokenId}}_payment_data" and JSON value:
      """
      {
        "paymentFlowIds": [
          "c413b58d76deeb81b0d00dc391d9f99c"
        ]
      }
      """

  Scenario: Put first record
    When I send a PUT request to "/api/storage/{{recordId}}/flow/{{flowId}}" with json:
      """
      {
        "property1": 1,
        "property2": "value2",
        "property3": {
          "property4": true
        }
      }
      """
    Then print last response
    Then the response status code should be 201
    And model "Record" with id "{{recordId}}" should contain json:
      """
      {
        "data": {
          "property1": 1,
          "property2": "value2",
          "property3": {
            "property4": true
          }
        }
      }
      """

  Scenario: Put with merge
    Given I use DB fixture "record/existing-record"
    When I send a PUT request to "/api/storage/{{recordId}}/flow/{{flowId}}" with json:
      """
      {
        "property1": 1,
        "property2": "value2",
        "property3": {
          "property4": true
        }
      }
      """
    Then print last response
    Then the response status code should be 201
    And model "Record" with id "{{recordId}}" should contain json:
      """
      {
        "data": {
          "existingProperty1": 1,
          "existingProperty2": "value2",
          "existingProperty3": {
            "existingProperty4": true
          },
          "property1": 1,
          "property2": "value2",
          "property3": {
            "property4": true
          }
        }
      }
      """

  Scenario: Put with merge and overwrite
    Given I use DB fixture "record/existing-record"
    When I send a PUT request to "/api/storage/{{recordId}}/flow/{{flowId}}" with json:
      """
      {
        "existingProperty1": 2,
        "existingProperty2": "new_value_2",
        "existingProperty3": {
          "existingProperty4": false
        }
      }
      """
    Then print last response
    Then the response status code should be 201
    And model "Record" with id "{{recordId}}" should contain json:
      """
      {
        "data": {
          "existingProperty1": 2,
          "existingProperty2": "new_value_2",
          "existingProperty3": {
            "existingProperty4": false
          }
        }
      }
      """

  Scenario: Put first record, with merchant access
    Given I remember as "tokenIdMerchant" following value:
      """
      "08a3fac8-43ef-4998-99aa-cabc97a39261"
      """
    Given I authenticate as a user with the following data:
      """
      {
        "email": "email@test.com",
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
        ],
        "tokenId": "{{tokenIdMerchant}}"
      }
      """
    Given I publish to Redis a pair with key "{{tokenIdMerchant}}_payment_data" and JSON value:
      """
      {
        "paymentFlowIds": [
          "c413b58d76deeb81b0d00dc391d9f99c"
        ]
      }
      """
    When I send a PUT request to "/api/storage/{{recordId}}/flow/{{flowId}}" with json:
      """
      {
        "property1": 1,
        "property2": "value2",
        "property3": {
          "property4": true
        }
      }
      """
    Then print last response
    Then the response status code should be 201
    And model "Record" with id "{{recordId}}" should contain json:
      """
      {
        "data": {
          "property1": 1,
          "property2": "value2",
          "property3": {
            "property4": true
          }
        }
      }
      """

  Scenario: Put, not authenticated
    Given I am not authenticated
    When I send a PUT request to "/api/storage/{{recordId}}/flow/{{flowId}}" with json:
      """
      {
        "property1": 1,
        "property2": "value2",
        "property3": {
          "property4": true
        }
      }
      """
    Then print last response
    Then the response status code should be 403
