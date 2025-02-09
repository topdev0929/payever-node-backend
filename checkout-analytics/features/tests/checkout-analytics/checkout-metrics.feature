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
      "08a3fac8-43ef-4998-99aa-cabc97a39261"
      """
    Given I generate a guest token remember it as "guest_token"

  Scenario: Send custom metrics with allowed access
    Given I authenticate as a user with the following data:
      """
      {
        "guestHash": "{{guest_token}}",
        "roles": [
          {
            "name": "guest",
            "permissions": []
          }
        ],
        "tokenId": "{{tokenId}}"
      }
      """
    Given I publish to Redis a pair with key "{{tokenId}}_payment_data" and JSON value:
    """
    {
      "paymentFlowIds": [
        "855fa0b785513426f76d6ade94c4f0c9"
      ]
    }
    """
    When I send a POST request to "/api/event" with json:
      """
      {
        "type": "RATE_STEP_PASSED",
        "paymentFlowId": "{{flowId}}",
        "paymentMethod": "santander_installment"
      }
      """
    Then print last response
    Then the response status code should be 201
    Then RabbitMQ exchange "async_events" should contain following ordered messages:
    """
    [
      {
        "name": "checkout-analytics.custom-metrics.added",
        "payload": {
          "paymentFlowId": "{{flowId}}",
          "paymentMethod": "santander_installment",
          "type": "RATE_STEP_PASSED"
        }
      }
    ]
    """

  Scenario: Send custom metrics with not allowed access
    Given I authenticate as a user with the following data:
      """
      {
        "guestHash": "{{guest_token}}",
        "roles": [
          {
            "name": "guest",
            "permissions": []
          }
        ],
        "tokenId": "{{tokenId}}"
      }
      """
    Given I publish to Redis a pair with key "{{tokenId}}_payment_data" and JSON value:
    """
    {
      "paymentFlowIds": [
        "no_access_flow_id"
      ]
    }
    """
    When I send a POST request to "/api/event" with json:
      """
      {
        "paymentFlowId": "{{flowId}}",
        "type": "RATE_STEP_PASSED"
      }
      """
    Then print last response
    Then the response status code should be 403

  Scenario: Send custom metrics without token
    When I send a POST request to "/api/event" with json:
      """
      {
        "paymentFlowId": "{{flowId}}",
        "type": "RATE_STEP_PASSED"
      }
      """
    Then print last response
    Then the response status code should be 403
