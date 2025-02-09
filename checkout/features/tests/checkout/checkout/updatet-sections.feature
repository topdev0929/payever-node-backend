@update-default-checkout-sections
Feature: Checkout API Update sections

  Background:
    Given I remember as "businessId" following value:
      """
      "a803d4c3-c447-4aab-a8c7-c7f184a8e77f"
      """
    Given I remember as "checkoutId" following value:
      """
      "9f12e7bc-ee1a-48de-b3d2-8d49b19f5054"
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

  Scenario: Update sections
    Given I use DB fixture "checkout/checkout/get-sections/update-sections"
    When I send a PATCH request to "/api/business/{{businessId}}/checkout/default/sections" with json:
    """
    {
      "sections": [
        {
          "code": "choosePayment",
          "enabled": false,
          "order": 1
        },
        {
          "code": "address",
          "enabled": true,
          "order": 2
        },
        {
          "code": "payment",
          "enabled": false,
          "order": 3
        },
        {
          "code": "user",
          "enabled": false,
          "order": 4
        }
      ]
    }
    """
    Then print last response
    Then the response status code should be 200
    Then I look for model "Checkout" by following JSON and remember as "checkout":
      """
      {
        "_id": "{{checkoutId}}"
      }
      """
    And print storage key "checkout"
    And stored value "checkout" should contain json:
      """
      {
        "_id": "{{checkoutId}}",
        "sections": [
          {
            "_id": "*",
            "code": "order",
            "order": 0,
            "enabled": true
          },
          {
            "code": "user",
            "enabled": false,
            "order": 4,
            "_id": "*"
          },
          {
            "code": "address",
            "enabled": true,
            "order": 2,
            "_id": "*"
          },
          {
            "code": "choosePayment",
            "enabled": false,
            "order": 1,
            "_id": "*"
          },
          {
            "code": "payment",
            "enabled": false,
            "order": 3,
            "_id": "*"
          }
        ]
      }
      """
