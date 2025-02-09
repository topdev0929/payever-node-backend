Feature: Create product subscriptions
  Background:
    Given I remember as "businessId" following value:
      """
        "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
      """
    Given I remember as "ownerBusinessId" following value:
      """
        "cccccccc-cccc-cccc-cccc-cccccccccccc"
      """
    Given I remember as "productId" following value:
      """
        "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
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

  Scenario: Delete product subscription
    Given I use DB fixture "product-subscriptions/create-product-subscription-already-exists"
    When I send a DELETE request to "/api/business/{{businessId}}/products/{{productId}}/subscription"
    Then print last response
    And the response status code should be 200
    And model "ProductSubscription" found by following JSON should not exist:
      """
      {
        "marketplaceProduct": "{{productId}}",
        "businessId": "{{businessId}}"
      }
      """
