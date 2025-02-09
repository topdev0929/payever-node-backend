Feature: When received message "checkout.event.payment.updated" if payment was successful, order should be closed, otherwise released
  Background:
    Given I remember as "businessId" following value:
      """
      "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
      """
    Given I remember as "flowId" following value:
      """
      "ffffffff-ffff-ffff-ffff-ffffffffffff"
      """
    Given I remember as "orderId" following value:
      """
      "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
      """
    Given I remember as "transactionId" following value:
      """
      "cccccccc-cccc-cccc-cccc-cccccccccccc"
      """
    Given I remember as "testSku" following value:
      """
      "test_sku"
      """

  Scenario: Receive "checkout.event.payment.updated" message, payment status STATUS_ACCEPTED
    Given I use DB fixture "transactions-bus/payment-updated"
    When I publish in RabbitMQ channel "async_events_inventory_micro" message with json:
      """
      {
          "name": "checkout.event.payment.updated",
          "payload": {
            "payment": {
              "payment_flow": {
                "id": "{{flowId}}"
              },
              "business": "{{businessId}}",
              "status": "STATUS_ACCEPTED",
              "uuid": "{{transactionId}}"
            }
          }
        }
      """
    Then I process messages from RabbitMQ "async_events_inventory_micro" channel
    And print RabbitMQ message list
    And look for model "Order" with id "{{orderId}}" and remember as "order"
    And stored value "order" should contain json:
      """
        {
          "status": "CLOSED"
        }
      """

  Scenario: Receive "checkout.event.payment.updated" message, payment status STATUS_DECLINED
    Given I use DB fixture "transactions-bus/payment-updated"
    When I publish in RabbitMQ channel "async_events_inventory_micro" message with json:
      """
      {
          "name": "checkout.event.payment.updated",
          "payload": {
            "payment": {
              "payment_flow": {
                "id": "{{flowId}}"
              },
              "business": "{{businessId}}",
              "status": "STATUS_DECLINED",
              "uuid": "{{transactionId}}"
            }
          }
        }
      """
    Then I process messages from RabbitMQ "async_events_inventory_micro" channel
    And print RabbitMQ message list
    And look for model "Order" with id "{{orderId}}" and remember as "order"
    And stored value "order" should contain json:
      """
        {
          "status": "RELEASED"
        }
      """
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
            "sku": "{{testSku}}",
            "stock": 20
          }
        }
      ]
      """

  Scenario: Receive "checkout.event.payment.updated" message, payment status STATUS_FAILED
    Given I use DB fixture "transactions-bus/payment-updated"
    When I publish in RabbitMQ channel "async_events_inventory_micro" message with json:
      """
      {
          "name": "checkout.event.payment.updated",
          "payload": {
            "payment": {
              "payment_flow": {
                "id": "{{flowId}}"
              },
              "business": "{{businessId}}",
              "status": "STATUS_FAILED",
              "uuid": "{{transactionId}}"
            }
          }
        }
      """
    Then I process messages from RabbitMQ "async_events_inventory_micro" channel
    And print RabbitMQ message list
    And look for model "Order" with id "{{orderId}}" and remember as "order"
    And stored value "order" should contain json:
      """
        {
          "status": "RELEASED"
        }
      """
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
            "sku": "{{testSku}}",
            "stock": 20
          }
        }
      ]
      """

  Scenario: Receive "checkout.event.payment.updated" message, payment status STATUS_CANCELLED
    Given I use DB fixture "transactions-bus/payment-updated"
    When I publish in RabbitMQ channel "async_events_inventory_micro" message with json:
      """
      {
          "name": "checkout.event.payment.updated",
          "payload": {
            "payment": {
              "payment_flow": {
                "id": "{{flowId}}"
              },
              "business": "{{businessId}}",
              "status": "STATUS_CANCELLED",
              "uuid": "{{transactionId}}"
            }
          }
        }
      """
    Then I process messages from RabbitMQ "async_events_inventory_micro" channel
    And print RabbitMQ message list
    And look for model "Order" with id "{{orderId}}" and remember as "order"
    And stored value "order" should contain json:
      """
        {
          "status": "RELEASED"
        }
      """
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
            "sku": "{{testSku}}",
            "stock": 20
          }
        }
      ]
      """
