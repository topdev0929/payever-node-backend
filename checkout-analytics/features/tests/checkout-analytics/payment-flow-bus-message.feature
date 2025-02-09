Feature: Payment flow bus message handling
  Background:
    Given I remember as "flowId" following value:
      """
      "08b1d4a82ca1c65aa35ad4c85f2ac8a8"
      """
    Given I remember as "apiCallId" following value:
      """
      "7e3dcb4bf94bf23f6d4113e5845fe9f8"
      """
    Given I remember as "businessId" following value:
      """
      "c4f3df1c-2167-4e1e-b85f-d065570f4494"
      """
    Given I remember as "checkoutMetricsId" following value:
      """
      "a803d4c3-c447-4aab-a8c7-c7f184a8e77f"
      """

  Scenario: Payment flow created event, new metrics
    When I publish in RabbitMQ channel "async_events_checkout_analytics_app_micro" message with json:
    """
    {
      "name": "checkout.event.payment-flow.created",
      "payload": {
        "flow": {
          "id": "{{flowId}}",
          "payment_method": "santander_installment_se",
          "api_call_create_id": "{{apiCallId}}",
          "business_id": "{{businessId}}"
        }
      }
    }
    """
    And process messages from RabbitMQ "async_events_checkout_analytics_app_micro" channel
    Then I look for model "CheckoutMetrics" by following JSON and remember as "checkoutMetrics":
    """
    {
      "paymentFlowId": "{{flowId}}"
    }
    """
    And stored value "checkoutMetrics" should contain json:
    """
    {
      "paymentFlowId": "{{flowId}}",
      "businessId": "{{businessId}}",
      "apiCallId": "{{apiCallId}}",
      "paymentMethod": "santander_installment_se"
    }
    """

  Scenario: Payment flow created event, metrics exists
    Given I use DB fixture "checkout-metrics/payment-flow-bus-message/flow-metrics-exists"
    When I publish in RabbitMQ channel "async_events_checkout_analytics_app_micro" message with json:
    """
    {
      "name": "checkout.event.payment-flow.created",
      "payload": {
        "flow": {
          "id": "{{flowId}}",
          "payment_method": "santander_installment_se",
          "api_call_create_id": "1234567890"
        }
      }
    }
    """
    And process messages from RabbitMQ "async_events_checkout_analytics_app_micro" channel
    Then model "CheckoutMetrics" with id "{{checkoutMetricsId}}" should contain json:
    """
    {
      "_id": "{{checkoutMetricsId}}",
      "paymentFlowId": "{{flowId}}",
      "apiCallId": "{{apiCallId}}",
      "paymentMethod": "santander_installment"
    }
    """

  Scenario: Payment flow updated event, new metrics
    Given I use DB fixture "checkout-metrics/payment-flow-bus-message/flow-metrics-exists"
    When I publish in RabbitMQ channel "async_events_checkout_analytics_app_micro" message with json:
    """
    {
      "name": "checkout.event.payment-flow.updated",
      "payload": {
        "flow": {
          "id": "{{flowId}}",
          "payment_method": "santander_installment_se",
          "api_call_create_id": "1234567890"
        }
      }
    }
    """
    And process messages from RabbitMQ "async_events_checkout_analytics_app_micro" channel
    Then model "CheckoutMetrics" with id "{{checkoutMetricsId}}" should contain json:
    """
    {
      "_id": "{{checkoutMetricsId}}",
      "paymentFlowId": "{{flowId}}",
      "apiCallId": "{{apiCallId}}",
      "paymentMethod": "santander_installment"
    }
    """
    And I look for model "CheckoutMetrics" by following JSON and remember as "checkoutMetrics":
    """
    {
      "apiCallId": "1234567890"
    }
    """
    And stored value "checkoutMetrics" should contain json:
    """
    {
      "paymentFlowId": "{{flowId}}",
      "apiCallId": "1234567890",
      "paymentMethod": "santander_installment_se"
    }
    """

  Scenario: Payment flow updated event, set metrics payment method
    Given I use DB fixture "checkout-metrics/payment-flow-bus-message/flow-metrics-payment-method-null"
    When I publish in RabbitMQ channel "async_events_checkout_analytics_app_micro" message with json:
    """
    {
      "name": "checkout.event.payment-flow.updated",
      "payload": {
        "flow": {
          "id": "{{flowId}}",
          "payment_method": "santander_installment_se"
        }
      }
    }
    """
    And process messages from RabbitMQ "async_events_checkout_analytics_app_micro" channel
    Then model "CheckoutMetrics" with id "{{checkoutMetricsId}}" should contain json:
    """
    {
      "_id": "{{checkoutMetricsId}}",
      "paymentFlowId": "{{flowId}}",
      "apiCallId": "{{apiCallId}}",
      "paymentMethod": "santander_installment_se"
    }
    """


