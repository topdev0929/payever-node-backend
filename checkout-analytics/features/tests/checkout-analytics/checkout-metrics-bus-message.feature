@busmessage
Feature: Checkout metrics bus message handling
  Background:
    Given I remember as "flowId" following value:
    """
    "855fa0b785513426f76d6ade94c4f0c9"
    """
    Given I remember as "checkoutMetricsId" following value:
    """
    "a803d4c3-c447-4aab-a8c7-c7f184a8e77f"
    """

  Scenario: Custom metrics added event
    Given I use DB fixture "checkout-metrics/add-custom-metrics-bus-message/custom-metrics-empty"
    When I publish in RabbitMQ channel "async_events_checkout_analytics_app_micro" message with json:
    """
    {
      "name": "checkout-analytics.custom-metrics.added",
      "payload": {
        "paymentFlowId": "{{flowId}}",
        "paymentMethod": "santander_installment",
        "type": "RATE_STEP_PASSED",
        "consoleErrors": [
          "error1",
          "error2"
        ]
      }
    }
    """
    And process messages from RabbitMQ "async_events_checkout_analytics_app_micro" channel
    And look for model "CheckoutMetrics" with id "{{checkoutMetricsId}}" and remember as "checkoutMetrics"
    Then print storage key "checkoutMetrics"
    And stored value "checkoutMetrics" should contain json:
    """
    {
      "_id": "{{checkoutMetricsId}}",
      "paymentFlowId": "{{flowId}}",
      "customMetrics": ["RATE_STEP_PASSED"],
      "device": "*",
      "consoleErrors": [
        "error1",
        "error2"
      ]
    }
    """

    Scenario: Custom metrics added one more event
    Given I use DB fixture "checkout-metrics/add-custom-metrics-bus-message/custom-metrics-exists"
    When I publish in RabbitMQ channel "async_events_checkout_analytics_app_micro" message with json:
    """
    {
      "name": "checkout-analytics.custom-metrics.added",
      "payload": {
        "paymentFlowId": "{{flowId}}",
        "paymentMethod": "santander_installment",
        "type": "FORM_SUBMITTED",
        "consoleErrors": [
          "error1",
          "error2"
        ]
      }
    }
    """
    And process messages from RabbitMQ "async_events_checkout_analytics_app_micro" channel
    And look for model "CheckoutMetrics" with id "{{checkoutMetricsId}}" and remember as "checkoutMetrics"
    Then print storage key "checkoutMetrics"
    And stored value "checkoutMetrics" should contain json:
    """
    {
      "_id": "{{checkoutMetricsId}}",
      "paymentFlowId": "{{flowId}}",
      "customMetrics": ["RATE_STEP_PASSED", "FORM_SUBMITTED"],
      "consoleErrors": [
        "exists error1",
        "exists error2",
        "error1",
        "error2"
      ]
    }
    """

  Scenario: Invalid custom metrics added event
    Given I use DB fixture "checkout-metrics/add-custom-metrics-bus-message/custom-metrics-exists"
    When I publish in RabbitMQ channel "async_events_checkout_analytics_app_micro" message with json:
    """
    {
      "name": "checkout-analytics.custom-metrics.added",
      "payload": {
        "type": "FORM_SUBMITTED"
      }
    }
    """
    And process messages from RabbitMQ "async_events_checkout_analytics_app_micro" channel
    Then model "CheckoutMetrics" with id "{{checkoutMetricsId}}" should contain json:
    """
    {
      "_id": "{{checkoutMetricsId}}",
      "paymentFlowId": "{{flowId}}",
      "customMetrics": ["RATE_STEP_PASSED"]
    }
    """

  Scenario: Custom metrics added event with invalid paymentFlowId
    Given I use DB fixture "checkout-metrics/add-custom-metrics-bus-message/custom-metrics-exists"
    When I publish in RabbitMQ channel "async_events_checkout_analytics_app_micro" message with json:
    """
    {
      "name": "checkout-analytics.custom-metrics.added",
      "payload": {
        "paymentFlowId": "invalid_flow_id",
        "paymentMethod": "santander_installment",
        "type": "FORM_SUBMITTED"
      }
    }
    """
    And process messages from RabbitMQ "async_events_checkout_analytics_app_micro" channel
    Then model "CheckoutMetrics" with id "{{checkoutMetricsId}}" should contain json:
    """
    {
      "_id": "{{checkoutMetricsId}}",
      "paymentFlowId": "{{flowId}}",
      "customMetrics": ["RATE_STEP_PASSED"]
    }
    """
