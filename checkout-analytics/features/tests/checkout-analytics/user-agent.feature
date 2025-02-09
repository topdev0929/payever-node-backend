@useragent
Feature: Checkout metrics API, send custom metrics
  Background:
    Given I remember as "checkoutMetricsId" following value:
      """
      "a803d4c3-c447-4aab-a8c7-c7f184a8e77f"
      """
    Given I remember as "flowId" following value:
      """
      "855fa0b785513426f76d6ade94c4f0c9"
      """
    Given I remember as "tokenId" following value:
      """
      "f24b7a60-69bf-43bd-bc2e-3859390a0f0e"
      """
    Given I generate a guest token remember it as "guest_token"

  Scenario: Send desktop user agent
    Given I use DB fixture "checkout-metrics/add-custom-metrics-bus-message/custom-metrics-exists"
    When I publish in RabbitMQ channel "async_events_checkout_analytics_app_micro" message with json:
    """
    {
      "name": "checkout-analytics.custom-metrics.added",
      "payload": {
        "paymentFlowId": "{{flowId}}",
        "paymentMethod": "santander_installment",
        "type": "RATE_STEP_PASSED",
        "userAgent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36"
      }
    }
    """
    Then I process messages from RabbitMQ "async_events_checkout_analytics_app_micro" channel
    Then look for model "CheckoutMetrics" by following JSON and remember as "checkoutMetrics":
    """
    { }
    """
    Then print storage key "checkoutMetrics"
    And stored value "checkoutMetrics" should contain json:
    """
      {
        "paymentMethod": "santander_installment",
        "customMetrics": [
          "RATE_STEP_PASSED",
          "RATE_STEP_PASSED"
        ],
        "device": "Desktop",
        "browser": "Chrome",
        "paymentFlowId": "*"
      }
    """

  Scenario: Send tablet user agent
    Given I use DB fixture "checkout-metrics/add-custom-metrics-bus-message/custom-metrics-exists"
    When I publish in RabbitMQ channel "async_events_checkout_analytics_app_micro" message with json:
    """
    {
      "name": "checkout-analytics.custom-metrics.added",
      "payload": {
        "paymentFlowId": "{{flowId}}",
        "paymentMethod": "santander_installment",
        "type": "RATE_STEP_PASSED",
        "userAgent": "Mozilla/5.0 (iPad; CPU OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148"
      }
    }
    """
    Then I process messages from RabbitMQ "async_events_checkout_analytics_app_micro" channel
    Then look for model "CheckoutMetrics" by following JSON and remember as "checkoutMetrics":
    """
    { }
    """
    Then print storage key "checkoutMetrics"
    And stored value "checkoutMetrics" should contain json:
    """
      {
        "paymentMethod": "santander_installment",
        "customMetrics": [
          "RATE_STEP_PASSED",
          "RATE_STEP_PASSED"
        ],
        "device": "Tablet",
        "browser": "Webkit",
        "paymentFlowId": "*"
      }
    """

  Scenario: Send mobile user agent
    Given I use DB fixture "checkout-metrics/add-custom-metrics-bus-message/custom-metrics-exists"
    When I publish in RabbitMQ channel "async_events_checkout_analytics_app_micro" message with json:
    """
    {
      "name": "checkout-analytics.custom-metrics.added",
      "payload": {
        "paymentFlowId": "{{flowId}}",
        "paymentMethod": "santander_installment",
        "type": "RATE_STEP_PASSED",
        "userAgent": "Mozilla/5.0 (Linux; Android 10; M2007J3SG) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.101 Mobile Safari/537.36"
      }
    }
    """
    Then I process messages from RabbitMQ "async_events_checkout_analytics_app_micro" channel
    Then look for model "CheckoutMetrics" by following JSON and remember as "checkoutMetrics":
    """
    { }
    """
    Then print storage key "checkoutMetrics"
    And stored value "checkoutMetrics" should contain json:
    """
      {
        "paymentMethod": "santander_installment",
        "customMetrics": [
          "RATE_STEP_PASSED",
          "RATE_STEP_PASSED"
        ],
        "device": "Mobile",
        "browser": "Chrome",
        "paymentFlowId": "*"
      }
    """
