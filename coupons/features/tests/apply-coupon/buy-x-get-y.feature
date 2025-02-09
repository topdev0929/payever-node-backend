Feature: Buy X Get Y coupon
  Background:
    Given I authenticate as a user with the following data:
      """
      {
        "id": "b5965f9d-5971-4b02-90eb-537a0a6e07c7",
        "email": "merchant@example.com",
        "roles": [
          {
            "name": "user",
            "permissions": []
          },
          {
            "name": "merchant",
            "permissions": [
              {
                "businessId": "376f8103-0e09-449a-8538-9384f2f1b992",
                "acls": []
              }
            ]
          }
        ]
      }
      """

  Scenario: Apply Buy x Get Y coupon -- Percentage off
    Given I mock RPC request "products.rpc.folder-plugin.readonly.es.search" to "products.rpc.folder-plugin.readonly.es.search" with:
      """
      {
        "requestPayload": [],
        "responsePayload": [{
          "collection": [{
            "serviceEntityId": "product-id-1",
            "name": "test",
            "category": "category-id-1",
            "price": 150
          }]
        }]
      }
      """
    Given I use DB fixture "coupons"
    Given I use DB fixture "business"
    When I send a POST request to "/business/376f8103-0e09-449a-8538-9384f2f1b992/coupons/apply-coupon" with json:
      """
      {
       "couponCode": "BA04B76A4B22",
        "customerEmail": "test1@gmail.com",
        "shippingCountry": "de",
        "cart": [
          {
            "name": "test",
            "price": 150,
            "quantity": 3,
            "identifier": "product-id-1"
          }
        ]
      }
      """
    Then print last response
    And the response should contain json:
      """
      {
        "cart": [
          {
            "name": "test",
            "price": 150,
            "quantity": 3,
            "identifier": "product-id-1"
          },
          {
            "name": "test",
            "price": 142.5,
            "quantity": 1,
            "identifier": "product-id-1"
          }
        ],

        "appliedOn": [
            {
                "identifier": "product-id-1",
                "reduction": 7.5
            }
        ]
      }
      """
    And the response status code should be 200

  Scenario: Apply Buy x Get Y coupon -- Free
    Given I mock RPC request "products.rpc.folder-plugin.readonly.es.search" to "products.rpc.folder-plugin.readonly.es.search" with:
      """
      {
        "requestPayload": [],
        "responsePayload": [{
          "collection": [{
            "serviceEntityId": "2004c351-70e8-487c-96a0-ca2716a2d5bd",
            "name": "free-product-1",
            "category": "category-id-1",
            "price": 5
          }]
        }]
      }
      """
    Given I use DB fixture "coupons"
    Given I use DB fixture "business"
    When I send a POST request to "/business/376f8103-0e09-449a-8538-9384f2f1b992/coupons/apply-coupon" with json:
      """
      {
       "couponCode": "BA04B76A4B21",
        "customerEmail": "test1@gmail.com",
        "shippingCountry": "de",
        "cart": [
          {
            "name": "test",
            "price": 150,
            "quantity": 3,
            "identifier": "product-id-1"
          }
        ]
      }
      """
    Then print last response
    And the response should contain json:
      """
      {
        "cart": [
          {
            "name": "test",
            "price": 150,
            "quantity": 3,
            "identifier": "product-id-1"
          },
          {
            "name": "free-product-1",
            "price": 0,
            "quantity": 1,
            "identifier": "2004c351-70e8-487c-96a0-ca2716a2d5bd"
          }
        ],

        "appliedOn": [
          {
            "identifier": "2004c351-70e8-487c-96a0-ca2716a2d5bd",
            "reduction": 5
          }
        ]
      }
      """
    And the response status code should be 200
