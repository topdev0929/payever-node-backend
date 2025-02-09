Feature: Original product
  Background:
    Given I remember as "businessId" following value:
      """
      "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
      """
    Given I remember as "businessId2" following value:
      """
      "cccccccc-cccc-cccc-cccc-cccccccccccc"
      """
    Given I remember as "inventoryId" following value:
      """
      "mmmmmmmm-mmmm-mmmm-mmmm-mmmmmmmmmmmm"
      """
    Given I remember as "inventoryId2" following value:
      """
      "nnnnnnnn-nnnn-nnnn-nnnn-nnnnnnnnnnnn"
      """
    Given I remember as "inventoryId3" following value:
      """
      "oooooooo-oooo-oooo-oooo-oooooooooooo"
      """
    Given I remember as "testSku" following value:
      """
      "test_sku"
      """
    Given I remember as "refSku" following value:
      """
      "ref_sku"
      """
    Given I use DB fixture "original-inventory"
    Given I authenticate as a user with the following data:
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

  Scenario: Add to inventory by sku
    When I send a PATCH request to "/api/business/{{businessId}}/inventory/sku/{{testSku}}/add" with json:
      """
      {
        "quantity": 3
      }
      """
    Then print last response
    And the response status code should be 200
    And model "Inventory" with id "{{inventoryId}}" should contain json:
      """
      {
        "stock": 23
      }
      """
    And model "Inventory" with id "{{inventoryId2}}" should contain json:
      """
      {
        "stock": 23
      }
      """

  Scenario: Remove from inventory by sku
    When I send a PATCH request to "/api/business/{{businessId}}/inventory/sku/{{testSku}}/subtract" with json:
      """
      {
        "quantity": 3
      }
      """
    Then print last response
    And the response status code should be 200
    And model "Inventory" with id "{{inventoryId}}" should contain json:
      """
      {
        "stock": 17
      }
      """
    And model "Inventory" with id "{{inventoryId2}}" should contain json:
      """
      {
        "stock": 17
      }
      """
    And model "Inventory" with id "{{inventoryId3}}" should contain json:
      """
      {
        "stock": 17
      }
      """

  Scenario: Add to ref inventory by sku and check if other refs are updated too
    Given I authenticate as a user with the following data:
      """
      {
        "email": "email@email.com",
        "roles": [
          {
            "name": "merchant",
            "permissions": [
              {
                "businessId": "{{businessId2}}",
                "acls": []
              }
            ]
          }
        ]
      }
      """
    When I send a PATCH request to "/api/business/{{businessId2}}/inventory/sku/{{refSku}}/add" with json:
      """
      {
        "quantity": 3
      }
      """
    Then print last response
    And the response status code should be 200
    And model "Inventory" with id "{{inventoryId}}" should contain json:
      """
      {
        "stock": 23
      }
      """
    And model "Inventory" with id "{{inventoryId2}}" should contain json:
      """
      {
        "stock": 23
      }
      """
    And model "Inventory" with id "{{inventoryId3}}" should contain json:
      """
      {
        "stock": 23
      }
      """

  Scenario: Add to ref inventory by sku and check if other refs are updated too
    Given I authenticate as a user with the following data:
      """
      {
        "email": "email@email.com",
        "roles": [
          {
            "name": "merchant",
            "permissions": [
              {
                "businessId": "{{businessId2}}",
                "acls": []
              }
            ]
          }
        ]
      }
      """
    When I send a PATCH request to "/api/business/{{businessId2}}/inventory/sku/{{refSku}}/subtract" with json:
      """
      {
        "quantity": 3
      }
      """
    Then print last response
    And the response status code should be 200
    And model "Inventory" with id "{{inventoryId}}" should contain json:
      """
      {
        "stock": 17
      }
      """
    And model "Inventory" with id "{{inventoryId2}}" should contain json:
      """
      {
        "stock": 17
      }
      """
    And model "Inventory" with id "{{inventoryId3}}" should contain json:
      """
      {
        "stock": 17
      }
      """
