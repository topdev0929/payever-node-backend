Feature: When received message "checkout.event.payment.created" should add transaction id to order
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

  Scenario: Receive "checkout.event.payment.created" message
    Given I use DB fixture "transactions-bus/payment-created"
    When I publish in RabbitMQ channel "async_events_inventory_micro" message with json:
      """
      {
          "name": "checkout.event.payment.created",
          "payload": {
            "payment": {
              "payment_flow": {
                "id": "{{flowId}}"
              },
              "business": "{{businessId}}",
              "status": "ANY_STATUS",
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
          "transaction": "{{transactionId}}"
        }
      """
