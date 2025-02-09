Feature: Checkout API

  Background:
    Given I remember as "businessId" following value:
      """
      "a803d4c3-c447-4aab-a8c7-c7f184a8e77f"
      """
    Given I remember as "checkoutId" following value:
      """
      "9f12e7bc-ee1a-48de-b3d2-8d49b19f5054"
      """
    Given I remember as "defaultCheckoutId" following value:
      """
      "49b19f50-48de-b3d2-ee1a-8d49b19f5054"
      """
    Given I authenticate as a user with the following data:
      """
      {
        "email": "email@test.com",
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

  Scenario: Remove single checkout
    Given I use DB fixture "checkout/checkout/remove/existing-last-one"
    When I send a DELETE request to "/api/business/{{businessId}}/checkout/{{checkoutId}}"
    Then print last response
    And the response status code should be 403
    And the response should contain json:
      """
      {
        "statusCode":403,
        "error":"Forbidden",
        "message":"It is not allowed to delete last checkout"
      }
      """
    Then model "Checkout" with id "{{checkoutId}}" should contain json:
      """
      {
        "_id": "{{checkoutId}}"
      }
      """

  Scenario: Remove checkout with existing another default
    Given I use DB fixture "checkout/checkout/remove/existing-and-default"
    Given I mock Elasticsearch method "singleIndex" with:
      """
      {
        "arguments": [
          "checkouts",
          {
            "_id": "{{checkoutId}}"
          }
         ],
        "result": {}
      }
      """
    When I send a DELETE request to "/api/business/{{businessId}}/checkout/{{checkoutId}}"
    Then print last response
    And the response status code should be 202
    Then model "Checkout" with id "{{checkoutId}}" should not exist
    Then model "Checkout" with id "{{defaultCheckoutId}}" should contain json:
      """
      {
        "_id": "{{defaultCheckoutId}}",
        "default": true
      }
      """
    Then print RabbitMQ exchange "async_events" message list
    And the RabbitMQ exchange "async_events" should contain following messages:
      """
      [
        {
          "name":"media.event.media.removed",
          "payload":{
            "filename":"Existing checkout logo",
            "container":"images",
            "relatedEntity":{
              "id":"{{checkoutId}}",
              "type":"CheckoutModel"
            }
          }
        },
        {
          "name":"media.event.media.removed",
          "payload":{
            "filename":"Existing checkout logo-thumbnail",
            "container":"images",
            "relatedEntity":{
              "id":"{{checkoutId}}",
              "type":"CheckoutModel"
            }
          }
        },
        {
          "name":"media.event.media.removed",
          "payload":{
            "filename":"Existing checkout logo-blurred",
            "container":"images",
            "relatedEntity":{
              "id":"{{checkoutId}}",
              "type":"CheckoutModel"
            }
          }
        },
        {
          "name":"checkout.event.checkout.deleted",
          "payload":{
            "businessId":"{{businessId}}",
            "checkoutId":"{{checkoutId}}"
          }
        }
      ]
      """

  Scenario: Remove default checkout with existing non-default
    Given I use DB fixture "checkout/checkout/remove/existing-and-default"
    Given I mock Elasticsearch method "singleIndex" with:
      """
      {
        "arguments": [
          "checkouts",
          {
            "_id": "{{defaultCheckoutId}}"
          }
         ],
        "result": {}
      }
      """
    When I send a DELETE request to "/api/business/{{businessId}}/checkout/{{defaultCheckoutId}}"
    Then print last response
    And the response status code should be 202
    Then model "Checkout" with id "{{defaultCheckoutId}}" should not exist
    Then model "Checkout" with id "{{checkoutId}}" should contain json:
      """
      {
        "_id": "{{checkoutId}}",
        "default": true
      }
      """
    Then print RabbitMQ exchange "async_events" message list
    And the RabbitMQ exchange "async_events" should contain following messages:
      """
      [
        {
          "name":"media.event.media.removed",
          "payload":{
            "filename":"Default checkout logo",
            "container":"images",
            "relatedEntity":{
              "id":"{{defaultCheckoutId}}",
              "type":"CheckoutModel"
            }
          }
        },
        {
          "name":"media.event.media.removed",
          "payload":{
            "filename":"Default checkout logo-thumbnail",
            "container":"images",
            "relatedEntity":{
              "id":"{{defaultCheckoutId}}",
              "type":"CheckoutModel"
            }
          }
        },
        {
          "name":"media.event.media.removed",
          "payload":{
            "filename":"Default checkout logo-blurred",
            "container":"images",
            "relatedEntity":{
              "id":"{{defaultCheckoutId}}",
              "type":"CheckoutModel"
            }
          }
        },
        {
          "name":"checkout.event.checkout.deleted",
          "payload":{
            "businessId":"{{businessId}}",
            "checkoutId":"{{defaultCheckoutId}}"
          }
        }
      ]
      """

  Scenario: Remove checkout, endpoint permission
    Given I am not authenticated
    When I send a DELETE request to "/api/business/{{businessId}}/checkout/{{checkoutId}}"
    Then print last response
    And the response status code should be 403
