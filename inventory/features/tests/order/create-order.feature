Feature: Should create order, if we are tracking inventory should make reservations of items, if negative inventory not allowed, should forbid ro reserve items more than in stock
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

  Scenario: Create order without cart
    Given I am not authenticated
    And I use DB fixture "order/create-order-no-items"
    When I send a POST request to "/api/business/{{businessId}}/order" with json:
      """
      {
        "id": "{{flowId}}"
      }
      """
    Then print last response
    And the response status code should be 201
    And the response should contain json:
      """
      {
        "reservations": [],
        "status": "TEMPORARY",
        "businessId": "{{businessId}}",
        "flow": "{{flowId}}",
        "_id": "*"
      }
      """

  Scenario: Create order with items, not trackable inventory, identified by sku
    Given I am not authenticated
    And I use DB fixture "order/create-order-not-trackable-inventory"
    When I send a POST request to "/api/business/{{businessId}}/order" with json:
      """
      {
        "id": "{{flowId}}",
        "cart": [
            {
              "id": "123",
              "sku": "{{testSku}}",
              "quantity": 100
            }
        ]
      }
      """
    Then print last response
    And the response status code should be 201
    And the response should contain json:
      """
      {
        "reservations": [],
        "status": "TEMPORARY",
        "_id": "*",
        "businessId": "{{businessId}}",
        "flow": "{{flowId}}"
      }
      """

  Scenario: Create order with items, not trackable inventory, identified by identifier
    Given I am not authenticated
    And I use DB fixture "order/create-order-not-trackable-inventory"
    When I send a POST request to "/api/business/{{businessId}}/order" with json:
      """
      {
        "id": "{{flowId}}",
        "cart": [
            {
              "id": "123",
              "identifier": "{{testSku}}",
              "quantity": 100
            }
        ]
      }
      """
    Then print last response
    And the response status code should be 201
    And the response should contain json:
      """
      {
        "reservations": [],
        "status": "TEMPORARY",
        "_id": "*",
        "businessId": "{{businessId}}",
        "flow": "{{flowId}}"
      }
      """

  Scenario: Create order with items, trackable inventory, identified by sku
    Given I am not authenticated
    And I use DB fixture "order/create-order-trackable-inventory"
    When I send a POST request to "/api/business/{{businessId}}/order" with json:
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
    And the response status code should be 201
    And look for model "Inventory" by following JSON and remember as "inventory":
      """
        {
          "sku": "{{testSku}}",
          "businessId": "{{businessId}}"
        }
      """
    And stored value "inventory" should contain json:
      """
      {
        "stock": "10",
        "reserved": 10
      }
      """
    And the response should contain json:
      """
      {
        "reservations": [
          {
            "_id": "*",
            "businessId": "{{businessId}}",
            "inventory": "{{inventory._id}}",
            "quantity": 10
          }

        ],
        "status": "TEMPORARY",
        "_id": "*",
        "businessId": "{{businessId}}",
        "flow": "{{flowId}}"
      }
      """
    And RabbitMQ exchange "async_events" should contain following ordered messages:
      """
      [
        {
           "name": "inventory.event.stock.subtracted",
           "payload": {
             "business": {
               "id": "{{businessId}}"
             },
             "quantity": 10,
             "sku": "{{testSku}}",
             "stock": 10
           }
         }
      ]
      """

  Scenario: Create order with items, trackable inventory, identified by identifier
    Given I am not authenticated
    And I use DB fixture "order/create-order-trackable-inventory"
    When I send a POST request to "/api/business/{{businessId}}/order" with json:
      """
      {
        "id": "{{flowId}}",
        "cart": [
            {
              "id": "123",
              "identifier": "{{testSku}}",
              "quantity": 10
            }
        ]
      }
      """
    Then print last response
    And the response status code should be 201
    And look for model "Inventory" by following JSON and remember as "inventory":
      """
        {
          "sku": "{{testSku}}",
          "businessId": "{{businessId}}"
        }
      """
    And stored value "inventory" should contain json:
      """
      {
        "stock": "10",
        "reserved": 10
      }
      """
    And the response should contain json:
      """
      {
        "reservations": [
          {
            "_id": "*",
            "businessId": "{{businessId}}",
            "inventory": "{{inventory._id}}",
            "quantity": 10
          }

        ],
        "status": "TEMPORARY",
        "_id": "*",
        "businessId": "{{businessId}}",
        "flow": "{{flowId}}"
      }
      """
    And RabbitMQ exchange "async_events" should contain following ordered messages:
      """
      [
        {
           "name": "inventory.event.stock.subtracted",
           "payload": {
             "business": {
               "id": "{{businessId}}"
             },
             "quantity": 10,
             "sku": "{{testSku}}",
             "stock": 10
           }
         }
      ]
      """

  Scenario: Create order with items, trackable inventory, stock is less then reservation and negative stock is allowed
    Given I am not authenticated
    And I use DB fixture "order/create-order-trackable-inventory-negative-stock-allowed"
    When I send a POST request to "/api/business/{{businessId}}/order" with json:
      """
      {
        "id": "{{flowId}}",
        "cart": [
            {
              "id": "123",
              "identifier": "{{testSku}}",
              "quantity": 100
            }
        ]
      }
      """
    Then print last response
    And the response status code should be 201
    And look for model "Inventory" by following JSON and remember as "inventory":
      """
        {
          "sku": "{{testSku}}",
          "businessId": "{{businessId}}"
        }
      """
    And stored value "inventory" should contain json:
      """
      {
        "stock": "-80",
        "reserved": 100
      }
      """
    And the response should contain json:
      """
      {
        "reservations": [
          {
            "_id": "*",
            "businessId": "{{businessId}}",
            "inventory": "{{inventory._id}}",
            "quantity": 100
          }

        ],
        "status": "TEMPORARY",
        "_id": "*",
        "businessId": "{{businessId}}",
        "flow": "{{flowId}}"
      }
      """
    And RabbitMQ exchange "async_events" should contain following ordered messages:
      """
      [
        {
           "name": "inventory.event.stock.subtracted",
           "payload": {
             "business": {
               "id": "{{businessId}}"
             },
             "quantity": 100,
             "sku": "{{testSku}}",
             "stock": -80
           }
         }
      ]
      """

  Scenario: Create order with items, trackable inventory, stock is less then reservation and negative stock is not allowed
    Given I am not authenticated
    And I use DB fixture "order/create-order-trackable-inventory-negative-stock-not-allowed"
    When I send a POST request to "/api/business/{{businessId}}/order" with json:
      """
      {
        "id": "{{flowId}}",
        "cart": [
            {
              "id": "123",
              "identifier": "{{testSku}}",
              "quantity": 100
            }
        ]
      }
      """
    Then print last response
    And the response status code should be 409
    And look for model "Inventory" by following JSON and remember as "inventory":
      """
        {
          "sku": "{{testSku}}",
          "businessId": "{{businessId}}"
        }
      """
    And stored value "inventory" should contain json:
      """
      {
        "stock": 20,
        "reserved": 0
      }
      """
    And the response should contain json:
      """
      {
        "message": {
           "error": "Failed while reservation attempt for following SKUs: .",
           "failedItems": [
             {
               "id": "123",
               "identifier": "test_sku",
               "quantity": 100
             }
           ]
         }
      }
      """
    And RabbitMQ exchange "async_events" should not contain following messages:
      """
      [
        {
           "name": "inventory.event.stock.subtracted"
         }
      ]
      """
