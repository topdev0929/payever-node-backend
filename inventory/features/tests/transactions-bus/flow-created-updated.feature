Feature: When received message "checkout.event.payment-flow.created" should add flow to order
  Background:
    Given I remember as "businessId" following value:
      """
      "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
      """
    Given I remember as "flowId" following value:
      """
      "ffffffff-ffff-ffff-ffff-ffffffffffff"
      """
    Given I remember as "anotherFlowId" following value:
      """
      "dddddddd-dddd-dddd-dddd-dddddddddddd"
      """
    Given I remember as "orderId" following value:
      """
      "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
      """

  Scenario: Receive "checkout.event.payment-flow.created" message, order doesn't have flow
    Given I use DB fixture "transactions-bus/payment-flow-created"
    When I publish in RabbitMQ channel "async_events_inventory_micro" message with json:
      """
      {
          "name": "checkout.event.payment-flow.created",
          "payload": {
            "flow": {
              "id": "{{flowId}}",
              "cart": {
                "order": "{{orderId}}"
              }
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
          "flow": "{{flowId}}"
        }
      """

  Scenario: Receive "checkout.event.payment-flow.created" message, order already has another flow
    Given I use DB fixture "transactions-bus/payment-flow-created-order-already-has-flow"
    When I publish in RabbitMQ channel "async_events_inventory_micro" message with json:
      """
      {
          "name": "checkout.event.payment-flow.created",
          "payload": {
            "flow": {
              "id": "{{anotherFlowId}}",
              "cart": {
                "order": "{{orderId}}"
              }
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
          "flow": "{{flowId}}"
        }
      """

  Scenario: Receive "checkout.event.payment-flow.updated" message, order doesn't have flow
    Given I use DB fixture "transactions-bus/payment-flow-updated"
    When I publish in RabbitMQ channel "async_events_inventory_micro" message with json:
      """
      {
          "name": "checkout.event.payment-flow.updated",
          "payload": {
            "flow": {
              "id": "{{flowId}}",
              "cart": {
                "order": "{{orderId}}"
              }
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
          "flow": "{{flowId}}"
        }
      """

  Scenario: Receive "checkout.event.payment-flow.updated" message, order already has another flow
    Given I use DB fixture "transactions-bus/payment-flow-updated-order-already-has-flow"
    When I publish in RabbitMQ channel "async_events_inventory_micro" message with json:
      """
      {
          "name": "checkout.event.payment-flow.updated",
          "payload": {
            "flow": {
              "id": "{{anotherFlowId}}",
              "cart": {
                "order": "{{orderId}}"
              }
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
          "flow": "{{flowId}}"
        }
      """
