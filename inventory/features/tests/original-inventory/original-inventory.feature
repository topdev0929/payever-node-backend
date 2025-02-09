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
    Given I remember as "businessId3" following value:
      """
      "dddddddd-dddd-dddd-dddd-dddddddddddd"
      """
    Given I remember as "inventoryId" following value:
      """
      "mmmmmmmm-mmmm-mmmm-mmmm-mmmmmmmmmmmm"
      """
    Given I remember as "inventoryId2" following value:
      """
      "nnnnnnnn-nnnn-nnnn-nnnn-nnnnnnnnnnnn"
      """
    Given I remember as "testSku" following value:
      """
      "test_sku"
      """
    Given I remember as "refSku" following value:
      """
      "ref_sku"
      """
    Given I remember as "refSku3" following value:
      """
      "ref_sku_3"
      """
    Given I remember as "updatedSku" following value:
      """
      "updated_sku"
      """
    Given I use DB fixture "original-inventory"

  Scenario: Get stock by sku, anonymous
    Given I am not authenticated
    When I send a GET request to "/api/business/{{businessId2}}/inventory/sku/{{refSku}}/stock"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      20
      """

  Scenario: Get inventory by sku
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
    When I send a POST request to "/api/business/{{businessId2}}/inventory/sku/stock" with json:
      """
      {
        "skus": ["ref_sku"]
      }
      """
    Then print last response
    And the response status code should be 201
    And the response should contain json:
      """
      {
        "ref_sku": 20
      }
      """

  Scenario: Creating new inventory with reference sku
    Given I authenticate as a user with the following data:
      """
      {
        "email": "email@email.com",
        "roles": [
          {
            "name": "merchant",
            "permissions": [
              {
                "businessId": "{{businessId3}}",
                "acls": []
              }
            ]
          }
        ]
      }
      """
    When I send a POST request to "/api/business/{{businessId3}}/inventory" with json:
      """
      {
        "originalInventory": {
          "businessId": "{{businessId}}",
          "sku": "{{testSku}}"
        },
        "sku": "{{refSku3}}",
        "isTrackable": true,
        "isNegativeStockAllowed": true
      }
      """
    Then print last response
    And the response status code should be 201
    And look for model "Inventory" by following JSON and remember as "inventory":
      """
      {
        "businessId": "{{businessId3}}",
        "sku": "{{refSku3}}"
      }
      """
    And stored value "inventory" should contain json:
      """
      {
        "originalInventory": {
          "businessId": "{{businessId}}",
          "sku": "{{testSku}}"
        },
        "stock": 20
      }
      """

  Scenario: Receive message that sku was updated
    When I publish in RabbitMQ channel "async_events_inventory_micro" message with json:
      """
      {
        "name": "products.event.product.sku-updated",
        "payload": {
          "business": {
            "id": "{{businessId}}"
          },
          "originalSku": "{{testSku}}",
          "updatedSku": "{{updatedSku}}"
        }
      }
      """
    Then I process messages from RabbitMQ "async_events_inventory_micro" channel
    And model "Inventory" found by following JSON should not exist:
      """
      {
        "sku": "{{testSku}}"
      }
      """
    And model "Inventory" with id "{{inventoryId}}" should contain json:
      """
      {
        "sku": "{{updatedSku}}"
      }
      """
    And model "Inventory" with id "{{inventoryId2}}" should contain json:
      """
      {
        "originalInventory": {
          "businessId": "{{businessId}}",
          "sku": "{{updatedSku}}"
        },
        "sku": "{{refSku}}"
      }
      """
