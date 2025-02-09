Feature: Coupon apply to
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

  Scenario: Fail specific products
    Given I use DB fixture "coupons"
    Given I use DB fixture "business"
    When I send a POST request to "/business/376f8103-0e09-449a-8538-9384f2f1b992/coupons/apply-coupon" with json:
      """
      {
       "couponCode": "FIXED5EVERYONESPECPROD",
        "customerEmail": "test1@gmail.com",
        "shippingCountry": "de",
        "cart": [
          {
            "name": "test",
            "price": 1,
            "quantity": 2,
            "identifier": "test"
          }
        ]
      }
      """
    Then print last response
    And the response should contain json:
      """
      {
        "message": "Coupon only allowed for specific products"
      }
      """
    And the response status code should be 400

  Scenario: Pass specific products
    Given I use DB fixture "coupons"
    Given I use DB fixture "business"
    When I send a POST request to "/business/376f8103-0e09-449a-8538-9384f2f1b992/coupons/apply-coupon" with json:
      """
      {
       "couponCode": "FIXED5EVERYONESPECPROD",
        "customerEmail": "test1@gmail.com",
        "shippingCountry": "de",
        "cart": [
          {
            "name": "test",
            "price": 10,
            "quantity": 2,
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
            "price": 5,
            "quantity": 2,
            "identifier": "product-id-1"
          }
        ],
        "appliedOn": [
          {
            "identifier": "product-id-1",
            "reduction": 5
          }
        ]
      }
      """
    And the response status code should be 200

  Scenario: Fail specific product categories
    Given I mock RPC request "products.rpc.folder-plugin.readonly.es.search" to "products.rpc.folder-plugin.readonly.es.search" with:
      """
      {
        "requestPayload": [],
        "responsePayload": [{
          "collection": []
        }]
      }
      """
    Given I use DB fixture "coupons"
    Given I use DB fixture "business"
    When I send a POST request to "/business/376f8103-0e09-449a-8538-9384f2f1b992/coupons/apply-coupon" with json:
      """
      {
       "couponCode": "FIXED5EVERYONESPECCAT",
        "customerEmail": "test@gmail.com",
        "shippingCountry": "de",
        "cart": [
          {
            "name": "test",
            "price": 1,
            "quantity": 2,
            "identifier": "-cart-item-1-"
          }
        ]
      }
      """
    Then print last response
    And the response should contain json:
      """
      {
        "message": "Coupon only allowed for specific products categories"
      }
      """
    And the response status code should be 400

  Scenario: Pass specific product categories
    Given I mock RPC request "products.rpc.folder-plugin.readonly.es.search" to "products.rpc.folder-plugin.readonly.es.search" with:
      """
      {
        "requestPayload": [],
        "responsePayload": [{
          "collection": [{
            "category": "category-id-1",
            "serviceEntityId": "product-id-1"
          }]
        }]
      }
      """
    Given I use DB fixture "coupons"
    Given I use DB fixture "business"
    When I send a POST request to "/business/376f8103-0e09-449a-8538-9384f2f1b992/coupons/apply-coupon" with json:
      """
      {
       "couponCode": "FIXED5EVERYONESPECCAT",
        "customerEmail": "test1@gmail.com",
        "shippingCountry": "de",
        "cart": [
          {
            "name": "test",
            "price": 10,
            "quantity": 2,
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
            "price": 5,
            "quantity": 2,
            "identifier": "product-id-1"
          }
        ],
        "appliedOn": [
          {
            "identifier": "product-id-1",
            "reduction": 5
          }
        ]
      }
      """
    And the response status code should be 200
