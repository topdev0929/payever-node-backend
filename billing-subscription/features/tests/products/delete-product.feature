Feature: Delete products
  Background:
    Given I remember as "anotherBusinessId" following value:
      """
        "ffffffff-ffff-ffff-ffff-ffffffffffff"
      """
    Given I remember as "businessId" following value:
      """
        "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
      """
    Given I remember as "productId" following value:
      """
        "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
      """
    Given I remember as "stripeConnectionId" following value:
      """
        "eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee"
      """
    Given I remember as "paypalConnectionId" following value:
      """
        "dddddddd-dddd-dddd-dddd-dddddddddddd"
      """
    Given I remember as "subscriptionPlanId" following value:
      """
        "dddddddd-1111-1111-1111-111111111111"
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

  Scenario: Received delete product message
    Given I use DB fixture "products/delete-product"
    And I mock an axios request with parameters:
      """
      {
        "request": {
          "method": "post",
          "url": "http://third-party.service/api/business/{{businessId}}/connection/{{stripeConnectionId}}/action/plan-delete",
          "headers": {
            "Authorization": "*",
            "User-Agent": "Billing Subscriptions"
          },
          "body": "{\"id\":\"cccccccc-cccc-cccc-cccc-cccccccccccc\",\"product\":{\"id\":\"aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa\"}}"
        },
        "response": {
          "status": 200,
          "body": ""
        }
      }
      """
    And I mock an axios request with parameters:
      """
      {
        "request": {
          "method": "post",
          "url": "http://third-party.service/api/business/{{businessId}}/connection/{{paypalConnectionId}}/action/plan-delete",
          "headers": {
            "Authorization": "*",
            "User-Agent": "Billing Subscriptions"
          },
          "body": "{\"id\":\"ffffffff-ffff-ffff-ffff-ffffffffffff\",\"product\":{\"id\":\"aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa\"}}"
        },
        "response": {
          "status": 200,
          "body": ""
        }
      }
      """
    When I publish in RabbitMQ channel "async_events_billing_subscription_micro" message with json:
      """
      {
        "name": "products.event.product.removed",
        "payload": {
          "_id": "{{productId}}"
        }
      }
      """
    Then I process messages from RabbitMQ "async_events_billing_subscription_micro" channel
    And model "Product" with id "{{productId}}" should not exist
    And axios mocks should be called

  Scenario: Received delete product message, not authenticated
    Given I use DB fixture "products/delete-product"
    And I authenticate as a user with the following data:
      """
      {
        "email": "email@email.com",
        "roles": [
          {
            "name": "merchant",
            "permissions": [
              {
                "businessId": "{{anotherBusinessId}}",
                "acls": []
              }
            ]
          }
        ]
      }
      """
    When I send a POST request to "/api/products/{{businessId}}/disable/{{productId}}"
    Then print last response
    And the response status code should be 403

  Scenario: Received delete product message
    Given I use DB fixture "products/delete-product"
    And I mock an axios request with parameters:
      """
      {
        "request": {
          "method": "post",
          "url": "http://third-party.service/api/business/{{businessId}}/connection/{{stripeConnectionId}}/action/plan-delete",
          "headers": {
            "Authorization": "*",
            "User-Agent": "Billing Subscriptions"
          },
          "body": "{\"id\":\"cccccccc-cccc-cccc-cccc-cccccccccccc\",\"product\":{\"id\":\"aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa\"}}"
        },
        "response": {
          "status": 200,
          "body": ""
        }
      }
      """
    And I mock an axios request with parameters:
      """
      {
        "request": {
          "method": "post",
          "url": "http://third-party.service/api/business/{{businessId}}/connection/{{paypalConnectionId}}/action/plan-delete",
          "headers": {
            "Authorization": "*",
            "User-Agent": "Billing Subscriptions"
          },
          "body": "{\"id\":\"ffffffff-ffff-ffff-ffff-ffffffffffff\",\"product\":{\"id\":\"aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa\"}}"
        },
        "response": {
          "status": 200,
          "body": ""
        }
      }
      """
    When I send a POST request to "/api/products/{{businessId}}/disable/{{productId}}"
    Then print last response
    And the response status code should be 200
    And model "Product" with id "{{productId}}" should not exist
    And axios mocks should be called
