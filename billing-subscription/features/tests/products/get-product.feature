Feature: Get products
  Background:
    Given I remember as "businessId" following value:
      """
        "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
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

  Scenario: Received get product request
    Given I use DB fixture "products/get-product"
    When I send a GET request to "/api/products/{{businessId}}/{{productId}}"
    Then print last response
    And the response status code should be 200
    And the response should contain json:
      """
        {
           "_id": "{{productId}}",
           "businessId": "{{businessId}}",
           "price": 100,
           "title": "product"
         }
      """
