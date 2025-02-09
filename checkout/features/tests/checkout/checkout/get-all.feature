Feature: Checkout API

  Background:
    Given I remember as "businessId" following value:
      """
      "a803d4c3-c447-4aab-a8c7-c7f184a8e77f"
      """
    Given I remember as "checkoutIdOne" following value:
      """
      "9f12e7bc-ee1a-48de-b3d2-8d49b19f5054"
      """
    Given I remember as "checkoutSubscriptionIdOne" following value:
      """
      "b0a201a7-b01f-40c4-bfd0-339cfb8d0675"
      """
    Given I remember as "checkoutIdTwo" following value:
      """
      "184a8e77-ee1a-48de-b3d2-8d49b19f5054"
      """
    Given I remember as "checkoutSubscriptionIdTwo" following value:
      """
      "f184a8e7-b01f-40c4-bfd0-339cfb8d0675"
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

  Scenario: Get all checkouts existing
    Given I use DB fixture "checkout/checkout/get-all/existing"
    When I send a GET request to "/api/business/{{businessId}}/checkout"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      [
        {
          "_id": "{{checkoutIdOne}}",
          "businessId": "{{businessId}}",
          "name": "Checkout 1",
          "default": true,
          "settings": "*",
          "sections": "*",
          "createdAt": "*",
          "updatedAt": "*",
          "__v": "*"
        },
        {
          "_id": "{{checkoutIdTwo}}",
          "businessId": "{{businessId}}",
          "name": "Checkout 2",
          "default": false,
          "settings": "*",
          "sections": "*",
          "createdAt": "*",
          "updatedAt": "*",
          "__v": "*"
        }
      ]
      """

  Scenario: Get all checkouts, no any
    Given I use DB fixture "checkout/checkout/get-all/no-any"
    When I send a GET request to "/api/business/{{businessId}}/checkout"
    Then print last response
    Then the response status code should be 200
    And the response should contain json:
      """
      []
      """

  Scenario: Get all checkouts, endpoint permission
    Given I am not authenticated
    Given I use DB fixture "checkout/checkout/get-all/existing"
    When I send a GET request to "/api/business/{{businessId}}/checkout"
    Then print last response
    Then the response status code should be 403
