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
    Given I remember as "importedProductId" following value:
      """
        "dddddddd-dddd-dddd-dddd-dddddddddddd"
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

  Scenario: Create product subscription
    Given I use DB fixture "product-subscriptions/create-product-subscription"
    When I send a POST request to "/api/business/{{businessId}}/products/{{productId}}/subscription" with json:
      """
      {
        "product": {
          "id": "{{importedProductId}}"
        }
      }
      """
    Then print last response
    And the response status code should be 201
    And the response should contain json:
      """
        {
          "businessId": "{{businessId}}",
           "marketplaceProduct": {
              "_id": "{{productId}}"
           },
           "productId": "{{importedProductId}}",
           "_id": "*"
         }

      """
    And I store a response as "response"
    And model "ProductSubscription" with id "{{response._id}}" should contain json:
      """
      {
        "marketplaceProduct": "{{productId}}",
        "productId": "{{importedProductId}}",
        "businessId": "{{businessId}}"
      }
      """
    And model "Product" with id "{{productId}}" should contain json:
      """
      {
        "imports": 1
      }
      """

  Scenario: Received create product subscription request, subscription already exists
    Given I use DB fixture "product-subscriptions/create-product-subscription-already-exists"
    When I send a POST request to "/api/business/{{businessId}}/products/{{productId}}/subscription"
    Then print last response
    And the response status code should be 400


  Scenario: Received create product subscription request to own product
    Given I use DB fixture "product-subscriptions/create-product-subscription"
    And I authenticate as a user with the following data:
      """
      {
        "email": "email@email.com",
        "roles": [
          {
            "name": "merchant",
            "permissions": [
              {
                "businessId": "{{ownerBusinessId}}",
                "acls": []
              }
            ]
          }
        ]
      }
      """
    When I send a POST request to "/api/business/{{ownerBusinessId}}/products/{{productId}}/subscription"
    Then print last response
    And the response status code should be 400
