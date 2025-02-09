Feature: Should allow to release order in temporary or permanent status
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
    Given I remember as "testSku1" following value:
      """
      "sku_1"
      """
    Given I remember as "testSku2" following value:
      """
      "sku_2"
      """
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

  Scenario: Releasing order, anonymous
    Given I am not authenticated
    And I use DB fixture "order/release-order-temporary"
    When I send a PATCH request to "/api/business/{{businessId}}/order/{{orderId}}/release"
    Then print last response
    And the response status code should be 403

  Scenario: Releasing temporary order
    Given I use DB fixture "order/release-order-temporary"
    When I send a PATCH request to "/api/business/{{businessId}}/order/{{orderId}}/release"
    Then print last response
    And the response status code should be 200
    And look for model "Order" with id "{{orderId}}" and remember as "order"
    And stored value "order" should contain json:
      """
        {
          "status": "RELEASED"
        }
      """
    And print RabbitMQ message list
    And RabbitMQ exchange "async_events" should contain following ordered messages:
      """
      [
        {
          "name": "inventory.event.stock.added",
          "payload": {
           "business": {
             "id": "{{businessId}}"
           },
           "quantity": 10,
           "sku": "{{testSku1}}",
           "stock": 20
          }
        },
        {
          "name": "inventory.event.stock.added",
          "payload": {
           "business": {
             "id": "{{businessId}}"
           },
           "quantity": 10,
           "sku": "{{testSku2}}",
           "stock": 20
          }
        }

      ]
      """
    And look for model "Inventory" by following JSON and remember as "inventory1":
      """
        {
          "sku": "{{testSku1}}",
          "businessId": "{{businessId}}"
        }
      """
    And stored value "inventory1" should contain json:
      """
      {
        "stock": 20,
        "reserved": 0
      }
      """
    And look for model "Inventory" by following JSON and remember as "inventory2":
      """
        {
          "sku": "{{testSku2}}",
          "businessId": "{{businessId}}"
        }
      """
    And stored value "inventory2" should contain json:
      """
      {
        "stock": 20,
        "reserved": 0
      }
      """

  Scenario: Releasing permanent order
    Given I use DB fixture "order/release-order-permanent"
    When I send a PATCH request to "/api/business/{{businessId}}/order/{{orderId}}/release"
    Then print last response
    And the response status code should be 200
    And look for model "Order" with id "{{orderId}}" and remember as "order"
    And stored value "order" should contain json:
      """
        {
          "status": "RELEASED"
        }
      """
    And print RabbitMQ message list
    And RabbitMQ exchange "async_events" should contain following ordered messages:
      """
      [
        {
          "name": "inventory.event.stock.added",
          "payload": {
           "business": {
             "id": "{{businessId}}"
           },
           "quantity": 10,
           "sku": "{{testSku1}}",
           "stock": 20
          }
        },
        {
          "name": "inventory.event.stock.added",
          "payload": {
           "business": {
             "id": "{{businessId}}"
           },
           "quantity": 10,
           "sku": "{{testSku2}}",
           "stock": 20
          }
        }

      ]
      """
    And look for model "Inventory" by following JSON and remember as "inventory1":
      """
        {
          "sku": "{{testSku1}}",
          "businessId": "{{businessId}}"
        }
      """
    And stored value "inventory1" should contain json:
      """
      {
        "stock": 20,
        "reserved": 0
      }
      """
    And look for model "Inventory" by following JSON and remember as "inventory2":
      """
        {
          "sku": "{{testSku2}}",
          "businessId": "{{businessId}}"
        }
      """
    And stored value "inventory2" should contain json:
      """
      {
        "stock": 20,
        "reserved": 0
      }
      """

  Scenario: Releasing already released order
    Given I use DB fixture "order/release-order-released"
    When I send a PATCH request to "/api/business/{{businessId}}/order/{{orderId}}/release"
    Then print last response
    And the response status code should be 200
    And print RabbitMQ message list
    And RabbitMQ exchange "async_events" should not contain following messages:
      """
      [
        {
          "name": "inventory.event.stock.added"
        },
        {
          "name": "inventory.event.stock.added"
        }

      ]
      """
    And look for model "Inventory" by following JSON and remember as "inventory1":
      """
        {
          "sku": "{{testSku1}}",
          "businessId": "{{businessId}}"
        }
      """
    And stored value "inventory1" should contain json:
      """
      {
        "stock": 10,
        "reserved": 10
      }
      """
    And look for model "Inventory" by following JSON and remember as "inventory2":
      """
        {
          "sku": "{{testSku2}}",
          "businessId": "{{businessId}}"
        }
      """
    And stored value "inventory2" should contain json:
      """
      {
        "stock": 10,
        "reserved": 10
      }
      """

  Scenario: Releasing auto-released order
    Given I use DB fixture "order/release-order-auto-released"
    When I send a PATCH request to "/api/business/{{businessId}}/order/{{orderId}}/release"
    Then print last response
    And the response status code should be 200
    And print RabbitMQ message list
    And RabbitMQ exchange "async_events" should not contain following messages:
      """
      [
        {
          "name": "inventory.event.stock.added"
        },
        {
          "name": "inventory.event.stock.added"
        }

      ]
      """
    And look for model "Inventory" by following JSON and remember as "inventory1":
      """
        {
          "sku": "{{testSku1}}",
          "businessId": "{{businessId}}"
        }
      """
    And stored value "inventory1" should contain json:
      """
      {
        "stock": 10,
        "reserved": 10
      }
      """
    And look for model "Inventory" by following JSON and remember as "inventory2":
      """
        {
          "sku": "{{testSku2}}",
          "businessId": "{{businessId}}"
        }
      """
    And stored value "inventory2" should contain json:
      """
      {
        "stock": 10,
        "reserved": 10
      }
      """

  Scenario: Releasing closed order
    Given I use DB fixture "order/release-order-closed"
    When I send a PATCH request to "/api/business/{{businessId}}/order/{{orderId}}/release"
    Then print last response
    And the response status code should be 200
    And print RabbitMQ message list
    And RabbitMQ exchange "async_events" should not contain following messages:
      """
      [
        {
          "name": "inventory.event.stock.added"
        },
        {
          "name": "inventory.event.stock.added"
        }

      ]
      """
    And look for model "Inventory" by following JSON and remember as "inventory1":
      """
        {
          "sku": "{{testSku1}}",
          "businessId": "{{businessId}}"
        }
      """
    And stored value "inventory1" should contain json:
      """
      {
        "stock": 10,
        "reserved": 10
      }
      """
    And look for model "Inventory" by following JSON and remember as "inventory2":
      """
        {
          "sku": "{{testSku2}}",
          "businessId": "{{businessId}}"
        }
      """
    And stored value "inventory2" should contain json:
      """
      {
        "stock": 10,
        "reserved": 10
      }
      """
