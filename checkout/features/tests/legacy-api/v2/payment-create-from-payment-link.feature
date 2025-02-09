@payment-links
Feature: Payment create from payment link
  Background:
    Given I use DB fixture "legacy-api/payment-links/exists-channel-set-id-and-channel"
    Given I use DB fixture "legacy-api/payment-links/payment-links"
    Given I remember as "paymentLinkId" following value:
    """
    "71d15d86-7d1d-4178-b0c8-1d4e1230b2c0"
    """
    Given I remember as "paymentLinkIdCallbacks" following value:
    """
    "ed9312fa-3914-4f8e-a207-c78b83b83054"
    """
  Scenario: Create payment by payment link
    When I send a GET request to "/api/payment/link/{{paymentLinkId}}"
    And process messages from RabbitMQ "async_events_checkout_app_micro" channel
    Then print RabbitMQ message list
    And the RabbitMQ exchange "async_events" should contain following messages:
    """
    [
      {
        "name": "checkout.event.api-call.created",
        "payload": {
          "id": "*",
          "businessId": "2382ffce-5620-4f13-885d-3c069f9dd9b4"
        }
      }
    ]
    """

    Then print last response
    Then the response status code should be 301
    And the response header "location" should have value "*/api-call/*?channelSetId=ed2e320c-7031-413e-b2ca-ce4c54ca5466&forceHidePreviousSteps=true"
    Then I look for model "ApiCall" by following JSON and remember as "apiCall":
      """
      { }
      """
    And print storage key "apiCall"
    And stored value "apiCall" should contain json:
    """
    {
      "_id": "*",
      "payment_method": "ideal",
      "channel": "link",
      "amount": 1000,
      "order_id": "test_order_id",
      "currency": "EUR",
      "businessId": "2382ffce-5620-4f13-885d-3c069f9dd9b4"
    }
    """

  Scenario: Create payment by payment link with privacy data
    When I send a GET request to "/api/payment/link/{{paymentLinkId}}?email=test@gmail.com&phone=+234567876"
    And process messages from RabbitMQ "async_events_checkout_app_micro" channel
    Then print RabbitMQ message list
    And the RabbitMQ exchange "async_events" should contain following messages:
    """
    [
      {
        "name": "checkout.event.api-call.created",
        "payload": {
          "id": "*",
          "businessId": "2382ffce-5620-4f13-885d-3c069f9dd9b4"
        }
      }
    ]
    """

    Then print last response
    Then the response status code should be 301
    And the response header "location" should have value "*/api-call/*?channelSetId=ed2e320c-7031-413e-b2ca-ce4c54ca5466&forceHidePreviousSteps=true"
    Then I look for model "ApiCall" by following JSON and remember as "apiCall":
      """
      { }
      """
    And print storage key "apiCall"
    And stored value "apiCall" should contain json:
    """
    {
      "_id": "*",
      "payment_method": "ideal",
      "channel": "link",
      "amount": 1000,
      "order_id": "test_order_id",
      "currency": "EUR",
      "phone": " 234567876",
      "email": "test@gmail.com",
      "businessId": "2382ffce-5620-4f13-885d-3c069f9dd9b4"
    }
    """

  Scenario: Create payment by payment link with callbacks from checkout settings
    When I send a GET request to "/api/payment/link/{{paymentLinkId}}"
    And process messages from RabbitMQ "async_events_checkout_app_micro" channel
    Then print RabbitMQ message list
    And the RabbitMQ exchange "async_events" should contain following messages:
    """
    [
      {
        "name": "checkout.event.api-call.created",
        "payload": {
          "id": "*",
          "businessId": "2382ffce-5620-4f13-885d-3c069f9dd9b4"
        }
      }
    ]
    """

    Then print last response
    Then the response status code should be 301
    And the response header "location" should have value "*/api-call/*?channelSetId=ed2e320c-7031-413e-b2ca-ce4c54ca5466&forceHidePreviousSteps=true"
    Then I look for model "ApiCall" by following JSON and remember as "apiCall":
      """
      { }
      """
    And print storage key "apiCall"
    And stored value "apiCall" should contain json:
    """
    {
      "_id": "*",
      "payment_method": "ideal",
      "channel": "link",
      "amount": 1000,
      "order_id": "test_order_id",
      "currency": "EUR",
      "businessId": "2382ffce-5620-4f13-885d-3c069f9dd9b4",
      "cancel_url": "http://checkout.settings/cancelUrl",
      "customer_redirect_url": "http://checkout.settings/customerRedirectUrl",
      "failure_url": "http://checkout.settings/failureUrl",
      "notice_url": "http://checkout.settings/noticeUrl",
      "pending_url": "http://checkout.settings/pendingUrl",
      "success_url": "http://checkout.settings/successUrl"
    }
    """

  Scenario: Create payment by payment link with callbacks from payment link
    When I send a GET request to "/api/payment/link/{{paymentLinkIdCallbacks}}"
    And process messages from RabbitMQ "async_events_checkout_app_micro" channel
    Then print RabbitMQ message list
    And the RabbitMQ exchange "async_events" should contain following messages:
    """
    [
      {
        "name": "checkout.event.api-call.created",
        "payload": {
          "id": "*",
          "businessId": "2382ffce-5620-4f13-885d-3c069f9dd9b4"
        }
      }
    ]
    """

    Then print last response
    Then the response status code should be 301
    And the response header "location" should have value "*/api-call/*?channelSetId=ed2e320c-7031-413e-b2ca-ce4c54ca5466&forceHidePreviousSteps=true"
    Then I look for model "ApiCall" by following JSON and remember as "apiCall":
      """
      { }
      """
    And print storage key "apiCall"
    And stored value "apiCall" should contain json:
    """
    {
      "_id": "*",
      "payment_method": "ideal",
      "channel": "link",
      "amount": 500,
      "order_id": "test_order_id_2",
      "currency": "EUR",
      "businessId": "2382ffce-5620-4f13-885d-3c069f9dd9b4",
      "success_url": "http://payment.link/success_url",
      "pending_url": "http://payment.link/pending_url",
      "failure_url": "http://payment.link/failure_url",
      "cancel_url": "http://payment.link/cancel_url",
      "notice_url": "http://payment.link/notice_url",
      "customer_redirect_url": "http://payment.link/customer_redirect_url"
    }
    """
