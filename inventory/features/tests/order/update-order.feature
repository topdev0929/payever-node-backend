Feature: Should update order, change reservation, release stock if needed
  Background:
    Given I remember as "businessId" following value:
      """
      "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
      """
    Given I remember as "orderId" following value:
      """
      "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
      """
    Given I remember as "flowId" following value:
      """
      "ffffffff-ffff-ffff-ffff-ffffffffffff"
      """
    Given I remember as "testSku" following value:
      """
      "test_sku"
      """

  Scenario: Update not temporary order
    Given I am not authenticated
    And I use DB fixture "order/update-order-not-temporary"
    When I send a PATCH request to "/api/business/{{businessId}}/order/{{orderId}}" with json:
      """
      {
        "id": "{{flowId}}",
        "cart": [
            {
              "id": "123",
              "sku": "{{testSku}}",
              "quantity": 10
            }
        ]
      }
      """
    Then print last response
    And the response status code should be 409
    And the response should contain json:
      """
      {
        "message": {
          "error": "Order is not updatable in PERMANENT status."
        }
      }
      """

  Scenario: Update order with no flow
    Given I am not authenticated
    And I use DB fixture "order/update-order-temporary-no-flow"
    When I send a PATCH request to "/api/business/{{businessId}}/order/{{orderId}}" with json:
      """
      {
        "id": "{{flowId}}",
        "cart": [
            {
              "id": "123",
              "sku": "{{testSku}}",
              "quantity": 10
            }
        ]
      }
      """
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "reservations": [],
        "status": "TEMPORARY",
        "_id": "{{orderId}}",
        "flow": "{{flowId}}",
        "transaction": "*",
        "businessId": "{{businessId}}"
      }
      """
    And look for model "Order" with id "{{orderId}}" and remember as "order"
    And stored value "order" should contain json:
      """
        {
          "flow": "{{flowId}}"
        }
      """

  Scenario: Update order with flow, flow not match
    Given I am not authenticated
    Given I remember as "anotherFlowId" following value:
      """
      "11111111-1111-1111-1111-111111111111"
      """
    And I use DB fixture "order/update-order-temporary-with-flow-and-reservations"
    When I send a PATCH request to "/api/business/{{businessId}}/order/{{orderId}}" with json:
      """
      {
        "id": "{{anotherFlowId}}",
        "cart": [
            {
              "id": "123",
              "sku": "{{testSku}}",
              "quantity": 10
            }
        ]
      }
      """
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
      {
        "reservations": [],
        "status": "TEMPORARY",
        "_id": "{{orderId}}",
        "flow": "{{flowId}}",
        "transaction": "*",
        "businessId": "{{businessId}}"
      }
      """
    And look for model "Order" with id "{{orderId}}" and remember as "order"
    And stored value "order" should contain json:
      """
        {
          "flow": "{{flowId}}"
        }
      """

  Scenario: Change order reservations
    Given I am not authenticated
    And I remember as "addNewSku" following value:
      """
      "add_new_sku"
      """
    And I remember as "increaseQuantitySku" following value:
      """
      "increase_quantity_sku"
      """
    And I remember as "decreaseQuantitySku" following value:
      """
      "decrease_quantity_sku"
      """
    And I remember as "removeFromSku" following value:
      """
      "remove_from_sku"
      """
    And I use DB fixture "order/update-order-temporary-with-flow-and-reservations"
    When I send a PATCH request to "/api/business/{{businessId}}/order/{{orderId}}" with json:
      """
      {
        "id": "{{flowId}}",
        "cart": [
          {
            "id": "123",
            "sku": "{{addNewSku}}",
            "quantity": 10
          },
          {
            "id": "123",
            "sku": "{{increaseQuantitySku}}",
            "quantity": 5
          },
          {
            "id": "123",
            "sku": "{{decreaseQuantitySku}}",
            "quantity": 5
          }
        ]
      }
      """
    Then print last response
    And the response status code should be 200
    And look for model "Inventory" by following JSON and remember as "addedInventory":
      """
        {
          "sku": "{{addNewSku}}",
          "businessId": "{{businessId}}"
        }
      """
    And stored value "addedInventory" should contain json:
      """
      {
        "stock": 0,
        "reserved": 10
      }
      """
    And look for model "Inventory" by following JSON and remember as "increasedQuantityInventory":
      """
        {
          "sku": "{{increaseQuantitySku}}",
          "businessId": "{{businessId}}"
        }
      """
    And stored value "increasedQuantityInventory" should contain json:
      """
      {
        "stock": 5,
        "reserved": 15
      }
      """
    And look for model "Inventory" by following JSON and remember as "decreasedQuantityInventory":
      """
        {
          "sku": "{{decreaseQuantitySku}}",
          "businessId": "{{businessId}}"
        }
      """
    And stored value "decreasedQuantityInventory" should contain json:
      """
      {
        "stock": 5,
        "reserved": 15
      }
      """
    And look for model "Inventory" by following JSON and remember as "removedInventory":
      """
        {
          "sku": "{{removeFromSku}}",
          "businessId": "{{businessId}}"
        }
      """
    And stored value "removedInventory" should contain json:
      """
      {
        "stock": "20",
        "reserved": 0
      }
      """
    And the response should contain json:
      """
      {
        "reservations": [
          {
            "inventory": "{{increasedQuantityInventory._id}}",
            "quantity": 5
          },
          {
            "inventory": "{{decreasedQuantityInventory._id}}",
            "quantity": 5
          },
          {
            "inventory": "{{addedInventory._id}}",
            "quantity": 10
          }
        ],
        "status": "TEMPORARY",
        "_id": "{{orderId}}",
        "flow": "{{flowId}}",
        "transaction": "*",
        "businessId": "{{businessId}}"
      }
      """
    And the response should not contain json:
      """
      {
        "reservations": [
          {
            "inventory": "{{removedInventory._id}}"
          }
        ]
      }
      """
    And print RabbitMQ message list
    And RabbitMQ exchange "async_events" should contain following ordered messages:
      """
      [
        {
          "name": "inventory.event.stock.subtracted",
          "payload": {
            "business": {
              "id": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
            },
            "quantity": 10,
            "sku": "add_new_sku",
            "stock": 0
          }
        },
        {
          "name": "inventory.event.stock.subtracted",
          "payload": {
            "business": {
              "id": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
            },
            "quantity": 5,
            "sku": "increase_quantity_sku",
            "stock": 5
          }
        },
        {
          "name": "inventory.event.stock.subtracted",
          "payload": {
            "business": {
              "id": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
            },
            "quantity": 5,
            "sku": "decrease_quantity_sku",
            "stock": 5
          }
        },
        {
          "name": "inventory.event.stock.added",
          "payload": {
            "business": {
              "id": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
            },
            "quantity": 10,
            "sku": "remove_from_sku",
            "stock": 20
          }
        }
  ]
      """

  Scenario: Change order reservations, error during reservation, when increasing existing
    Given I am not authenticated
    And I remember as "increaseQuantitySku" following value:
      """
      "increase_quantity_sku"
      """
    And I use DB fixture "order/update-order-temporary-with-flow-and-reservations"
    When I send a PATCH request to "/api/business/{{businessId}}/order/{{orderId}}" with json:
      """
      {
        "id": "{{flowId}}",
        "cart": [
          {
            "id": "123",
            "sku": "{{increaseQuantitySku}}",
            "quantity": 100
          }
        ]
      }
      """
    Then print last response
    And the response status code should be 409
    And look for model "Inventory" by following JSON and remember as "increasedQuantityInventory":
      """
        {
          "sku": "{{increaseQuantitySku}}",
          "businessId": "{{businessId}}"
        }
      """
    And stored value "increasedQuantityInventory" should contain json:
      """
      {
        "stock": 10,
        "reserved": 10
      }
      """
    And the response should contain json:
      """
      {
        "message": {
          "error": "Failed while reservation attempt for following SKUs: increase_quantity_sku.",
          "failedItems": [
            {
              "id": "123",
              "sku": "increase_quantity_sku",
              "quantity": 100
            }
          ]
        }
      }
      """
    And print RabbitMQ message list
    And RabbitMQ exchange "async_events" should not contain following messages:
      """
      [
        {
           "name": "inventory.event.stock.subtracted"
        },
        {
         "name": "inventory.event.stock.added"
        }
      ]
      """

  Scenario: Change order reservations, error during reservation, when adding
    Given I am not authenticated
    And I remember as "outOfStockSku" following value:
      """
      "out_of_stock_sku"
      """
    And I use DB fixture "order/update-order-temporary-with-flow-and-no-reservations"
    When I send a PATCH request to "/api/business/{{businessId}}/order/{{orderId}}" with json:
      """
      {
        "id": "{{flowId}}",
        "cart": [
          {
            "id": "123",
            "sku": "{{outOfStockSku}}",
            "quantity": 1
          }
        ]
      }
      """
    Then print last response
    And the response status code should be 409
