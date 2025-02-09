Feature: Lock product, after subscriptions was created
  Background:
    Given I remember as "businessId" following value:
      """
        "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
      """
    Given I remember as "productId" following value:
      """
        "cccccccc-cccc-cccc-cccc-cccccccccccc"
      """
    Given I remember as "variantId" following value:
      """
        "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
      """
    Given I remember as "anotherVariantId" following value:
      """
        "ffffffff-ffff-ffff-ffff-ffffffffffff"
      """

  Scenario: Received subscription message for a product without variants
    Given I use DB fixture "billing-subscription/lock-product-without-variants"
    And I publish in RabbitMQ channel "async_events_products_micro" message with json:
    """
      {
        "name": "subscriptions.event.plan.subscribe",
        "payload":{
          "businessId": "{{businessId}}",
          "productId": "{{productId}}"
        }
      }
    """
    When I process messages from RabbitMQ "async_events_products_micro" channel
    Then model "Product" with id "{{productId}}" should contain json:
      """
        {
          "isLocked": true
        }
      """

  Scenario: Received subscription message for a product variant
    Given I use DB fixture "billing-subscription/lock-product-variant"
    And I publish in RabbitMQ channel "async_events_products_micro" message with json:
    """
      {
        "name": "subscriptions.event.plan.subscribe",
        "payload":{
          "businessId": "{{businessId}}",
          "productId": "{{variantId}}"
        }
      }
    """
    When I process messages from RabbitMQ "async_events_products_micro" channel
    Then model "ProductVariant" with id "{{variantId}}" should contain json:
      """
        {
          "isLocked": true
        }
      """
    And model "ProductVariant" with id "{{anotherVariantId}}" should not contain json:
      """
        {
          "isLocked": true
        }
      """
    And model "Product" with id "{{productId}}" should not contain json:
      """
        {
          "isLocked": true
        }
      """
